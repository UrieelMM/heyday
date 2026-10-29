CREATE TABLE IF NOT EXISTS public.song_votes (
  song_id uuid NOT NULL REFERENCES public.song_requests(id) ON DELETE CASCADE,
  guest_group_id uuid NOT NULL REFERENCES public.guest_groups(id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, guest_group_id)
);
ALTER TABLE public.song_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin manages song votes" ON public.song_votes FOR ALL TO authenticated USING ((SELECT public.is_heyday_admin())) WITH CHECK ((SELECT public.is_heyday_admin()));

-- Song creation includes the author's vote; the pair constraint prevents repeated votes.
CREATE OR REPLACE FUNCTION public.vote_for_song(p_song uuid, p_group uuid) RETURNS void
LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.song_requests s JOIN public.guest_groups g ON g.event_id = s.event_id WHERE s.id = p_song AND s.is_approved AND g.id = p_group) THEN RAISE EXCEPTION 'Canción o pase inválido'; END IF;
  INSERT INTO public.song_votes(song_id, guest_group_id) VALUES (p_song, p_group);
  UPDATE public.song_requests SET votes_count = votes_count + 1 WHERE id = p_song;
END; $$;
REVOKE EXECUTE ON FUNCTION public.vote_for_song(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.vote_for_song(uuid, uuid) TO service_role;

-- Serialize scans per guest group, reject stale or previously used passes, and log atomically.
CREATE OR REPLACE FUNCTION public.check_in_group(p_event uuid, p_group uuid, p_adults integer, p_children integer)
RETURNS TABLE(group_name text, table_name text, checked_in integer) LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE g public.guest_groups%ROWTYPE;
BEGIN
  SELECT * INTO g FROM public.guest_groups WHERE id = p_group AND event_id = p_event FOR UPDATE;
  IF NOT FOUND OR g.rsvp_status <> 'confirmed' OR g.confirmed_adults <> p_adults OR g.confirmed_children <> p_children OR p_adults + p_children < 1 THEN RAISE EXCEPTION 'El pase no está vigente o no tiene una confirmación válida'; END IF;
  IF g.checked_in_count > 0 THEN RAISE EXCEPTION 'Este pase ya fue registrado'; END IF;
  UPDATE public.guest_groups SET checked_in_count = p_adults + p_children, last_checked_in_at = now() WHERE id = g.id;
  INSERT INTO public.rsvp_checkin_logs(event_id, group_id, action_type, adults_count, children_count) VALUES (p_event, p_group, 'qr_checkin', p_adults, p_children);
  RETURN QUERY SELECT g.group_name, g.table_name_fallback, p_adults + p_children;
END; $$;
REVOKE EXECUTE ON FUNCTION public.check_in_group(uuid, uuid, integer, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_in_group(uuid, uuid, integer, integer) TO authenticated;

-- Limit voice messages independently of photo quota, including concurrent uploads.
CREATE OR REPLACE FUNCTION public.enforce_audio_limit() RETURNS trigger LANGUAGE plpgsql SET search_path = '' AS $$
BEGIN
 IF NEW.type = 'audio_message' THEN
   PERFORM 1 FROM public.events WHERE id = NEW.event_id FOR UPDATE;
   IF NEW.guest_group_id IS NULL OR NOT EXISTS (SELECT 1 FROM public.guest_groups WHERE id = NEW.guest_group_id AND event_id = NEW.event_id) THEN RAISE EXCEPTION 'Se requiere un pase válido'; END IF;
   IF (SELECT count(*) FROM public.event_memories WHERE event_id = NEW.event_id AND guest_group_id = NEW.guest_group_id AND type = 'audio_message' AND (TG_OP = 'INSERT' OR id <> NEW.id)) >= 3 THEN RAISE EXCEPTION 'Cada pase permite hasta 3 mensajes de voz'; END IF;
 END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER trg_audio_limit BEFORE INSERT OR UPDATE OF event_id, type, guest_group_id ON public.event_memories FOR EACH ROW EXECUTE FUNCTION public.enforce_audio_limit();
