import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';
import PillNav from './PillNav';

interface NavbarProps {
  onOpenBooking: () => void;
  onReopenIntro?: () => void;
}

const navItems = [
  { label: 'Origin', href: '#about' },
  { label: 'The Arena', href: '#arena' },
  { label: 'Café', href: '#cafe' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Visit', href: '#visit' }
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking, onReopenIntro }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeHref, setActiveHref] = useState('#arena');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);

      const sections = ['about', 'arena', 'cafe', 'gallery', 'reviews', 'visit'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 150) {
            setActiveHref(`#${section}`);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const newState = soundManager.toggle();
    setSoundEnabled(newState);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    soundManager.playBlip(560);
    setMobileMenuOpen(false);
    setActiveHref(`#${targetId}`);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    soundManager.playBlip(440);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#050811]/90 backdrop-blur-xl border-b border-cyan-900/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]' 
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          
          {/* Zone 1: Single text element Brand wordmark */}
          <a 
            href="#hero" 
            onClick={handleLogoClick}
            className="flex items-center gap-2 group whitespace-nowrap shrink-0 text-decoration-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md py-1"
            aria-label="Casa Milano Gaming Café Home"
          >
            <span className="font-display font-bold text-xl sm:text-2xl tracking-wider text-white group-hover:text-cyan-400 transition-colors uppercase">
              CASA MILANO
            </span>
            <span className="hidden sm:inline font-mono text-[11px] tracking-widest text-cyan-400/80 uppercase">
              GAMING CAFÉ
            </span>
          </a>

          {/* Zone 2: PillNav with GSAP interactive hover animations */}
          <nav className="hidden md:flex items-center justify-center">
            <PillNav
              logo="/logo.svg"
              logoAlt="Casa Milano"
              items={navItems}
              activeHref={activeHref}
              className="custom-nav"
              ease="power2.easeOut"
              baseColor="#00F0FF"
              pillColor="#090E1F"
              hoveredPillTextColor="#000000"
              pillTextColor="#94a3b8"
              initialLoadAnimation={false}
            />
          </nav>

          {/* Zone 3: 1 primary action + sound toggle + optional intro reopen */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Reopen Intro Portal button */}
            {onReopenIntro && (
              <button
                onClick={() => {
                  soundManager.playBlip(520);
                  onReopenIntro();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:text-cyan-300 hover:bg-slate-900/60 rounded-lg border border-slate-800 transition-colors cursor-pointer"
                title="View Welcome Intro Portal"
                aria-label="View Welcome Intro Portal"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xl:inline text-[11px] uppercase tracking-wider">Intro</span>
              </button>
            )}

            {/* Ambient Soundscape Toggle */}
            <button
              onClick={handleSoundToggle}
              className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-900/60 rounded-lg border border-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              title={soundEnabled ? 'Mute Interface Audio' : 'Enable Tactile Interface Audio'}
              aria-label={soundEnabled ? 'Mute Interface Audio' : 'Enable Tactile Interface Audio'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* Primary Top Bar CTA */}
            <a
              href="#visit"
              onClick={(e) => handleNavClick(e, 'visit')}
              className="relative inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <span>VISIT CASA MILANO</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                soundManager.playBlip(500);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg border border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#060a17]/95 backdrop-blur-2xl border-b border-cyan-950/60 px-6 py-6 transition-all duration-200">
          <nav className="flex flex-col gap-4 text-base font-medium">
            <a
              href="#about"
              onClick={(e) => handleNavClick(e, 'about')}
              className="text-slate-200 hover:text-cyan-400 py-2 border-b border-white/5"
            >
              Origin & Leadership
            </a>
            <a
              href="#arena"
              onClick={(e) => handleNavClick(e, 'arena')}
              className="text-slate-200 hover:text-cyan-400 py-2 border-b border-white/5"
            >
              The Arena
            </a>
            <a
              href="#cafe"
              onClick={(e) => handleNavClick(e, 'cafe')}
              className="text-slate-200 hover:text-cyan-400 py-2 border-b border-white/5"
            >
              Gourmet Café & Kitchen
            </a>
            <a
              href="#gallery"
              onClick={(e) => handleNavClick(e, 'gallery')}
              className="text-slate-200 hover:text-cyan-400 py-2 border-b border-white/5"
            >
              Visual Gallery
            </a>
            <a
              href="#reviews"
              onClick={(e) => handleNavClick(e, 'reviews')}
              className="text-slate-200 hover:text-cyan-400 py-2 border-b border-white/5"
            >
              Verified Reviews
            </a>
            <a
              href="#visit"
              onClick={(e) => handleNavClick(e, 'visit')}
              className="text-slate-200 hover:text-cyan-400 py-2 border-b border-white/5"
            >
              Location & Hours
            </a>
            <div className="pt-2 flex flex-col gap-3">
              {onReopenIntro && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    soundManager.playBlip(520);
                    onReopenIntro();
                  }}
                  className="w-full py-2.5 px-4 text-center text-xs font-mono font-medium uppercase tracking-wider text-cyan-300 bg-slate-900/90 border border-cyan-900/50 rounded-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Welcome Intro Portal</span>
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBooking();
                }}
                className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-black bg-cyan-400 rounded-lg shadow-lg"
              >
                Reserve Gaming Session
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
