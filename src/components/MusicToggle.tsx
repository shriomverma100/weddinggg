import React, { useEffect, useState } from 'react';
import { music } from '../audio/player';
import { useContent } from '../i18n';

/** Small floating gold button: dancing bars while music plays, a muted note when paused. */
export const MusicToggle: React.FC<{ visible: boolean }> = ({ visible }) => {
  const [on, setOn] = useState(music.playing);
  const { UI } = useContent();

  useEffect(() => {
    const off = music.onChange(setOn);
    const onVis = () => music.pauseForHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      off();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  const toggle = () => {
    music.toggle();
    try {
      localStorage.setItem('music-muted', music.playing ? '0' : '1');
    } catch {
      /* storage unavailable */
    }
  };

  return (
    // full-width rail matching <main>, so the button sits inside the card column on desktop too
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center pointer-events-none">
      <div className="w-full sm:max-w-[520px] md:max-w-[560px] lg:max-w-[580px] flex justify-end p-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={on ? UI.pauseMusic : UI.playMusic}
          aria-pressed={on}
          className={`pointer-events-auto w-11 h-11 rounded-full border border-[#D8C5A5] bg-white/85 backdrop-blur-md shadow-[0_6px_18px_-8px_rgba(70,55,30,0.45)] flex items-center justify-center transition-[opacity,transform] duration-700 active:scale-95 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          {on ? (
            <span className="flex items-end gap-[3px] h-4" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="music-bar w-[3px] rounded-full bg-[#B39363]" style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </span>
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#8C6F43" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
              <path d="M9 18V6l10-2v11" />
              <circle cx="6.5" cy="18" r="2.5" />
              <circle cx="16.5" cy="15" r="2.5" />
              <path d="M3 3l18 18" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
