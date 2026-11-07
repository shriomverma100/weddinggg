import React from 'react';
import { CLOSING } from '../data/content';
import { Divider } from './Divider';

export const ClosingMessage: React.FC = () => (
  <footer className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto pt-8 pb-16 px-6 text-center">
    <Divider className="w-20 mb-6" />
    <h3 className="t-poetic text-[30px] text-[#2E2B26] leading-snug mb-10 max-w-[320px] mx-auto">
      {CLOSING.message}
    </h3>
    <div className="pt-6 border-t border-[#DDDCD3]/60">
      <p className="t-label text-[13px] tracking-[0.4em]">{CLOSING.footer}</p>
    </div>
  </footer>
);
