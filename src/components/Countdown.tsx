import React, { useEffect, useState } from 'react';
import { WEDDING_DATE_ISO } from '../data/content';
import { useContent, useLang } from '../i18n';
import { CornerSprig, JewelDivider } from './Decor';

const TARGET = new Date(WEDDING_DATE_ISO).getTime();

const timeLeft = () => {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    done: diff === 0,
    units: [
      { label: 'Days', value: Math.floor(diff / 86_400_000), max: 0 }, // 0 → full decorative ring
      { label: 'Hours', value: Math.floor(diff / 3_600_000) % 24, max: 24 },
      { label: 'Minutes', value: Math.floor(diff / 60_000) % 60, max: 60 },
      { label: 'Seconds', value: Math.floor(diff / 1000) % 60, max: 60 },
    ],
  };
};

const R = 31;
const C = 2 * Math.PI * R;

/** A gold dial: dotted outer ring, progress arc showing what's left of the unit, flipping number in the centre. */
const Dial: React.FC<{ value: number; label: string; frac: number; flip: boolean; slow: boolean; big?: boolean }> = ({
  value,
  label,
  frac,
  flip,
  slow,
  big,
}) => {
  const text = String(value).padStart(2, '0');
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[74px] h-[74px] sm:w-[84px] sm:h-[84px]">
        <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full" aria-hidden="true">
          <defs>
            <linearGradient id="dial-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E2CC9A" />
              <stop offset="100%" stopColor="#A8874F" />
            </linearGradient>
          </defs>
          <circle cx="40" cy="40" r="38" fill="none" stroke="#D8C5A5" strokeWidth="1" strokeDasharray="1 3.2" />
          <circle cx="40" cy="40" r={R} fill="none" stroke="#F1E8D6" strokeWidth="3" />
          <circle
            cx="40"
            cy="40"
            r={R}
            fill="none"
            stroke="url(#dial-gold)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - frac)}
            transform="rotate(-90 40 40)"
            className="dial-arc"
            style={slow ? { transitionDuration: '1.6s' } : undefined}
          />
          <circle cx="40" cy="40" r="26" fill="#FFFFFF" />
          {/* four small gold cardinal dots */}
          {[0, 90, 180, 270].map((a) => (
            <circle key={a} cx="40" cy="2" r="1.4" fill="#C9AE82" transform={`rotate(${a} 40 40)`} />
          ))}
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          {/* key on the value → remounts and plays the flip on every change (not while rolling up) */}
          <span key={flip ? text : 'roll'} className={`${flip ? 'flip-in' : ''} t-display text-[24px] sm:text-[27px] leading-none tabular-nums`}>
            {text}
          </span>
        </span>
      </div>
      <span className={`t-label ${big ? "text-[10px]" : "text-[8.5px]"} tracking-[0.18em] text-[#6A6E66] mt-2`}>{label}</span>
    </div>
  );
};

const ROLL_MS = 1600;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Still (00 · empty rings) until `started` — then the numbers roll up to the real time left and start ticking live. */
export const Countdown: React.FC<{ started?: boolean }> = ({ started = true }) => {
  const { UI, fmt } = useContent();
  const { lang } = useLang();
  const [state, setState] = useState(timeLeft);
  const [phase, setPhase] = useState<'idle' | 'rolling' | 'live'>(started ? 'live' : 'idle');
  const [roll, setRoll] = useState(0); // eased 0 → 1 while rolling up

  // Started: roll the numbers up from 00, then go live.
  useEffect(() => {
    if (!started || phase !== 'idle') return;
    setState(timeLeft());
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setPhase('live');
      return;
    }
    setPhase('rolling');
  }, [started, phase]);

  useEffect(() => {
    if (phase !== 'rolling') return;
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / ROLL_MS);
      setRoll(easeOut(t));
      if (t < 1) raf = requestAnimationFrame(step);
      else setPhase('live');
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'live' || state.done) return;
    // Tick on the wall-clock second so all dials change together.
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      setState(timeLeft());
      interval = setInterval(() => setState(timeLeft()), 1000);
    }, 1000 - (Date.now() % 1000));
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [phase, state.done]);

  const live = phase === 'live';
  const k = live ? 1 : phase === 'rolling' ? roll : 0;

  return (
    <section className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto py-8 px-4">
      <div
        className={`relative overflow-hidden rounded-2xl border border-[#DCCFB0] bg-[radial-gradient(130%_90%_at_50%_0%,#FFFCF4_0%,#FFFFFF_60%)] px-3 pt-7 pb-6 text-center shadow-[0_1px_2px_rgba(70,55,30,0.06),0_14px_32px_-20px_rgba(70,55,30,0.38)] ${
          phase !== 'idle' ? 'countdown-wake' : ''
        }`}
      >
        <CornerSprig className="absolute top-2 left-2 w-8 h-8" />
        <CornerSprig className="absolute top-2 right-2 w-8 h-8" flip="x" />
        <CornerSprig className="absolute bottom-2 left-2 w-8 h-8" flip="y" />
        <CornerSprig className="absolute bottom-2 right-2 w-8 h-8" flip="xy" />

        <h3 className="t-label text-[11px]">{state.done ? UI.celebrationBegun : UI.countingDown}</h3>
        <JewelDivider className="w-32 mt-2.5" />

        <div
          className={`mt-5 flex items-start justify-center gap-1.5 sm:gap-3 transition-opacity duration-700 ${phase === 'idle' ? 'opacity-55' : 'opacity-100'}`}
          role="timer"
          aria-live="off"
        >
          {state.units.map((u, i) => (
            <Dial
              key={u.label}
              label={UI.units[i]}
              big={lang === 'hi'}
              value={Math.round(u.value * k)}
              frac={phase === 'idle' ? 0 : u.max ? u.value / u.max : 1}
              flip={live}
              slow={phase === 'rolling'}
            />
          ))}
        </div>

        {/* the date stays a secret until it is scratched open above */}
        <p className="t-poetic text-[16px] text-[#4A4740] mt-5 min-h-[1.5em]">
          {phase === 'idle' ? (
            <span className="text-[#8C6F43]">{UI.scratchToStart}</span>
          ) : (
            <span className="date-pop inline-block">
              {fmt.weekday(WEDDING_DATE_ISO)}, {fmt.date(WEDDING_DATE_ISO)} · {fmt.time(WEDDING_DATE_ISO)}
            </span>
          )}
        </p>
      </div>
    </section>
  );
};
