import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ArrowUpRight, Sparkles, Instagram, MessageCircle } from 'lucide-react';
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
        <div className="flex items-center justify-between gap-4 h-20">
          
          {/* Zone 1: Authentic Casa Milano Brand Crest & Wordmark */}
          <a 
            href="#hero" 
            onClick={handleLogoClick}
            className="flex items-center gap-3 group whitespace-nowrap shrink-0 text-decoration-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md py-1"
            aria-label="Casa Milano Gaming Café Home"
          >
            <img 
              src="/images/casamilano-logo.svg" 
              alt="Casa Milano Crest" 
              className="w-10 h-10 object-contain rounded-full shadow-[0_0_15px_rgba(223,186,103,0.35)] border border-[#dfba67]/50 group-hover:scale-105 transition-transform" 
            />
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg sm:text-xl tracking-wider text-white group-hover:text-cyan-400 transition-colors uppercase leading-tight">
                CASA MILANO
              </span>
              <span className="font-mono text-[10px] tracking-widest text-[#dfba67] uppercase leading-none">
                LUXURIOUS GAMING CAFÉ
              </span>
            </div>
          </a>

          {/* Zone 2: PillNav with GSAP interactive hover animations */}
          <nav className="hidden md:flex items-center justify-center">
            <PillNav
              logo="/images/casamilano-logo.svg"
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

          {/* Zone 3: Social Apps + Primary Action + Audio Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            
            {/* Direct Social: Instagram @casamilano.cm */}
            <a
              href="https://www.instagram.com/casamilano.cm?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playSelect()}
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-pink-950/40 hover:bg-gradient-to-tr hover:from-pink-600 hover:to-amber-500 border border-pink-500/30 hover:border-pink-400 text-pink-300 hover:text-white transition-all shadow-[0_0_12px_rgba(236,72,153,0.2)] cursor-pointer"
              title="Follow Casa Milano on Instagram (@casamilano.cm)"
              aria-label="Follow Casa Milano on Instagram (@casamilano.cm)"
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* Direct Social: WhatsApp +91 77238 10551 */}
            <a
              href="https://wa.me/917723810551?text=Hi%20Casa%20Milano%21%20I%20would%20like%20to%20inquire%20about%20booking%20a%20table%20%2F%20session."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playSelect()}
              className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-950/40 hover:bg-emerald-500 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-black transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] cursor-pointer"
              title="Chat on WhatsApp (+91 77238 10551)"
              aria-label="Chat with Casa Milano on WhatsApp (+91 77238 10551)"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

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
              className="p-2 text-slate-400 hover:text-cyan-300 hover:bg-slate-900/60 rounded-lg border border-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
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
              className="relative inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
            >
              <span>VISIT</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                soundManager.playBlip(500);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg border border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
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
              {/* WhatsApp Quick Chat Card */}
              <a
                href="https://wa.me/917723810551?text=Hi%20Casa%20Milano%21%20I%20would%20like%20to%20inquire%20about%20booking%20a%20table%20%2F%20session."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMobileMenuOpen(false);
                  soundManager.playSelect();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center justify-between text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp (+91 77238 10551)</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Chat Now</span>
              </a>

              {/* Instagram Follow Card */}
              <a
                href="https://www.instagram.com/casamilano.cm?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setMobileMenuOpen(false);
                  soundManager.playSelect();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-950/50 via-purple-950/50 to-amber-950/30 border border-pink-500/30 text-pink-200 flex items-center justify-between text-xs font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-pink-400" />
                  <span>Instagram (@casamilano.cm)</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-pink-500/20 text-pink-300">Follow</span>
              </a>

              {onReopenIntro && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    soundManager.playBlip(520);
                    onReopenIntro();
                  }}
                  className="w-full py-2.5 px-4 text-center text-xs font-mono font-medium uppercase tracking-wider text-cyan-300 bg-slate-900/90 border border-cyan-900/50 rounded-lg flex items-center justify-center gap-2 cursor-pointer"
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
                className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-black bg-cyan-400 rounded-lg shadow-lg cursor-pointer"
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
