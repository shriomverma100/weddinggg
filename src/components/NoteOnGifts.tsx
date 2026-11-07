import React from 'react';
import { CLOSING } from '../data/content';
import { Divider } from './Divider';
import { Reveal } from './Reveal';

export const NoteOnGifts: React.FC = () => (
  <Reveal className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto py-8 px-6 text-center">
    <Divider className="w-16 mb-5" small />
    <p className="t-poetic text-[23px] leading-snug max-w-[300px] mx-auto">
      “{CLOSING.giftNote}”
    </p>
  </Reveal>
);
