import React, { useEffect, useState } from 'react';
import { WEDDING_DATE_ISO } from '../data/content';

const TARGET = new Date(WEDDING_DATE_ISO).getTime();

const timeLeft = () => {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    done: diff === 0,
    units: [
      { label: 'Days', value: Math.floor(diff / 86_400_000) },
      { label: 'Hours', value: Math.floor(diff / 3_600_000) % 24 },
      { label: 'Minutes', value: Math.floor(diff / 60_000) % 60 },
      { label: 'Seconds', value: Math.floor(diff / 1000) % 60 },
    ],
  };
};

export const Countdown: React.FC = () => {
  const [state, setState] = useState(timeLeft);

  useEffect(() => {
    if (state.done) return;
    // Align ticks to the wall-clock second so the digits change smoothly and in sync.
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      setState(timeLeft());
      interval = setInterval(() => setState(timeLeft()), 1000);
    }, 1000 - (Date.now() % 1000));
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [state.done]);

  return (
    <section className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto py-8 px-4 text-center">
      <h3 className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#6F786C] font-semibold mb-6">
        {state.done ? 'The celebration has begun' : 'Counting Down to Forever'}
      </h3>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-3" role="timer" aria-live="off">
        {state.units.map((u) => (
          <div
            key={u.label}
            className="flex flex-col items-center justify-center aspect-square rounded-full border border-[#C9AE82] bg-white/70 p-1"
          >
            <span className="font-serif text-[28px] sm:text-3xl font-light text-[#34342E] leading-none mb-1 tabular-nums">
              {String(u.value).padStart(2, '0')}
            </span>
            <span className="font-sans text-[9.5px] sm:text-[10px] uppercase tracking-wider text-[#6F786C] font-medium">
              {u.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
