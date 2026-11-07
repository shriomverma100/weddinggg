import React from 'react';
import { PROGRAMME } from '../data/content';
import { Divider } from './Divider';

export const ProgrammeHeading: React.FC = () => (
  <section className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto pt-10 pb-4 px-4 text-center">
    <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#8C6F43] font-semibold mb-2">
      {PROGRAMME.eyebrow}
    </p>
    <h2 className="font-serif text-[34px] sm:text-4xl text-[#34342E] font-normal tracking-tight mb-4">
      {PROGRAMME.heading}
    </h2>
    <Divider className="w-24" />
  </section>
);
