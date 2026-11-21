import type { GuestGroup } from '@/types/invitation.types';

export function savedGuestPass(guest?: GuestGroup | null) {
  if (guest?.rsvpStatus !== 'confirmed' || !guest.qrPayload) return null;
  return {
    qrPayload: guest.qrPayload,
    groupName: guest.groupName,
    adults: guest.confirmedAdults,
    children: guest.confirmedChildren,
    tableName: guest.tableName || 'Mesa por asignar',
  };
}

export function savedGuestCount(guest: GuestGroup | null | undefined, kind: 'adults' | 'children', fallback: number) {
  if (!guest) return fallback;
  if (guest.rsvpStatus === 'pending') return kind === 'adults' ? guest.allocatedAdults : guest.allocatedChildren;
  return kind === 'adults' ? guest.confirmedAdults : guest.confirmedChildren;
}
