import React from 'react';

/*
 * Royal-stationery ornaments — strictly the existing palette:
 * champagne gold #C9AE82 · muted gold #BDA276 · light gold #D8C5A5 · ivory #FFFDF8.
 * Static vector art: no runtime cost.
 */
const GOLD = '#C9AE82';
const GOLD_LIGHT = '#D8C5A5';

/** Fine jewel band (hairlines + alternating diamonds and dots), tiles to any width. */
export const JewelBand: React.FC<{ className?: string; id: string }> = ({ className = '', id }) => (
  <svg className={className} height="12" aria-hidden="true">
    <defs>
      <pattern id={id} width="18" height="12" patternUnits="userSpaceOnUse">
        <rect x="6" y="3" width="4.2" height="4.2" transform="rotate(45 8.1 5.1)" fill="none" stroke={GOLD} strokeWidth="0.8" />
        <circle cx="17" cy="6" r="0.9" fill={GOLD} />
      </pattern>
    </defs>
    <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke={GOLD_LIGHT} strokeWidth="1" />
    <rect x="0" y="0" width="100%" height="12" fill={`url(#${id})`} />
    <line x1="0" y1="11.5" x2="100%" y2="11.5" stroke={GOLD_LIGHT} strokeWidth="1" />
  </svg>
);

/** Corner sprig: hairline bracket with a small gold leaf pair (top-left orientation; mirror with `flip`). */
export const CornerSprig: React.FC<{ className?: string; flip?: 'x' | 'y' | 'xy' }> = ({ className = '', flip }) => {
  const t = flip === 'x' ? 'scale(-1,1)' : flip === 'y' ? 'scale(1,-1)' : flip === 'xy' ? 'scale(-1,-1)' : undefined;
  return (
    <svg viewBox="0 0 40 40" className={className} style={{ transform: t }} aria-hidden="true" fill="none" strokeLinecap="round">
      <path d="M2 38 V9 Q2 2 9 2 H38" stroke={GOLD} strokeWidth="1" />
      <path d="M8 8 C12 5.5 16.5 6.5 18 10 C14 11.5 10 11 8 8 Z" fill={GOLD_LIGHT} stroke={GOLD} strokeWidth="0.7" />
      <path d="M8 8 C5.5 12 6.5 16.5 10 18 C11.5 14 11 10 8 8 Z" fill={GOLD_LIGHT} stroke={GOLD} strokeWidth="0.7" />
      <circle cx="6" cy="6" r="1.3" fill={GOLD} />
    </svg>
  );
};

/** Jewel divider: fading hairlines → dot → diamond → dot. */
export const JewelDivider: React.FC<{ className?: string }> = ({ className = 'w-40' }) => (
  <svg viewBox="0 0 160 12" className={`h-auto mx-auto ${className}`} aria-hidden="true">
    <defs>
      <linearGradient id="jd-l" gradientUnits="userSpaceOnUse" x1="0" y1="6" x2="62" y2="6">
        <stop offset="0" stopColor={GOLD} stopOpacity="0" />
        <stop offset="1" stopColor={GOLD} />
      </linearGradient>
      <linearGradient id="jd-r" gradientUnits="userSpaceOnUse" x1="160" y1="6" x2="98" y2="6">
        <stop offset="0" stopColor={GOLD} stopOpacity="0" />
        <stop offset="1" stopColor={GOLD} />
      </linearGradient>
    </defs>
    <line x1="0" y1="6" x2="62" y2="6" stroke="url(#jd-l)" strokeWidth="1" />
    <circle cx="68" cy="6" r="1.4" fill={GOLD} />
    <rect x="76.5" y="2.5" width="7" height="7" transform="rotate(45 80 6)" fill="#FFFDF8" stroke={GOLD} strokeWidth="1" />
    <rect x="78.6" y="4.6" width="2.8" height="2.8" transform="rotate(45 80 6)" fill={GOLD} />
    <circle cx="92" cy="6" r="1.4" fill={GOLD} />
    <line x1="98" y1="6" x2="160" y2="6" stroke="url(#jd-r)" strokeWidth="1" />
  </svg>
);

/** Small dot–diamond–dot accent beside labels. */
export const Accent: React.FC = () => (
  <span className="inline-flex items-center gap-1" aria-hidden="true">
    <span className="w-1 h-1 rounded-full bg-[#C9AE82]" />
    <span className="w-1.5 h-1.5 rotate-45 border border-[#C9AE82]" />
    <span className="w-1 h-1 rounded-full bg-[#C9AE82]" />
  </span>
);
