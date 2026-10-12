import React, { useState } from 'react';
import { MessageCircle, Instagram, Phone, X, Sparkles, ExternalLink, ChevronUp } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface FloatingSocialBarProps {
  onOpenBooking?: () => void;
}

export const FloatingSocialBar: React.FC<FloatingSocialBarProps> = ({ onOpenBooking }) => {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNumber = "917723810551";
  const whatsappDisplay = "+91 77238 10551";
  const instagramUrl = "https://www.instagram.com/casamilano.cm?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw==";
  const instagramHandle = "@casamilano.cm";

  const handleWhatsappClick = (customText?: string) => {
    soundManager.playSelect();
    const message = customText 
      ? encodeURIComponent(customText)
      : encodeURIComponent("Hi Casa Milano! I would like to inquire about booking a snooker table / gaming bay.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramClick = () => {
    soundManager.playSelect();
    window.open(instagramUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside 
      className="fixed bottom-6 right-6 z-40 flex flex-col items-end select-none"
      aria-label="Casa Milano Social & Quick Connect"
    >
      {/* Expanded Quick Action Popover */}
      {isOpen && (
        <div 
          className="mb-3 w-72 sm:w-80 bg-[#080d1e]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.85)] animate-in fade-in slide-in-from-bottom-3 duration-200"
          role="dialog"
          aria-label="Connect with Casa Milano"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-cyan-400">
                CASA MILANO DIRECT
              </span>
            </div>
            <button
              onClick={() => {
                soundManager.playBlip(400);
                setIsOpen(false);
              }}
              className="p-1 text-slate-400 hover:text-white rounded-md transition-colors"
              aria-label="Close social menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 mt-2 mb-3">
            Direct concierge for championship tables, PlayStation 5 bays, racing simulators & café reservations.
          </p>

          {/* WhatsApp Direct Action Card */}
          <div className="space-y-2">
            <button
              onClick={() => handleWhatsappClick()}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/60 to-emerald-900/40 hover:from-emerald-600 hover:to-emerald-500 border border-emerald-500/40 hover:border-emerald-400 text-slate-200 hover:text-black transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 group-hover:bg-black/20 flex items-center justify-center text-emerald-400 group-hover:text-black transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold font-display uppercase tracking-wider">
                    WhatsApp Chat
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400/90 group-hover:text-black/80">
                    {whatsappDisplay}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </button>

            {/* Instagram Direct Action Card */}
            <button
              onClick={handleInstagramClick}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-amber-950/30 hover:from-gradient-to-r hover:bg-gradient-to-r hover:from-pink-600 hover:via-purple-600 hover:to-amber-500 border border-pink-500/30 hover:border-pink-400 text-slate-200 hover:text-white transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pink-500/20 group-hover:bg-black/20 flex items-center justify-center text-pink-400 group-hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold font-display uppercase tracking-wider">
                    Instagram Reel & Updates
                  </div>
                  <div className="text-[10px] font-mono text-pink-300/90 group-hover:text-white/90">
                    {instagramHandle}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
            </button>

            {/* Direct Phone Call */}
            <a
              href={`tel:${whatsappNumber}`}
              onClick={() => soundManager.playSelect()}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-cyan-300 transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="font-semibold">Direct Phone Call</div>
                  <div className="text-[10px] font-mono text-slate-400">{whatsappDisplay}</div>
                </div>
              </div>
              <span className="text-[10px] font-mono uppercase text-cyan-400">Call</span>
            </a>
          </div>

          {/* Quick Booking Button */}
          {onOpenBooking && (
            <button
              onClick={() => {
                soundManager.playConfirm();
                setIsOpen(false);
                onOpenBooking();
              }}
              className="mt-3 w-full py-2 px-3 text-xs font-bold font-display uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Book Table In-App</span>
            </button>
          )}
        </div>
      )}

      {/* Main Persistent Dock Buttons */}
      <div className="flex items-center gap-2 bg-[#050811]/90 backdrop-blur-xl border border-white/10 hover:border-cyan-500/40 p-1.5 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all">
        
        {/* 1. WhatsApp Instant Launch Pill */}
        <button
          onClick={() => handleWhatsappClick()}
          className="group relative flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 cursor-pointer"
          title={`WhatsApp: ${whatsappDisplay}`}
          aria-label={`Open WhatsApp Chat with Casa Milano: ${whatsappDisplay}`}
        >
          <div className="relative">
            <MessageCircle className="w-4 h-4 fill-black text-black" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
          <span className="font-display uppercase tracking-wider font-bold hidden sm:inline">WhatsApp</span>
          <span className="font-mono text-[11px] opacity-80 hidden md:inline">77238 10551</span>
        </button>

        {/* 2. Instagram Profile Pill */}
        <button
          onClick={handleInstagramClick}
          className="group flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-pink-600 via-purple-600 to-amber-500 hover:from-pink-500 hover:to-amber-400 text-white font-semibold text-xs transition-all shadow-[0_0_15px_rgba(236,72,153,0.35)] hover:shadow-[0_0_25px_rgba(236,72,153,0.65)] hover:scale-105 active:scale-95 cursor-pointer"
          title="Instagram @casamilano.cm"
          aria-label="Open Casa Milano Instagram Profile @casamilano.cm"
        >
          <Instagram className="w-4 h-4 text-white" />
          <span className="font-display uppercase tracking-wider font-bold hidden sm:inline">@casamilano.cm</span>
        </button>

        {/* 3. Expand / Toggle Menu Button */}
        <button
          onClick={() => {
            soundManager.playBlip(560);
            setIsOpen(!isOpen);
          }}
          className={`p-2 rounded-full transition-all text-slate-300 hover:text-cyan-400 hover:bg-slate-800/80 cursor-pointer ${
            isOpen ? 'bg-cyan-500/20 text-cyan-400 rotate-180' : ''
          }`}
          title={isOpen ? "Collapse Contact Menu" : "Expand All Contacts"}
          aria-label="Toggle Casa Milano Social Menu"
        >
          <ChevronUp className="w-4 h-4 transition-transform duration-200" />
        </button>

      </div>
    </aside>
  );
};

export default FloatingSocialBar;
