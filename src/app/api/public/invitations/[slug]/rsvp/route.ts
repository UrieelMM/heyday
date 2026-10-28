import { NextResponse } from 'next/server';
import { rsvpSubmissionSchema } from '@/lib/schemas/invitation-config.schema';
import { signQrPass } from '@/lib/crypto/qr-signer';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const parsed = rsvpSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos de confirmación inválidos',
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const secret =
      process.env.QR_MASTER_SECRET || 'invitaciones-digitales-secret-key-2026';

    const qrPayload = data.willAttend
      ? signQrPass(
          {
            eventId: slug,
            groupId: data.guestToken || 'open-guest',
            confirmedAdults: data.confirmedAdults,
            confirmedChildren: data.confirmedChildren,
          },
          secret
        )
      : null;

    return NextResponse.json({
      success: true,
      rsvpStatus: data.willAttend ? 'confirmed' : 'declined',
      pass: qrPayload
        ? {
            qrPayload,
            groupName: data.groupName,
            confirmedAdults: data.confirmedAdults,
            confirmedChildren: data.confirmedChildren,
            tableName: 'Mesa Asignada en Recepción',
          }
        : null,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Error interno al procesar la confirmación' },
      { status: 500 }
    );
  }
}
