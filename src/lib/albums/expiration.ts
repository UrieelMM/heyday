const DAY_MS = 24 * 60 * 60 * 1000;

export function albumExpiration(expiresAt: string, purgedAt: string | null = null, now = Date.now()) {
  const expiration = new Date(expiresAt).getTime();
  if (!Number.isFinite(expiration)) return null;
  return {
    daysRemaining: Math.max(0, Math.ceil((expiration - now) / DAY_MS)),
    expired: Boolean(purgedAt) || expiration <= now,
    date: new Intl.DateTimeFormat('es-MX', {
      day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Mexico_City',
    }).format(new Date(expiration)),
  };
}
