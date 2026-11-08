import React from 'react';
import { Clock, MapPin, ArrowUpRight, CalendarPlus, Shirt } from 'lucide-react';
import type { WeddingEvent } from '../data/content';
import { useContent } from '../i18n';
import { googleCalendarUrl } from '../utils/calendar';
import { useInView } from '../hooks/useInView';

const istDay = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(d);

/** "Today" / "Concluded" badges help guests orient themselves instantly during the wedding week. */
const statusOf = (iso: string): 'today' | 'past' | null => {
  const start = new Date(iso);
  const now = new Date();
  if (now.getTime() > start.getTime() + 5 * 3600_000) return 'past';
  if (istDay(now) === istDay(start)) return 'today';
  return null;
};

const TimelineEventCard: React.FC<{ event: WeddingEvent; isMain: boolean }> = ({ event, isMain }) => {
  const { COUPLE, UI, fmt } = useContent();
  const [ref, inView] = useInView<HTMLDivElement>('0px 0px -50px 0px');
  const status = statusOf(event.startISO);

  return (
    <div ref={ref} className={`relative ${status === 'past' ? 'opacity-70' : ''}`}>
      {/* Timeline node */}
      <div
        className={`absolute -left-[30px] sm:-left-[38px] top-6 w-5 h-5 rounded-full bg-white border flex items-center justify-center z-10 transition-[transform,opacity,border-color] duration-500 ease-out ${
          inView ? 'scale-100 opacity-100 border-[#C9AE82]' : 'scale-75 opacity-30 border-[#DDDCD3]'
        }`}
        aria-hidden="true"
      >
        <div
          className={`w-2 h-2 rounded-full bg-[#C9AE82] transition-transform duration-500 delay-150 ease-out ${
            inView ? 'scale-100' : 'scale-0'
          }`}
        />
      </div>

      <article
        className={`w-full bg-white rounded-2xl border p-5 sm:p-6 shadow-xs flex flex-col transition-[transform,opacity] duration-700 ease-out ${
          isMain ? 'border-[#D8C5A5] ring-1 ring-[#F1E8D6]' : 'border-[#DDDCD3]'
        } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <header className="flex items-center justify-between border-b border-[#F1EFE7] pb-3 mb-3 gap-2">
          <span className="t-label text-[10.5px]">
            {UI.event} {event.number}
          </span>
          <span className="flex items-center gap-2">
            {status === 'today' && (
              <span className="t-label text-[8.5px] text-white bg-[#C9AE82] rounded-full px-2 py-0.5">
                {UI.today}
              </span>
            )}
            {status === 'past' && (
              <span className="t-label text-[8.5px] text-[#8A8173]">{UI.concluded}</span>
            )}
            <span className="t-detail text-[11.5px]">
              {fmt.weekdayShort(event.startISO)}, {fmt.date(event.startISO)}
            </span>
          </span>
        </header>

        <h3 className="t-display text-[26px] leading-tight mb-1.5">{event.title}</h3>

        <p className="t-poetic text-[18.5px] leading-snug mb-5">{event.description}</p>

        <dl className="flex flex-col gap-2.5 pt-3 border-t border-[#F1EFE7] text-[12.5px]">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#C9AE82] shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <dt className="sr-only">Time</dt>
            <dd className="t-detail font-semibold text-[#2E2B26]">{UI.onwards(fmt.time(event.startISO))}</dd>
          </div>
          {event.dressCode && (
            <div className="flex items-center gap-2.5">
              <Shirt className="w-4 h-4 text-[#C9AE82] shrink-0" strokeWidth={1.5} aria-hidden="true" />
              <dt className="sr-only">Dress code</dt>
              <dd className="t-detail">{event.dressCode}</dd>
            </div>
          )}
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 text-[#C9AE82] shrink-0 mt-px" strokeWidth={1.5} aria-hidden="true" />
            <dt className="sr-only">Venue</dt>
            <dd className="t-detail leading-snug">{event.venue}</dd>
          </div>
        </dl>

        {/* Actions — large tap targets */}
        <div className="mt-4 pt-1 border-t border-[#F1EFE7] flex items-center justify-between">
          <a
            href={googleCalendarUrl({
              title: `${event.title} · ${COUPLE.bride} & ${COUPLE.groom}`,
              startISO: event.startISO,
              location: event.venue,
              details: event.description,
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 py-2.5 font-sans text-[11px] uppercase tracking-wider text-[#6F786C] hover:text-[#34342E] font-semibold transition-colors"
          >
            <CalendarPlus className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            <span>{UI.addToCalendar}</span>
          </a>
          <a
            href={event.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 py-2.5 font-sans text-[11px] uppercase tracking-wider text-[#8C6F43] hover:text-[#34342E] font-semibold transition-colors"
          >
            <span>{UI.directions}</span>
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </article>
    </div>
  );
};

export const EventTimeline: React.FC = () => {
  const { WEDDING_EVENTS } = useContent();
  return (
  <section className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto py-6 px-4">
    <div className="relative pl-6 sm:pl-8">
      <div className="absolute left-[11px] sm:left-[15px] top-6 bottom-8 w-px bg-[#DDDCD3]" aria-hidden="true" />
      <div className="flex flex-col gap-8">
        {WEDDING_EVENTS.map((event, index) => (
          <TimelineEventCard key={event.number} event={event} isMain={index === WEDDING_EVENTS.length - 1} />
        ))}
      </div>
    </div>
  </section>
  );
};
