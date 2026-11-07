import React from 'react';

/** Thin gold line with a centre diamond — the recurring section separator. */
export const Divider: React.FC<{ className?: string; small?: boolean }> = ({ className = 'w-24', small }) => (
  <div className={`flex items-center justify-center gap-2 mx-auto ${className}`} aria-hidden="true">
    <div className="h-px bg-[#D8C5A5] flex-1" />
    <div className={`${small ? 'w-1 h-1' : 'w-1.5 h-1.5'} rotate-45 border border-[#C9AE82]`} />
    <div className="h-px bg-[#D8C5A5] flex-1" />
  </div>
);
