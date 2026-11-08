import React from 'react';
import { Flame } from 'lucide-react';
import { FAMILY } from '../data/content';
import { Divider } from './Divider';
import { Reveal } from './Reveal';

const GroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="t-label text-[10.5px] mb-3">{children}</p>
);

const NameList: React.FC<{ names: string[] }> = ({ names }) => (
  <ul className="flex flex-col gap-1.5">
    {names.map((n) => (
      <li key={n} className="t-display text-[17px] leading-snug">
        {n}
      </li>
    ))}
  </ul>
);

const joinNames = (names: string[]) =>
  names.length > 1 ? `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}` : names[0];

export const FamilyBlessings: React.FC = () => {
  return (
    <Reveal className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto py-6 px-4">
      <div className="w-full bg-white rounded-2xl border border-[#DDDCD3] shadow-xs py-10 px-6 sm:px-8 text-center flex flex-col items-center">
        <h3 className="t-display text-[30px] leading-tight mb-4">
          {FAMILY.heading}
        </h3>
        <Divider className="w-24 mb-8" />

        {/* In loving memory — set apart and quieter, with a small diya flame */}
        <div className="w-full rounded-xl bg-[#F7F4EC] border border-[#EDE6D6] py-5 px-4 mb-9">
          <Flame className="w-4 h-4 mx-auto mb-2 text-[#C9AE82]" strokeWidth={1.5} aria-hidden="true" />
          <GroupLabel>In Loving Memory of</GroupLabel>
          <p className="t-poetic text-[23px] text-[#2E2B26]">{FAMILY.inLovingMemory}</p>
        </div>

        <div className="mb-9">
          <GroupLabel>With the Blessings of</GroupLabel>
          <NameList names={FAMILY.blessings} />
        </div>

        <div className="w-12 h-px bg-[#DDDCD3] mb-9" />

        <div className="mb-9">
          <GroupLabel>Siblings</GroupLabel>
          <NameList names={FAMILY.siblings} />
        </div>

        <div className="mb-10">
          <GroupLabel>Little Ones</GroupLabel>
          <p className="t-display text-[18px]">{joinNames(FAMILY.kids)}</p>
        </div>

        {/* Family tagline as a pull-quote: soft sage-to-champagne blend, oversized gold quote marks */}
        <figure className="relative w-full rounded-xl overflow-hidden border border-[#E4E1CC] bg-[linear-gradient(135deg,#EEF3EA_0%,#F6F4EA_50%,#FAF1DF_100%)] pt-9 pb-8 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          {/* gentle glow so the blend feels lit from within */}
          <span
            className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(216,197,165,0.35)_0%,rgba(216,197,165,0)_70%)] pointer-events-none"
            aria-hidden="true"
          />
          <span
            className="absolute left-3 top-0 font-['Playfair_Display'] text-[72px] leading-none text-[#C9AE82]/55 select-none pointer-events-none"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <span
            className="absolute right-3 -bottom-8 font-['Playfair_Display'] text-[72px] leading-none text-[#C9AE82]/55 select-none pointer-events-none"
            aria-hidden="true"
          >
            &rdquo;
          </span>
          <blockquote className="relative t-poetic text-[clamp(15px,4.7vw,21px)] leading-snug text-[#3F4A3C]">
            {FAMILY.tagline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </blockquote>
          <figcaption className="relative mt-4 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-[#C9AE82]" />
            <span className="t-label text-[9.5px] text-[#8C6F43]">The Chourasia Family</span>
            <span className="w-6 h-px bg-[#C9AE82]" />
          </figcaption>
        </figure>
      </div>
    </Reveal>
  );
};
