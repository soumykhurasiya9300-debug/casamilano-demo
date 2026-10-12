import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  ArrowUp, 
  Copy, 
  Check, 
  Navigation, 
  Gamepad2, 
  ExternalLink,
  MessageCircle,
  Instagram 
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import DodgeField from './DodgeField';

interface ClosingVisitProps {
  onOpenBooking: () => void;
}

export const ClosingVisit: React.FC<ClosingVisitProps> = ({ onOpenBooking }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const addressText = "Casa Milano Gaming Café, 3rd Floor, VV Tower, Ideal Hills, Adarsh Nagar";

  const handleCopyAddress = () => {
    soundManager.playBlip(600);
    navigator.clipboard.writeText(addressText).then(() => {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    }).catch(() => {
      // Fallback
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    });
  };

  const handleScrollToTop = () => {
    soundManager.playBlip(440);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="visit" className="relative pt-24 pb-12 bg-[#050811] border-t border-cyan-900/20 overflow-hidden">
      
      {/* Dramatic Atmosphere Background Trails */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-cyan-950/20 via-violet-950/10 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Dramatic Final Visual: "PLAY. EAT. CHILL. REPEAT." */}
        <div className="text-center mb-20">
          <div className="inline-block text-xs font-mono uppercase tracking-widest text-cyan-400 mb-4 px-3 py-1 rounded bg-cyan-950/30 border border-cyan-500/20">
            THE CASA MILANO RITUAL
          </div>
          
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white uppercase leading-[1.05] drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
            <span className="hover:text-cyan-400 transition-colors duration-300">PLAY. </span>
            <span className="hover:text-violet-400 transition-colors duration-300">EAT. </span>
            <span className="hover:text-amber-400 transition-colors duration-300">CHILL. </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">REPEAT.</span>
          </h2>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
            Whether chasing snooker centuries, setting sim racing lap records, or unwinding over craft burgers, 
            Casa Milano is your sanctuary.
          </p>

          {/* Interactive DodgeField "LET'S PLAY" Primary Action CTA */}
          <div className="mt-8 flex justify-center">
            <DodgeField
              inkColor="#00f0ff"
              contrastColor="#050811"
              fieldHeight={180}
              reach={90}
              radius={140}
              falloff={2}
              fleeDuration={130}
              returnDuration={620}
              returnBounce={0.15}
              axis="both"
              wall="clamp"
              patience={4}
              taunts={["LET'S PLAY", "Too slow! ⚡", "Almost got it! 🎯", "Okay, you win! 🏆"]}
              onDodge={() => {
                soundManager.playBlip(520);
              }}
              onRelent={() => {
                soundManager.playBlip(780);
              }}
              onCatch={() => {
                soundManager.playConfirm();
                onOpenBooking();
              }}
            >
              {({ dodges, gave, caught }) => (
                <button
                  type="button"
                  onClick={() => {
                    soundManager.playConfirm();
                    onOpenBooking();
                  }}
                  className={`group relative inline-flex items-center gap-3 px-10 py-5 text-base sm:text-lg font-bold uppercase tracking-wider rounded-2xl transition-all duration-300 shadow-[0_0_35px_rgba(6,182,212,0.45)] hover:shadow-[0_0_55px_rgba(6,182,212,0.85)] cursor-pointer select-none active:scale-[0.98] ${
                    gave || caught
                      ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-[0_0_50px_rgba(52,211,153,0.7)]'
                      : dodges > 0
                        ? 'bg-cyan-300 text-black scale-105'
                        : 'bg-cyan-400 hover:bg-cyan-300 text-black'
                  }`}
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-sweep pointer-events-none" />
                  <Gamepad2 className={`w-6 h-6 text-black transition-transform duration-300 ${
                    dodges ? 'rotate-12 scale-110' : 'group-hover:rotate-12'
                  }`} />
                  <span className="relative z-10 font-display tracking-widest font-black">
                    {gave 
                      ? 'RESERVED! CLICK TO BOOK 🏆' 
                      : dodges === 1 
                        ? 'TOO SLOW! ⚡' 
                        : dodges === 2 
                          ? 'NICE TRY! 🎯' 
                          : dodges >= 3 
                            ? `DODGE x${dodges}! 🚀` 
                            : "LET'S PLAY"}
                  </span>
                </button>
              )}
            </DodgeField>
          </div>
        </div>

        {/* Compact Location & Contact Area */}
        <div className="bg-[#080d1c] border border-slate-800 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl mb-20 relative overflow-hidden">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Column 1: Location & Directions */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>LOCATION & PARKING</span>
                </div>
                <h3 className="text-xl font-bold font-display uppercase tracking-wide text-white mb-2">
                  Casa Milano Lounge
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  3rd Floor, VV Tower, Ideal Hills<br />
                  Adarsh Nagar<br />
                  <span className="text-xs text-[#dfba67]">Snooker • Gaming • Gourmet Café</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
                >
                  {copiedAddress ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAddress ? 'Address Copied' : 'Copy Address'}</span>
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-400 bg-cyan-950/40 hover:bg-cyan-900/40 rounded-lg border border-cyan-800/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Directions</span>
                  <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
                </a>
              </div>
            </div>

            {/* Column 2: Hours & Schedule */}
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3">
                <Clock className="w-4 h-4" />
                <span>OPERATING HOURS</span>
              </div>
              <h3 className="text-xl font-bold font-display uppercase tracking-wide text-white mb-2">
                Lounge & Kitchen Schedule
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-300">Monday – Thursday</span>
                  <span className="font-mono text-cyan-300">11:00 AM – 01:00 AM</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-300">Friday – Saturday</span>
                  <span className="font-mono text-cyan-300">10:00 AM – 03:00 AM</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                  <span className="text-slate-300">Sunday</span>
                  <span className="font-mono text-cyan-300">10:00 AM – 01:00 AM</span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Full gourmet kitchen menu served until 30 minutes before closing.
                </p>
              </div>
            </div>

            {/* Column 3: Direct Concierge, WhatsApp & Instagram */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-cyan-400 mb-3">
                  <Phone className="w-4 h-4" />
                  <span>DIRECT CONNECT & SOCIAL</span>
                </div>
                <h3 className="text-xl font-bold font-display uppercase tracking-wide text-white mb-2">
                  Official Channels
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  Connect instantly with our concierge on WhatsApp or follow daily highlights:
                </p>
                <div className="space-y-2.5">
                  {/* WhatsApp Line */}
                  <a 
                    href="https://wa.me/917723810551?text=Hi%20Casa%20Milano%21%20I%20would%20like%20to%20inquire%20about%20booking%20a%20table%20%2F%20session." 
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundManager.playSelect()}
                    className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 hover:text-emerald-100 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold font-display uppercase tracking-wider">WhatsApp Direct</div>
                        <div className="text-[11px] font-mono text-emerald-400">+91 77238 10551</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Chat</span>
                  </a>

                  {/* Instagram Profile */}
                  <a 
                    href="https://www.instagram.com/casamilano.cm?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw==" 
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundManager.playSelect()}
                    className="flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-amber-950/30 hover:from-pink-900/60 hover:to-purple-900/60 border border-pink-500/30 text-pink-300 hover:text-pink-100 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                        <Instagram className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold font-display uppercase tracking-wider">Instagram Feed</div>
                        <div className="text-[11px] font-mono text-pink-300">@casamilano.cm</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase bg-pink-500/20 text-pink-300 px-2 py-0.5 rounded">Follow</span>
                  </a>

                  {/* Direct Phone */}
                  <a 
                    href="tel:+917723810551" 
                    className="flex items-center gap-2 text-xs text-slate-300 hover:text-cyan-400 transition-colors font-mono py-1 px-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Call: +91 77238 10551</span>
                  </a>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    soundManager.playSelect();
                    onOpenBooking();
                  }}
                  className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-cyan-300 hover:text-black bg-cyan-950/60 hover:bg-cyan-400 rounded-xl border border-cyan-800/60 hover:border-cyan-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
                >
                  Send Direct Inquiry
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Minimal Branded Footer with Social Channels */}
        <footer className="border-t border-white/5 pt-8 pb-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          
          <div className="flex items-center gap-3">
            <img src="/images/casamilano-logo.svg" alt="Casa Milano Crest" className="w-6 h-6 object-contain rounded-full" />
            <span className="font-display font-bold text-white uppercase tracking-wider text-sm">
              CASA MILANO
            </span>
            <span className="text-slate-600" aria-hidden="true">·</span>
            <span>© {new Date().getFullYear()} Casa Milano Gaming Café. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#about" className="hover:text-cyan-400 transition-colors">Origin</a>
            <a href="#arena" className="hover:text-cyan-400 transition-colors">The Arena</a>
            <a href="#cafe" className="hover:text-cyan-400 transition-colors">Café</a>
            <a href="#gallery" className="hover:text-cyan-400 transition-colors">Gallery</a>
            <a href="#reviews" className="hover:text-cyan-400 transition-colors">Reviews</a>
            <a href="#visit" className="hover:text-cyan-400 transition-colors">Visit</a>
            
            <span className="text-slate-700 hidden sm:inline">|</span>
            
            {/* Social Links in Footer */}
            <a 
              href="https://www.instagram.com/casamilano.cm?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>@casamilano.cm</span>
            </a>
            
            <a 
              href="https://wa.me/917723810551" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: 77238 10551</span>
            </a>

            <button
              onClick={handleScrollToTop}
              className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors p-1 cursor-pointer"
              aria-label="Scroll back to top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </footer>

      </div>

    </section>
  );
};
