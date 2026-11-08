import React, { useState } from 'react';
import { Share2, Link2, Check } from 'lucide-react';
import { useContent } from '../i18n';

const shareUrl = () => `${window.location.origin}/`;

/** Share the invitation link (never the date): native share sheet on phones, plus WhatsApp + copy-link shortcuts. */
export const ShareInvite: React.FC = () => {
  const { UI } = useContent();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = `${UI.shareText} ${shareUrl()}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // older browsers: hidden textarea fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    navigator.vibrate?.(10);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Aditi & Jeet | Wedding Invitation', text: UI.shareText, url: shareUrl() });
        return;
      } catch (e) {
        if ((e as DOMException)?.name === 'AbortError') return; // guest closed the share sheet
      }
    }
    void copy();
  };

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${UI.shareText} ${shareUrl()}`)}`;

  return (
    <div className="flex flex-col items-center mb-10">
      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-br from-[#D8C5A5] to-[#B39363] px-7 py-3.5 text-white shadow-[0_10px_24px_-12px_rgba(140,111,67,0.7)] transition-transform active:scale-[0.97] hover:brightness-105"
      >
        <Share2 className="w-4 h-4" strokeWidth={1.8} aria-hidden="true" />
        <span className="font-sans text-[12px] uppercase tracking-[0.18em] font-semibold">{UI.shareInvite}</span>
      </button>

      <div className="mt-4 flex items-center gap-5 text-[11px] font-sans uppercase tracking-[0.14em] font-semibold">
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 py-2 text-[#6F786C] hover:text-[#34342E] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
          </svg>
          <span>{UI.shareWhatsApp}</span>
        </a>
        <span className="w-px h-3 bg-[#DDDCD3]" aria-hidden="true" />
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 py-2 text-[#8C6F43] hover:text-[#34342E] transition-colors uppercase tracking-[0.14em] font-semibold"
          aria-live="polite"
        >
          {copied ? <Check className="w-4 h-4" aria-hidden="true" /> : <Link2 className="w-4 h-4" aria-hidden="true" />}
          <span>{copied ? UI.linkCopied : UI.copyLink}</span>
        </button>
      </div>
    </div>
  );
};
