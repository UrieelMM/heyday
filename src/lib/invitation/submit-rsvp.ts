import type { RsvpSubmissionInput } from '@/lib/schemas/invitation-config.schema';

type ConfirmedPass = {
  qrPayload: string;
  groupName: string;
  confirmedAdults: number;
  confirmedChildren: number;
  tableName: string | null;
};

export async function submitGuestRsvp(slug: string, input: RsvpSubmissionInput): Promise<ConfirmedPass | null> {
  const response = await fetch(`/api/public/invitations/${encodeURIComponent(slug)}/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'No se pudo guardar la respuesta');
  return result.pass;
}
