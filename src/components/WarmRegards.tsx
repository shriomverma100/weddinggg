import React from 'react';
import { CLOSING } from '../data/content';
import { Divider } from './Divider';
import { Reveal } from './Reveal';

export const WarmRegards: React.FC = () => (
  <Reveal className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto py-7 px-6 text-center">
    <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-[#8C6F43] font-semibold mb-3">
      {CLOSING.regardsHeading}
    </p>
    <Divider className="w-16 mb-4" small />
    <p className="font-script text-5xl text-[#34342E] leading-tight">{CLOSING.regardsFrom}</p>
  </Reveal>
);
