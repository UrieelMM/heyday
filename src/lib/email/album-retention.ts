import 'server-only';
import { Resend } from 'resend';

export type AlbumReminderKind = 'one_month' | 'fifteen_days' | 'seven_days';

const TEST_RECIPIENT = 'urieel.mm@gmail.com';

const reminderCopy: Record<AlbumReminderKind, string> = {
  one_month: '1 mes',
  fifteen_days: '15 días',
  seven_days: '7 días',
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character]!);
}

function resendKey() {
  // NEXT_PUBLIC_RESEND_API_KEY is supported temporarily because it is the
  // currently configured name. RESEND_API_KEY keeps the credential server-only.
  return process.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
}

export async function sendAlbumExpirationReminder(input: {
  idempotencyKey: string;
  kind: AlbumReminderKind;
  title: string;
  expiresAt: string;
  downloadUrl: string;
}) {
  const key = resendKey();
  if (!key) throw new Error('Falta configurar RESEND_API_KEY');

  const recipient = process.env.PHOTO_RETENTION_TEST_EMAIL || TEST_RECIPIENT;
  const from = process.env.RESEND_FROM_EMAIL || 'HeyDay <onboarding@resend.dev>';
  const timeLeft = reminderCopy[input.kind];
  const expiration = new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'long',
    timeZone: 'America/Mexico_City',
  }).format(new Date(input.expiresAt));

  const { data, error } = await new Resend(key).emails.send(
    {
      from,
      to: recipient,
      subject: `Tu álbum de ${input.title} se eliminará en ${timeLeft}`,
      html: `
      <div style="background:#f7f3ef;padding:32px 16px;font-family:Arial,sans-serif;color:#292523">
        <div style="max-width:560px;margin:auto;background:#fff;border-radius:16px;padding:32px">
          <p style="color:#a9583e;font-size:12px;letter-spacing:1.5px;text-transform:uppercase">HeyDay · Álbum de recuerdos</p>
          <h1 style="font-size:25px;line-height:1.25">Descarga tus fotografías</h1>
          <p>El álbum de <strong>${escapeHtml(input.title)}</strong> se eliminará en ${timeLeft}, el ${escapeHtml(expiration)}.</p>
          <p>Usa el siguiente enlace antes de esa fecha para descargar todas las fotografías en un archivo ZIP.</p>
          <p style="margin:28px 0"><a href="${escapeHtml(input.downloadUrl)}" style="display:inline-block;background:#a9583e;color:#fff;padding:13px 20px;border-radius:8px;text-decoration:none">Descargar mis fotografías</a></p>
          <p style="font-size:12px;color:#6c6a64">Este enlace es privado. No lo compartas con personas que no deban tener acceso al álbum.</p>
        </div>
      </div>`,
      text: `El álbum de ${input.title} se eliminará en ${timeLeft}, el ${expiration}. Descarga tus fotografías antes de esa fecha: ${input.downloadUrl}`,
    },
    { idempotencyKey: input.idempotencyKey },
  );

  if (error) throw new Error(error.message);
  return { id: data?.id, recipient };
}
