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

        <Divider className="w-16 mb-6" small />

        <blockquote className="t-poetic text-[24px] leading-snug text-[#2E2B26] max-w-[320px]">
          {FAMILY.tagline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </blockquote>
      </div>
    </Reveal>
  );
};
