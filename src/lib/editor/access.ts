import 'server-only';

import { createHmac, randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

const COOKIE_NAME = 'heyday_editor';
const SESSION_SECONDS = 60 * 60 * 24 * 7;

export function makePin() {
  return randomInt(0, 10000).toString().padStart(4, '0');
}

export function hashPin(pin: string) {
  const salt = randomBytes(16);
  return `${salt.toString('hex')}:${scryptSync(pin, salt, 32).toString('hex')}`;
}

export function verifyPin(pin: string, stored: string | null) {
  if (!stored || !/^\d{4}$/.test(pin)) return false;
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;
  try {
    const expected = Buffer.from(hashHex, 'hex');
    const actual = scryptSync(pin, Buffer.from(saltHex, 'hex'), expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch { return false; }
}

function sessionSecret() {
  const secret = process.env.EDITOR_SESSION_SECRET || process.env.SUPABASE_SECRET_KEY;
  if (!secret) throw new Error('Falta configurar el secreto del editor');
  return secret;
}

function signature(payload: string) {
  return createHmac('sha256', sessionSecret()).update(payload).digest('hex');
}

export async function setEditorSession(eventId: string, pinVersion: string) {
  const expiry = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `${eventId}.${pinVersion}.${expiry}`;
  (await cookies()).set(COOKIE_NAME, `${payload}.${signature(payload)}`, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax',
    maxAge: SESSION_SECONDS, path: '/',
  });
}

export async function clearEditorSession() {
  (await cookies()).delete(COOKIE_NAME);
}

async function hasAdminSession() {
  const client = await createClient();
  const { data: { user }, error } = await client.auth.getUser();
  if (error || !user) return false;
  const { data: profile } = await createAdminClient().from('profiles').select('role').eq('id', user.id).maybeSingle();
  return profile?.role === 'agency_admin' || profile?.role === 'superadmin';
}

export async function requireAdmin() {
  return hasAdminSession();
}

export async function canEditEvent(event: { id: string; editor_pin_version: string }) {
  if (await hasAdminSession()) return true;
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 4) return false;
  const [eventId, version, expiryText, receivedSignature] = parts;
  const expiry = Number(expiryText);
  if (eventId !== event.id || version !== event.editor_pin_version || !Number.isSafeInteger(expiry) || expiry < Date.now() / 1000) return false;
  const expected = Buffer.from(signature(`${eventId}.${version}.${expiryText}`), 'hex');
  const received = Buffer.from(receivedSignature, 'hex');
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
