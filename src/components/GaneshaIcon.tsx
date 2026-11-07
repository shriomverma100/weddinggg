import React from 'react';
import ganesha from '../assets/ganesha.png';

/** Lord Ganesha seated on a lotus — line art with a transparent background (prepared from the supplied image at 3× display size). */
export const GaneshaIcon: React.FC<{ className?: string }> = ({ className = 'w-[88px] h-[114px]' }) => (
  <img
    src={ganesha}
    alt="Lord Ganesha"
    width={88}
    height={114}
    decoding="async"
    fetchPriority="high"
    className={`object-contain select-none pointer-events-none ${className}`}
    draggable={false}
  />
);
