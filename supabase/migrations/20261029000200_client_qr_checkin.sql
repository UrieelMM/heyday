-- El endpoint del editor valida el PIN y la firma QR antes de invocar este RPC
-- con la clave de servicio. El RPC conserva el bloqueo por grupo y la bitácora
-- atómica definidos en la migración 11.
GRANT EXECUTE ON FUNCTION public.check_in_group(uuid, uuid, integer, integer) TO service_role;

-- Defensa adicional: un grupo solo puede tener una entrada QR en la bitácora.
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_qr_checkin_per_group
  ON public.rsvp_checkin_logs(group_id)
  WHERE action_type = 'qr_checkin';
