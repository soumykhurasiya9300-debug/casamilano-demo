import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Zap, 
  Compass, 
  Users, 
  Sparkles, 
  Quote
} from 'lucide-react';
import Lanyard from './Lanyard';

const DEFAULT_OWNER_IMAGE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format';

export const OwnerSection: React.FC = () => {
  const [ownerImage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('casa_milano_owner_photo');
      if (saved) return saved;
    }
    return DEFAULT_OWNER_IMAGE;
  });
  return (
    <section id="about" className="relative py-28 bg-[#050811] border-t border-white/5 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Kicker & Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-400 uppercase mb-3 px-3 py-1 rounded bg-cyan-950/20 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>THE ORIGIN & LEADERSHIP</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white uppercase text-balance">
            BUILT BY GAMERS.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400">
              CRAFTED FOR EXCELLENCE.
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed text-balance">
            The story behind Casa Milano Gaming Café — from late-night tournament dreams to a premier sanctuary 
            uniting championship cues, pro sim cockpits, and late-night culinary craft.
          </p>
        </div>

        {/* 2-Column Story & Owner Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch mb-16">
          
          {/* Column 1: Founder Card & Owner Image Showcase (5 cols) */}
          <div className="lg:col-span-5 bg-[#080d1d] border border-cyan-900/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group">
            {/* Ambient Cyan Sheen */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>

              {/* DEDICATED PLACE FOR OWNER IMAGE - 3D INTERACTIVE LANYARD BADGE */}
              <div className="relative mb-6 rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#060a15] shadow-2xl group/photo">
                {/* 3D Lanyard Interactive Physics Badge Canvas Container */}
                <div className="relative w-full h-[480px] sm:h-[520px] overflow-hidden bg-radial from-[#0d1633] via-[#060a17] to-[#03060e]">
                  <Lanyard
                    frontImage={ownerImage}
                    backImage={ownerImage}
                    imageFit="cover"
                    cardColor="#ffffff"
                    orientation="portrait"
                    finish="glossy"
                    cornerRadius={0.3}
                    size={0.6}
                    anchor="center"
                    strapLength={0.5}
                    strapColor="#111111"
                    strapWidth={0.65}
                    metal="silver"
                    gravity={1}
                    damping={0.5}
                    elasticity={0.5}
                    breeze={0.5}
                    interactive={true}
                    intro={true}
                    className="w-full h-full"
                  />

                  {/* Top Overlay Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-10">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#050811]/90 backdrop-blur-md border border-cyan-400/40 text-[11px] font-mono text-cyan-300 font-bold tracking-wide shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span>FOUNDER PASS · 3D</span>
                    </div>

                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono text-emerald-400 font-semibold shadow">
                      <span>ON-SITE</span>
                    </div>
                  </div>

                  {/* Bottom Interactive Hint & Title */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 pointer-events-none z-10">
                    <div className="bg-[#050811]/90 backdrop-blur-md border border-cyan-500/20 rounded-xl px-3 py-2 shadow-xl">
                      <h3 className="text-sm sm:text-base font-black font-display uppercase tracking-wide text-white">
                        Marco Milano
                      </h3>
                      <p className="text-[11px] font-mono text-cyan-300/90 flex items-center gap-1.5 flex-wrap">
                        <span>Founder & Managing Director</span>
                        <span className="text-slate-500">·</span>
                        <span className="text-cyan-400/80 text-[10px]">Drag to swing · Click to flip</span>
                      </p>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#050811]/90 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300 shadow">
                      <span>360° Flip</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Founder Pedigree Subtitle */}
              <div className="mb-4">
                <div className="text-xs font-mono text-slate-400">
                  Former National Billiards Finalist · Esports & GT3 Sim Driver
                </div>
              </div>

              {/* Founder Quote */}
              <div className="relative pl-5 py-1 border-l-2 border-cyan-400/40 mb-6">
                <Quote className="w-5 h-5 text-cyan-400/25 absolute -top-2 left-1.5 pointer-events-none" />
                <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                  "For years, players had to pick between loud, sticky basement arcades or sterile lounges with substandard gear. 
                  We built Casa Milano to erase that compromise: tournament-grade Strachan cloth, 25Nm direct-drive wheelbases, 
                  and honest, made-from-scratch food you’d expect from a fine casual bistro."
                </p>
              </div>
            </div>

            {/* Founder Values */}
            <div className="border-t border-white/5 pt-5 grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 block mb-0.5">ESTABLISHED</span>
                <span className="text-white font-semibold">2022 · Milano Hub</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">STANDARDS</span>
                <span className="text-cyan-400 font-semibold">WPBSA & FIA Spec</span>
              </div>
            </div>
          </div>

          {/* Column 2: The Café Philosophy & Engineering (7 cols) */}
          <div className="lg:col-span-7 bg-[#090e1f] border border-slate-800 rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-cyan-400 mb-2">
                <span>OUR CORE PILLARS</span>
                <span className="text-slate-600" aria-hidden="true">·</span>
                <span className="text-slate-400">ZERO COMPROMISE</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display uppercase tracking-wide text-white mb-6">
                Why Casa Milano Stands Alone
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-1">
                    Championship Table Maintenance
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Ironed Strachan 6811 cloths, laser-leveled slate beds, and matched Aramith ball weights inspected daily.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-1">
                    Dedicated 10Gbps LAN Fiber
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Zero-packet-loss wired routing for esports titles, low-jitter matchmaking, and private party chat acoustics.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-1">
                    Acoustic Privacy Pods
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Custom sound-dampened gaming partitions let you shout in squad chat without disturbing billiards focus.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wide text-white mb-1">
                    Late-Night Artisan Kitchen
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Fresh certified Angus beef, craft sauces, and single-origin cold brews served directly to your bay till 3 AM.
                  </p>
                </div>

              </div>
            </div>

            {/* Quick Pedigree Bar */}
            <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Over 12,000 tournament frames played</span>
              </div>
              <div className="text-cyan-400 font-semibold">
                Official Regional Tournament Host Venue
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
