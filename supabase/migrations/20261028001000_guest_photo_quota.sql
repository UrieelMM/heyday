-- Each guest link identifies a group; its shared allowance is five photos.
ALTER TABLE public.event_memories ADD COLUMN IF NOT EXISTS guest_group_id uuid REFERENCES public.guest_groups(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_memories_guest_group ON public.event_memories(event_id, guest_group_id) WHERE type = 'photo';
CREATE OR REPLACE FUNCTION public.enforce_event_photo_limit() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
  IF NEW.type = 'photo' THEN
    PERFORM 1 FROM public.events WHERE id = NEW.event_id FOR UPDATE;
    IF NEW.guest_group_id IS NULL OR NOT EXISTS (SELECT 1 FROM public.guest_groups WHERE id = NEW.guest_group_id AND event_id = NEW.event_id) THEN
      RAISE EXCEPTION 'Se requiere un pase válido para subir fotos' USING ERRCODE = 'check_violation';
    END IF;
    IF (SELECT count(*) FROM public.event_memories WHERE event_id = NEW.event_id AND type = 'photo' AND (TG_OP = 'INSERT' OR id <> NEW.id)) >= 50 THEN
      RAISE EXCEPTION 'El álbum permite hasta 50 fotos' USING ERRCODE = 'check_violation';
    END IF;
    IF (SELECT count(*) FROM public.event_memories WHERE event_id = NEW.event_id AND guest_group_id = NEW.guest_group_id AND type = 'photo' AND (TG_OP = 'INSERT' OR id <> NEW.id)) >= 5 THEN
      RAISE EXCEPTION 'Cada pase permite hasta 5 fotos' USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_event_photo_limit ON public.event_memories;
CREATE TRIGGER trg_event_photo_limit BEFORE INSERT OR UPDATE OF event_id, type, guest_group_id ON public.event_memories FOR EACH ROW EXECUTE FUNCTION public.enforce_event_photo_limit();
