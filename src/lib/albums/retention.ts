import 'server-only';
import { subDays, subMonths } from 'date-fns';
import type { AlbumReminderKind } from '@/lib/email/album-retention';

export const ALBUM_RETENTION_MONTHS = 6;

export function dueAlbumReminders(expiresAt: string, now = new Date()): AlbumReminderKind[] {
  const expiration = new Date(expiresAt);
  const reminders: Array<[AlbumReminderKind, Date]> = [
    ['one_month', subMonths(expiration, 1)],
    ['fifteen_days', subDays(expiration, 15)],
    ['seven_days', subDays(expiration, 7)],
  ];

  const current = reminders.filter(([, sendAt]) => sendAt <= now && expiration > now).at(-1);
  return current ? [current[0]] : [];
}

export function publicAppUrl() {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (configured) return configured;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return 'http://localhost:3000';
}
