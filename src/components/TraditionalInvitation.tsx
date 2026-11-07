import React from 'react';
import { GaneshaIcon } from './GaneshaIcon';
import { COUPLE, INVITATION } from '../data/content';
import { Divider } from './Divider';

// Literal class strings so Tailwind can detect them at build time.
const CORNERS = [
  ['top-2 left-2 border-t-2 border-l-2', 'top-3 left-3'],
  ['top-2 right-2 border-t-2 border-r-2', 'top-3 right-3'],
  ['bottom-2 left-2 border-b-2 border-l-2', 'bottom-3 left-3'],
  ['bottom-2 right-2 border-b-2 border-r-2', 'bottom-3 right-3'],
];

export const TraditionalInvitation: React.FC = () => {
  return (
    <section className="w-full flex justify-center py-6 px-4">
      <div className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] bg-white rounded-xl shadow-sm relative p-3 border border-[#DDDCD3]">
        <div className="relative w-full border border-[#DDDCD3] rounded-lg py-12 px-6 flex flex-col items-center text-center">
          {CORNERS.map(([bracket, dot]) => (
            <React.Fragment key={dot}>
              <div className={`absolute w-4 h-4 border-[#C9AE82] ${bracket}`} aria-hidden="true" />
              <div className={`absolute w-1.5 h-1.5 bg-[#C9AE82] rounded-full ${dot}`} aria-hidden="true" />
            </React.Fragment>
          ))}

          <GaneshaIcon className="w-12 h-14 mx-auto mb-2" />

          <p className="font-serif text-[15px] tracking-wide text-[#8C6F43] mb-6">{INVITATION.invocation}</p>

          {/* Long sentence → sentence case serif (easier to read than letter-spaced capitals) */}
          <p className="font-serif italic text-[17px] leading-snug text-[#5A5952] mb-6 max-w-[290px]">
            {INVITATION.intro.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          <Divider className="w-28 mb-8" />

          {/* Bride */}
          <div className="flex flex-col items-center mb-4">
            <h2 className="font-script text-6xl text-[#34342E] mb-2 leading-none">{COUPLE.bride}</h2>
            <p className="font-sans text-[11.5px] tracking-[0.08em] text-[#6F786C]">{COUPLE.brideParents}</p>
          </div>

          <span className="font-serif italic text-2xl text-[#C9AE82] my-3" aria-label="and">
            &amp;
          </span>

          {/* Groom */}
          <div className="flex flex-col items-center mb-9">
            <h2 className="font-script text-6xl text-[#34342E] mb-2 leading-none">{COUPLE.groom}</h2>
            <p className="font-sans text-[11.5px] tracking-[0.08em] text-[#6F786C]">{COUPLE.groomParents}</p>
          </div>

          <p className="font-serif italic text-lg md:text-xl leading-snug text-[#34342E] max-w-[300px]">
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
};
