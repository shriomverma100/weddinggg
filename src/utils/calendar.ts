const toUtcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** Google Calendar "add event" link — one tap saves the event, so guests don't have to remember dates. */
export function googleCalendarUrl(opts: { title: string; startISO: string; hours?: number; location: string; details?: string }) {
  const start = new Date(opts.startISO);
  const end = new Date(start.getTime() + (opts.hours ?? 3) * 3600_000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: opts.title,
    dates: `${toUtcStamp(start)}/${toUtcStamp(end)}`,
    location: opts.location,
    details: opts.details ?? '',
    ctz: 'Asia/Kolkata',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
