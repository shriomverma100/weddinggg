import React from 'react';
import { MapPin } from 'lucide-react';
import { WEDDING_VENUE, WEDDING_DATE_ISO, formatDate, formatTime } from '../data/content';
import { Reveal } from './Reveal';

export const MainVenue: React.FC = () => (
  <Reveal className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto py-6 px-4">
    <div className="w-full bg-white rounded-2xl border border-[#DDDCD3] shadow-xs py-8 px-6 text-center flex flex-col items-center">
      <MapPin className="w-5 h-5 text-[#C9AE82] mb-3" strokeWidth={1.5} aria-hidden="true" />
      <p className="t-label text-[11px] mb-3">The Wedding Venue</p>
      <h3 className="t-display text-[30px] leading-tight mb-1.5 max-w-[300px]">
        {WEDDING_VENUE.name}
      </h3>
      <p className="t-detail text-[12.5px] mb-6">
        {formatDate(WEDDING_DATE_ISO)} · {formatTime(WEDDING_DATE_ISO)}
      </p>
      <a
        href={WEDDING_VENUE.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-[#C9AE82] px-6 py-3 font-sans text-[11px] uppercase tracking-[0.2em] text-[#8C6F43] font-semibold transition-colors hover:bg-[#C9AE82] hover:text-white active:scale-[0.98]"
      >
        <span>Get Directions</span>
        <span aria-hidden="true">→</span>
      </a>
    </div>
  </Reveal>
);
