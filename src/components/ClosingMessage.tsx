import React from 'react';
import { CLOSING } from '../data/content';
import { Divider } from './Divider';

export const ClosingMessage: React.FC = () => (
  <footer className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto pt-8 pb-16 px-6 text-center">
    <Divider className="w-20 mb-6" />
    <h3 className="font-serif italic text-[28px] sm:text-3xl text-[#34342E] leading-relaxed mb-10 max-w-[320px] mx-auto font-normal">
      {CLOSING.message}
    </h3>
    <div className="pt-6 border-t border-[#DDDCD3]/60">
      <p className="font-serif text-[17px] tracking-[0.2em] text-[#8C6F43]">{CLOSING.footer}</p>
    </div>
  </footer>
);
