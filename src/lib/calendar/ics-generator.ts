export interface CalendarEventInput {
  title: string;
  description: string;
  location: string;
  startDateIso: string;
  endDateIso?: string;
}

function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

export function buildGoogleCalendarUrl(event: CalendarEventInput): string {
  const start = new Date(event.startDateIso);
  const end = event.endDateIso
    ? new Date(event.endDateIso)
    : new Date(start.getTime() + 5 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${formatIcsDate(start)}/${formatIcsDate(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsFileContent(event: CalendarEventInput): string {
  const start = new Date(event.startDateIso);
  const end = event.endDateIso
    ? new Date(event.endDateIso)
    : new Date(start.getTime() + 5 * 60 * 60 * 1000);

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//InvitacionesDigitales//ES',
    'BEGIN:VEVENT',
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT24H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Recordatorio del evento mañana',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}
