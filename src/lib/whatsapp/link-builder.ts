export interface WhatsappInviteLinkInput {
  phone: string;
  groupName: string;
  eventTitle: string;
  allocatedAdults: number;
  allocatedChildren: number;
  invitationUrl: string;
}

export function buildWhatsappInviteUrl(input: WhatsappInviteLinkInput): string {
  const cleanPhone = input.phone.replace(/[^\d]/g, '');
  const passesText =
    input.allocatedChildren > 0
      ? `${input.allocatedAdults} adultos y ${input.allocatedChildren} niños`
      : `${input.allocatedAdults} ${input.allocatedAdults === 1 ? 'pase' : 'pases'}`;

  const message = `¡Hola *${input.groupName}*! ✨\n\nCon mucha ilusión les compartimos la invitación digital a *${input.eventTitle}*.\n\nTienen reservados *${passesText}*.\n\nPor favor abran su sobre personalizado y confírmennos su asistencia aquí:\n${input.invitationUrl}`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
