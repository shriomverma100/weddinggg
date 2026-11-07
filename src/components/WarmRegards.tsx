import React from 'react';
import { CLOSING } from '../data/content';
import { Divider } from './Divider';
import { Reveal } from './Reveal';

export const WarmRegards: React.FC = () => (
  <Reveal className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto py-7 px-6 text-center">
    <p className="t-label text-[11px] mb-3">
      {CLOSING.regardsHeading}
    </p>
    <Divider className="w-16 mb-4" small />
    <p className="t-script text-[48px] leading-[1.15]">{CLOSING.regardsFrom}</p>
  </Reveal>
);
