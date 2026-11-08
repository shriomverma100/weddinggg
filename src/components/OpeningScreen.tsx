import React, { useEffect, useState } from 'react';
import { IMAGES } from '../assets/placeholders';
import type { Lang } from '../data/content';

interface OpeningScreenProps {
  onOpen: (lang: Lang) => void;
  isOpen: boolean;
}

/** Bilingual cover: the guest picks Hindi or English, and the invitation opens in that language. */
export const OpeningScreen: React.FC<OpeningScreenProps> = ({ onOpen, isOpen }) => {
  // Unmount after the fade so the blurred layers stop costing GPU time while scrolling.
  const [mounted, setMounted] = useState(true);
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => setMounted(false), 1100);
    return () => clearTimeout(t);
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 select-none transition-[opacity,transform] duration-1000 ease-in-out ${
        isOpen ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
      style={{ touchAction: 'manipulation', willChange: 'opacity, transform' }}
    >
      {/* Background: small image + blur (blur hides the low resolution, so it loads fast) */}
      <div className="absolute inset-0 overflow-hidden bg-[#2A2119]">
        <div
          className="absolute inset-[-20px] bg-cover bg-center blur-md scale-105"
          style={{ backgroundImage: `url(${IMAGES.openingBackground})` }}
        />
        <div className="absolute inset-0 bg-[rgba(20,14,10,0.62)]" />
      </div>

      {/* Central Invitation Panel */}
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] aspect-[3/4.6] max-h-[580px] sm:max-h-[640px] rounded-2xl border border-white/40 bg-white/10 backdrop-blur-sm shadow-2xl flex flex-col items-center justify-between py-10 sm:py-12 px-6 text-center">
        <div className="w-8 h-px bg-white/40" />

        <div className="flex flex-col items-center justify-center my-auto">
          {/* Monogram A | J */}
          <div className="w-28 h-28 rounded-full flex items-center justify-center border border-[#C9AE82] mb-7 opening-monogram">
            <span className="t-display text-[32px] font-normal text-[#F1EFE7] flex items-center gap-3">
              <span>A</span>
              <span className="w-px h-7 bg-[#C9AE82]/80" aria-hidden="true" />
              <span>J</span>
            </span>
          </div>

          {/* both languages, Hindi first */}
          <p lang="hi" className="font-['Tiro_Devanagari_Hindi',serif] text-[19px] leading-snug text-white">
            आप सादर आमंत्रित हैं
          </p>
          <div className="flex items-center gap-2 my-2.5" aria-hidden="true">
            <span className="w-6 h-px bg-[#C9AE82]/70" />
            <span className="w-1.5 h-1.5 rotate-45 bg-[#C9AE82]" />
            <span className="w-6 h-px bg-[#C9AE82]/70" />
          </div>
          <p lang="en" className="font-['Cinzel',serif] font-semibold text-[10.5px] tracking-[0.26em] uppercase text-white/90">
            You Are Cordially Invited
          </p>
        </div>

        {/* Choose a language to open — a soft pulse on the primary choice says "tap me" */}
        <div className="w-full flex flex-col items-center gap-3">
          <button
            type="button"
            lang="hi"
            onClick={() => onOpen('hi')}
            className="tap-pulse w-full max-w-[250px] rounded-full bg-gradient-to-br from-[#D8C5A5] to-[#B39363] py-3.5 text-white font-['Tiro_Devanagari_Hindi',serif] text-[19px] leading-none shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)] transition-transform active:scale-[0.97]"
          >
            हिंदी में खोलें
          </button>
          <button
            type="button"
            lang="en"
            onClick={() => onOpen('en')}
            className="w-full max-w-[250px] rounded-full border border-white/60 bg-white/10 py-3.5 text-white font-['Cormorant_Garamond',serif] italic font-medium text-[20px] leading-none transition-[transform,background-color] hover:bg-white/20 active:scale-[0.97]"
          >
            Open in English
          </button>
        </div>
      </div>
    </div>
  );
};
