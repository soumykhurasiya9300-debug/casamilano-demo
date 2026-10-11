import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OwnerSection } from './components/OwnerSection';
import { Arena } from './components/Arena';
import { GallerySection } from './components/GallerySection';
import { ReviewSection } from './components/ReviewSection';
import { ClosingVisit } from './components/ClosingVisit';
import { BookingModal } from './components/BookingModal';
import { CasaMilanoIntro } from './components/CasaMilanoIntro';
import { GamingActivityId } from './types';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedActivityForBooking, setSelectedActivityForBooking] = useState<GamingActivityId>('snooker');

  const handleOpenBooking = (activityId: GamingActivityId = 'snooker') => {
    setSelectedActivityForBooking(activityId);
    setIsBookingOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingOpen(false);
  };

  const handleIntroComplete = (_info?: any) => {
    setShowIntro(false);
  };

  return (
    <>
      {/* Interactive Snooker Intro Canvas — Appears first on load */}
      {showIntro && (
        <CasaMilanoIntro
          logoSrc="/logo.svg"
          sound={true}
          reducedMotion="auto"
          onComplete={handleIntroComplete}
        />
      )}

      {/* Main Website Experience */}
      <div 
        className={`min-h-screen bg-[#050811] text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-black transition-opacity duration-700 ${
          showIntro ? 'opacity-0 h-screen overflow-hidden pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Top Bar Navigation with PillNav and Reopen Intro Option */}
        <Navbar 
          onOpenBooking={() => handleOpenBooking('snooker')} 
          onReopenIntro={() => setShowIntro(true)}
        />

        {/* Main Experience Flow */}
        <main className="flex-grow">
          {/* SECTION A — THE CINEMATIC HERO */}
          <Hero onOpenBooking={() => handleOpenBooking('snooker')} />

          {/* OWNER & CAFÉ PHILOSOPHY */}
          <OwnerSection />

          {/* THE INTERACTIVE GAMING ARENA & GOURMET CAFÉ */}
          <Arena onSelectActivityForBooking={handleOpenBooking} />

          {/* GALLERY SECTION */}
          <GallerySection />

          {/* REVIEWS SECTION */}
          <ReviewSection />

          {/* CLOSING EXPERIENCE & VISIT LOUNGE */}
          <ClosingVisit onOpenBooking={() => handleOpenBooking('snooker')} />
        </main>

        {/* Interactive Reservation & Inquiry Modal */}
        <BookingModal
          isOpen={isBookingOpen}
          initialActivity={selectedActivityForBooking}
          onClose={handleCloseBooking}
        />
      </div>
    </>
  );
}
