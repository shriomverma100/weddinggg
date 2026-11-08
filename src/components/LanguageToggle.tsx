import React, { useEffect, useState } from 'react';
import { useLang } from '../i18n';
import type { Lang } from '../data/content';

const OPTIONS: { value: Lang; label: string; aria: string }[] = [
  { value: 'en', label: 'EN', aria: 'English' },
  { value: 'hi', label: 'हिं', aria: 'हिन्दी (Hindi)' },
];

/** Top-right EN | हिं switch — a small gold-edged pill with a sliding highlight. Appears once the invitation is open
 *  (on the cover, the "हिंदी में खोलें / Open in English" buttons do this job). */
export const LanguageToggle: React.FC<{ visible?: boolean }> = ({ visible = true }) => {
  const { lang, setLang } = useLang();
  const idx = OPTIONS.findIndex((o) => o.value === lang);

  // Tuck away while reading down the page (so it never covers a heading); slide back on scroll-up or near the top.
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (y < 140) setHidden(false);
        else if (y > lastY + 6) setHidden(true);
        else if (y < lastY - 6) setHidden(false);
        lastY = y;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // rail matching <main>'s width, so on desktop the switch sits at the card column's corner
    <div
      className={`fixed inset-x-0 top-0 z-[60] flex justify-center pointer-events-none transition-[transform,opacity] duration-300 ease-out ${
        hidden || !visible ? '-translate-y-full opacity-0 invisible' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="w-full sm:max-w-[520px] md:max-w-[560px] lg:max-w-[580px] flex justify-end p-3.5">
        <div
          role="radiogroup"
          aria-label="Language / भाषा"
          className="pointer-events-auto relative flex items-center rounded-full border border-[#D8C5A5] bg-white/85 backdrop-blur-md p-[3px] shadow-[0_6px_18px_-10px_rgba(70,55,30,0.5)]"
        >
          {/* sliding gold highlight */}
          <span
            className="absolute top-[3px] bottom-[3px] left-[3px] w-[42px] rounded-full bg-gradient-to-br from-[#D8C5A5] to-[#B39363] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(${idx * 42}px)` }}
            aria-hidden="true"
          />
          {OPTIONS.map((o) => {
            const active = o.value === lang;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={active}
                aria-label={o.aria}
                onClick={() => setLang(o.value)}
                className={`relative z-10 w-[42px] h-8 rounded-full text-[12px] font-semibold transition-colors duration-300 ${
                  o.value === 'hi' ? "font-['Mukta',sans-serif] text-[13.5px]" : "font-['Montserrat',sans-serif] tracking-[0.08em]"
                } ${active ? 'text-white' : 'text-[#8C6F43] hover:text-[#5E4A2A]'}`}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
