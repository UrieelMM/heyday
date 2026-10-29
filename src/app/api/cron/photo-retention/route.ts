import { NextResponse } from 'next/server';
import { dueAlbumReminders, publicAppUrl } from '@/lib/albums/retention';
import { sendAlbumExpirationReminder } from '@/lib/email/album-retention';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const TEST_RECIPIENT = 'urieel.mm@gmail.com';

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET;
  return Boolean(secret && request.headers.get('authorization') === `Bearer ${secret}`);
}

async function processRetention(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const db = createAdminClient();
  const now = new Date();
  const horizon = new Date(now);
  horizon.setUTCDate(horizon.getUTCDate() + 32);
  const recipient = process.env.PHOTO_RETENTION_TEST_EMAIL || TEST_RECIPIENT;
  const report = { remindersSent: 0, remindersSkipped: 0, reminderErrors: 0, albumsPurged: 0, purgeErrors: 0 };

  const { data: expiringEvents, error: expiringError } = await db
    .from('events')
    .select('id,title,album_expires_at,album_download_token')
    .is('album_purged_at', null)
    .gt('album_expires_at', now.toISOString())
    .lte('album_expires_at', horizon.toISOString())
    .limit(500);
  if (expiringError) return NextResponse.json({ error: expiringError.message }, { status: 500 });

  for (const event of expiringEvents || []) {
    for (const kind of dueAlbumReminders(event.album_expires_at, now)) {
      const { count: photoCount, error: countError } = await db
        .from('event_memories')
        .select('id', { count: 'exact', head: true })
        .eq('event_id', event.id)
        .eq('type', 'photo');
      if (countError) {
        report.reminderErrors += 1;
        continue;
      }
      if (!photoCount) {
        report.remindersSkipped += 1;
        continue;
      }

      const { data: claim, error: claimError } = await db.rpc('claim_album_retention_notification', {
        p_event_id: event.id,
        p_reminder_type: kind,
        p_recipient_email: recipient,
      });
      if (claimError) {
        report.reminderErrors += 1;
        continue;
      }
      if (!claim?.id) {
        report.remindersSkipped += 1;
        continue;
      }

      try {
        const result = await sendAlbumExpirationReminder({
          idempotencyKey: `album-retention/${event.id}/${kind}`,
          kind,
          title: event.title,
          expiresAt: event.album_expires_at,
          downloadUrl: `${publicAppUrl()}/api/albums/download/${event.album_download_token}`,
        });
        const { error } = await db.from('album_retention_notifications').update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          provider_message_id: result.id || null,
          error_message: null,
        }).eq('id', claim.id);
        if (error) throw error;
        report.remindersSent += 1;
      } catch (error) {
        await db.from('album_retention_notifications').update({
          status: 'failed',
          error_message: (error instanceof Error ? error.message : 'Error desconocido').slice(0, 1000),
        }).eq('id', claim.id);
        report.reminderErrors += 1;
      }
    }
  }

  const { data: expiredEvents, error: expiredError } = await db
    .from('events')
    .select('id')
    .is('album_purged_at', null)
    .lte('album_expires_at', now.toISOString())
    .limit(100);
  if (expiredError) return NextResponse.json({ error: expiredError.message, ...report }, { status: 500 });

  for (const event of expiredEvents || []) {
    try {
      const { data: photos, error: photosError } = await db
        .from('event_memories')
        .select('id,storage_path,thumbnail_path')
        .eq('event_id', event.id)
        .eq('type', 'photo');
      if (photosError) throw photosError;

      const paths = (photos || []).flatMap(photo => [photo.storage_path, photo.thumbnail_path].filter((path): path is string => Boolean(path)));
      if (paths.length) {
        const { error: storageError } = await db.storage.from('guest-memories').remove(paths);
        if (storageError) throw storageError;
      }
      if (photos?.length) {
        const { error: deleteError } = await db.from('event_memories').delete().in('id', photos.map(photo => photo.id));
        if (deleteError) throw deleteError;
      }
      const { error: eventError } = await db.from('events').update({ album_purged_at: new Date().toISOString() }).eq('id', event.id);
      if (eventError) throw eventError;
      report.albumsPurged += 1;
    } catch {
      report.purgeErrors += 1;
    }
  }

  return NextResponse.json(report);
}

export async function GET(request: Request) {
  return processRetention(request);
}

export async function POST(request: Request) {
  return processRetention(request);
}
