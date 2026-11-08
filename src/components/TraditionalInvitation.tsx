import React from 'react';
import { GaneshaIcon } from './GaneshaIcon';
import { COUPLE, INVITATION } from '../data/content';
import { JewelBand, CornerSprig, JewelDivider, Accent } from './Decor';

// "|| Shree Ganeshaya Namah ||" → the bars are drawn as gold accents instead of text glyphs
const invocation = INVITATION.invocation.replace(/\|/g, '').trim();

/** Royal stationery card: double gold frame, jewel bands top & bottom, leaf-sprig corners. */
export const TraditionalInvitation: React.FC = () => (
  <section className="w-full flex justify-center py-6 px-4">
    <div className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] bg-white rounded-xl relative p-2.5 border border-[#DCCFB0] shadow-[0_1px_2px_rgba(70,55,30,0.06),0_18px_40px_-26px_rgba(70,55,30,0.45)]">
      <div className="relative w-full rounded-lg border border-[#D8C5A5] bg-[#FFFDF8] pt-14 pb-14 px-7 flex flex-col items-center text-center">
        {/* second engraved rule */}
        <div className="absolute inset-[6px] rounded-md border border-[#EADFC6] pointer-events-none" aria-hidden="true" />

        {/* jewel bands */}
        <JewelBand id="band-top" className="absolute top-5 left-14 right-14 w-[calc(100%-7rem)]" />
        <JewelBand id="band-bottom" className="absolute bottom-5 left-14 right-14 w-[calc(100%-7rem)]" />

        {/* leaf-sprig corners */}
        <CornerSprig className="absolute top-3 left-3 w-9 h-9" />
        <CornerSprig className="absolute top-3 right-3 w-9 h-9" flip="x" />
        <CornerSprig className="absolute bottom-3 left-3 w-9 h-9" flip="y" />
        <CornerSprig className="absolute bottom-3 right-3 w-9 h-9" flip="xy" />

        <GaneshaIcon className="w-[40px] h-[52px] mx-auto mb-2.5" />

        <p className="flex items-center gap-2.5 mb-5">
          <Accent />
          <span className="t-label text-[11.5px] tracking-[0.16em]">{invocation}</span>
          <Accent />
        </p>

        <p className="t-poetic text-[18px] leading-snug mb-5 max-w-[290px]">
          {INVITATION.intro.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>

        <JewelDivider className="w-40 mb-6" />

        {/* Bride */}
        <div className="flex flex-col items-center mb-2">
          <h2 className="t-script text-[66px] leading-[1.1] mb-1">{COUPLE.bride}</h2>
          <p className="t-detail text-[12px] tracking-[0.03em]">{COUPLE.brideParents}</p>
        </div>

        <div className="flex items-center gap-3 my-3" aria-label="and">
          <span className="w-12 h-px bg-gradient-to-r from-transparent to-[#C9AE82]" />
          <span className="t-poetic text-[30px] leading-none text-[#B39363]">&amp;</span>
          <span className="w-12 h-px bg-gradient-to-l from-transparent to-[#C9AE82]" />
        </div>

        {/* Groom */}
        <div className="flex flex-col items-center mb-7">
          <h2 className="t-script text-[66px] leading-[1.1] mb-1">{COUPLE.groom}</h2>
          <p className="t-detail text-[12px] tracking-[0.03em]">{COUPLE.groomParents}</p>
        </div>

        <JewelDivider className="w-28 mb-5" />

        <p className="t-poetic text-[19px] leading-snug text-[#2E2B26] max-w-[300px] text-balance">
          {INVITATION.closingLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </div>
  </section>
);
