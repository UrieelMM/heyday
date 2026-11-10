import { Cake, Car, Church, GlassWater, Heart, Martini, Music, PartyPopper, Utensils } from 'lucide-react';
import type { InvitationConfig } from '@/types/invitation.types';

const timelineIcons = {
  church: Church, rings: Heart, cocktail: Martini, dinner: Utensils,
  waltz: Music, party: PartyPopper, cake: Cake, car: Car,
};

export function TimelineIcon({ icon }: { icon: InvitationConfig['content']['timeline'][number]['icon'] }) {
  const Icon = timelineIcons[icon] || GlassWater;
  return <Icon aria-hidden="true" className="mr-1.5 inline-block align-middle" size={15} />;
}

export function DressInspiration({ url }: { url?: string }) {
  if (!url) return null;
  return (
    <p className="mt-5 text-center text-sm">
      <a href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Ver inspiración de vestimenta</a>
    </p>
  );
}

export function HotelLinks({ hotel, includeBooking = true }: { hotel: InvitationConfig['content']['accommodation'][number]; includeBooking?: boolean }) {
  const phone = hotel.phone?.replace(/[^+\d]/g, '');
  if (!phone && (!includeBooking || !hotel.bookingUrl)) return null;
  return (
    <div className="mt-3 flex flex-wrap gap-3 text-sm">
      {includeBooking && hotel.bookingUrl && (
        <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Ver reserva</a>
      )}
      {phone && <a href={`tel:${phone}`} className="underline underline-offset-4">{hotel.phone}</a>}
    </div>
  );
}
