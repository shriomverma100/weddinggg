import React from 'react';
import { useContent } from '../i18n';
import { Divider } from './Divider';

export const ClosingMessage: React.FC = () => {
  const { CLOSING } = useContent();
  return (
    <footer className="w-full max-w-[420px] sm:max-w-[480px] md:max-w-[500px] mx-auto pt-8 pb-16 px-4 text-center">
      <Divider className="w-20 mb-6" />

      {/* One line, sized to fit any phone width, with a soft blurred gold underline glow */}
      <h3 className="relative inline-block mb-10 px-1">
        <span className="t-poetic relative z-10 whitespace-nowrap text-[clamp(18px,5.6vw,27px)] leading-snug text-[#2E2B26]">
          {CLOSING.message}
        </span>
        <span
          className="absolute left-[4%] right-[4%] -bottom-0.5 h-[10px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(201,174,130,0.55)_0%,rgba(201,174,130,0.18)_45%,rgba(201,174,130,0)_72%)]"
          aria-hidden="true"
        />
      </h3>

      <div className="pt-6 border-t border-[#DDDCD3]/60">
        <p className="t-label text-[13px] tracking-[0.4em]">{CLOSING.footer}</p>
      </div>
    </footer>
  );
};
