import type { InvitationConfig } from '@/types/invitation.types';

type Location = InvitationConfig['content']['locations'][number];

export const locationTypeLabels: Record<Location['type'], string> = {
  religious_ceremony: 'Ceremonia religiosa',
  civil_ceremony: 'Ceremonia civil',
  reception: 'Recepción',
  after_party: 'After party',
};

export function locationQuery(location: Location) {
  const { lat, lng } = location.coordinates;
  return lat || lng ? `${lat},${lng}` : [location.venueName, location.address].filter(Boolean).join(', ');
}

export function googleLocationUrl(location: Location) {
  return location.googleMapsUrl.trim() || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery(location))}`;
}

export function wazeLocationUrl(location: Location) {
  return location.wazeUrl.trim() || `https://waze.com/ul?q=${encodeURIComponent(locationQuery(location))}&navigate=yes`;
}
