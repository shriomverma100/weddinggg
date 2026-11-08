import React, { useEffect, useState } from 'react';
import { OpeningScreen } from './components/OpeningScreen';
import { FallingPetals } from './components/FallingPetals';
import { TraditionalInvitation } from './components/TraditionalInvitation';
import { ScratchToReveal } from './components/ScratchToReveal';
import { Countdown } from './components/Countdown';
import { FamilyBlessings } from './components/FamilyBlessings';
import { ProgrammeHeading } from './components/ProgrammeHeading';
import { EventTimeline } from './components/EventTimeline';
import { MainVenue } from './components/MainVenue';
import { NoteOnGifts } from './components/NoteOnGifts';
import { WarmRegards } from './components/WarmRegards';
import { ClosingMessage } from './components/ClosingMessage';
import { MusicToggle } from './components/MusicToggle';
import { music } from './audio/player';

// Music can only start from a tap, so it begins with "Tap to open" — unless the guest muted it on an earlier visit.
const openInvitation = (setIsOpen: (v: boolean) => void) => {
  setIsOpen(true);
  let muted = false;
  try {
    muted = localStorage.getItem('music-muted') === '1';
  } catch {
    /* storage unavailable */
  }
  if (!muted) music.start();
};

export const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // The countdown stays still until the guest scratches the date open.
  const [dateRevealed, setDateRevealed] = useState(false);

  // Lock scrolling behind the opening screen so the guest always starts at the top of the card.
  useEffect(() => {
    document.documentElement.style.overflow = isOpen ? '' : 'hidden';
    if (isOpen) window.scrollTo(0, 0);
  }, [isOpen]);

  return (
    <div className="min-h-screen w-full bg-[#EFECE4] flex justify-center selection:bg-[#D8C5A5]/40">
      <main className="w-full sm:max-w-[520px] md:max-w-[560px] lg:max-w-[580px] min-h-screen bg-[#F7F6F1] sm:shadow-2xl relative overflow-x-hidden flex flex-col sm:border-x sm:border-[#DDDCD3]/50">
        <FallingPetals isOpened={isOpen} />
        <OpeningScreen isOpen={isOpen} onOpen={() => openInvitation(setIsOpen)} />
        <MusicToggle visible={isOpen} />

        <div
          className={`w-full transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={!isOpen}
        >
          <TraditionalInvitation />
          <ScratchToReveal onReveal={() => setDateRevealed(true)} />
          <Countdown started={dateRevealed} />
          <FamilyBlessings />
          <ProgrammeHeading />
          <EventTimeline />
          <MainVenue />
          <NoteOnGifts />
          <WarmRegards />
          <ClosingMessage />
        </div>
      </main>
    </div>
  );
};

export default App;
