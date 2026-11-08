import React, { useEffect, useState } from 'react';
import { IMAGES } from '../assets/placeholders';
import { useContent } from '../i18n';

interface OpeningScreenProps {
  onOpen: () => void;
  isOpen: boolean;
}

export const OpeningScreen: React.FC<OpeningScreenProps> = ({ onOpen, isOpen }) => {
  // Unmount after the fade so the blurred layers stop costing GPU time while scrolling.
  const [mounted, setMounted] = useState(true);
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => setMounted(false), 1100);
    return () => clearTimeout(t);
  }, [isOpen]);

  const { COUPLE, UI } = useContent();

  if (!mounted) return null;

  return (
    <div
      onClick={onOpen}
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 cursor-pointer select-none transition-[opacity,transform] duration-1000 ease-in-out ${
        isOpen ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'
      }`}
      style={{ touchAction: 'manipulation', willChange: 'opacity, transform' }}
      aria-label={UI.tapToOpenAria}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen();
      }}
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
      <div className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] aspect-[3/4.6] max-h-[580px] sm:max-h-[640px] rounded-2xl border border-white/40 bg-white/10 backdrop-blur-sm shadow-2xl flex flex-col items-center justify-between py-10 sm:py-14 px-6 text-center">
        <div className="w-8 h-px bg-white/40" />

        <div className="flex flex-col items-center justify-center my-auto">
          {/* Monogram A | J */}
          <div className="w-28 h-28 rounded-full flex items-center justify-center border border-[#C9AE82] mb-7 opening-monogram">
            <span className="t-display text-[32px] font-normal text-[#F1EFE7] flex items-center gap-3">
              <span>{COUPLE.monogram[0]}</span>
              <span className="w-px h-7 bg-[#C9AE82]/80" aria-hidden="true" />
              <span>{COUPLE.monogram[1]}</span>
            </span>
          </div>

          <p className="t-label text-[11px] tracking-[0.26em] text-white/90">
            {UI.cordiallyInvited}
          </p>
        </div>

        {/* Call to action — a soft pulse tells the guest this is tappable */}
        <div className="flex flex-col items-center">
          <span className="t-poetic text-[23px] text-white tap-pulse">{UI.tapToOpen}</span>
          <div className="w-16 h-px mt-2 bg-[#C9AE82]" />
        </div>
      </div>
    </div>
  );
};
