-- Álbumes privados: miniaturas, descarga y eliminación automática a seis meses.
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS album_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS album_download_token text,
  ADD COLUMN IF NOT EXISTS album_purged_at timestamptz;

UPDATE public.events
SET album_expires_at = created_at + interval '6 months'
WHERE album_expires_at IS NULL;

UPDATE public.events
SET album_download_token = encode(extensions.gen_random_bytes(32), 'hex')
WHERE album_download_token IS NULL;

ALTER TABLE public.events
  ALTER COLUMN album_expires_at SET DEFAULT (now() + interval '6 months'),
  ALTER COLUMN album_expires_at SET NOT NULL,
  ALTER COLUMN album_download_token SET DEFAULT encode(extensions.gen_random_bytes(32), 'hex'),
  ALTER COLUMN album_download_token SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_events_album_download_token
  ON public.events(album_download_token);
CREATE INDEX IF NOT EXISTS idx_events_album_expiration
  ON public.events(album_expires_at)
  WHERE album_purged_at IS NULL;

ALTER TABLE public.event_memories
  ADD COLUMN IF NOT EXISTS thumbnail_path text;

CREATE TABLE IF NOT EXISTS public.album_retention_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  reminder_type text NOT NULL CHECK (reminder_type IN ('one_month', 'fifteen_days', 'seven_days')),
  recipient_email text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  attempts smallint NOT NULL DEFAULT 1 CHECK (attempts BETWEEN 1 AND 5),
  provider_message_id text,
  error_message text,
  last_attempt_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, reminder_type)
);

ALTER TABLE public.album_retention_notifications ENABLE ROW LEVEL SECURITY;

-- Atomically claims a reminder. Failed deliveries and abandoned pending claims
-- can be retried, but a successfully sent reminder can never be duplicated.
CREATE OR REPLACE FUNCTION public.claim_album_retention_notification(
  p_event_id uuid,
  p_reminder_type text,
  p_recipient_email text
)
RETURNS public.album_retention_notifications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  claimed public.album_retention_notifications;
BEGIN
  INSERT INTO public.album_retention_notifications (
    event_id,
    reminder_type,
    recipient_email
  ) VALUES (
    p_event_id,
    p_reminder_type,
    p_recipient_email
  )
  ON CONFLICT (event_id, reminder_type) DO UPDATE
  SET status = 'pending',
      recipient_email = EXCLUDED.recipient_email,
      attempts = public.album_retention_notifications.attempts + 1,
      error_message = NULL,
      last_attempt_at = now()
  WHERE public.album_retention_notifications.attempts < 5
    AND (
      public.album_retention_notifications.status = 'failed'
      OR (
        public.album_retention_notifications.status = 'pending'
        AND public.album_retention_notifications.last_attempt_at < now() - interval '30 minutes'
      )
    )
  RETURNING * INTO claimed;

  RETURN claimed;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_album_retention_notification(uuid, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_album_retention_notification(uuid, text, text) TO service_role;
