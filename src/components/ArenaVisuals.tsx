import React, { useState } from 'react';
import { Maximize2, Sparkles, CheckCircle2 } from 'lucide-react';

interface VisualProps {
  className?: string;
  isHovered?: boolean;
}

export const SnookerVisual: React.FC<VisualProps> = ({ className = '', isHovered = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`group relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#061412] via-[#040d0c] to-[#020606] border border-emerald-500/30 shadow-[0_10px_40px_rgba(4,67,44,0.3)] ${className}`}>
      {/* Background Glows */}
      <div 
        className="absolute -top-10 -left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}
      />
      <div 
        className="absolute -bottom-10 -right-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}
      />

      {/* Actual Uploaded Image */}
      <div className="relative w-full h-full overflow-hidden">
        <img 
          src="/images/zones/zone1_snooker.jpg"
          alt="Zone 1 Championship Snooker - Casa Milano"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-80'
          } ${isHovered ? 'scale-105 filter brightness-105' : 'scale-100'}`}
        />

        {/* Ambient Dark Gradients for Readability and Mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020606] via-[#040d0c]/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040d0c]/40 via-transparent to-[#040d0c]/40 pointer-events-none" />
      </div>

      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-300 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Zone 01 · Tournament Arena</span>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Strachan 6811</span>
        </div>
      </div>

      {/* Bottom Info HUD overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-emerald-500/30 text-xs text-slate-200 z-10 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-white font-display font-bold tracking-wide uppercase">Championship 12ft English Slate</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>12 Match Tables</span>
          <span className="text-emerald-500" aria-hidden="true">·</span>
          <span>Aramith Pro Phenolic</span>
        </div>
      </div>
    </div>
  );
};

export const PS5Visual: React.FC<VisualProps> = ({ className = '', isHovered = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`group relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#0a0d24] via-[#060817] to-[#03040b] border border-cyan-500/30 shadow-[0_10px_40px_rgba(6,182,212,0.3)] ${className}`}>
      {/* Cyan & Violet Ambient Backlight */}
      <div 
        className="absolute -top-12 -left-12 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}
      />
      <div 
        className="absolute -bottom-10 -right-10 w-72 h-72 bg-violet-600/25 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}
      />

      {/* Actual Uploaded Image */}
      <div className="relative w-full h-full overflow-hidden">
        <img 
          src="/images/zones/zone2_ps5.jpg"
          alt="Zone 2 PS5 Battle Station - Casa Milano"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-80'
          } ${isHovered ? 'scale-105 filter brightness-105' : 'scale-100'}`}
        />

        {/* Ambient Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#03040b] via-[#060817]/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060817]/40 via-transparent to-[#060817]/40 pointer-events-none" />
      </div>

      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 text-[11px] font-mono font-semibold uppercase tracking-wider text-cyan-300 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Zone 02 · Acoustic Pods</span>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>4K 120Hz OLED</span>
        </div>
      </div>

      {/* Bottom Info HUD overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 text-xs text-slate-200 z-10 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-white font-display font-bold tracking-wide uppercase">PS5 Battle Stations</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>Pulse 3D Audio</span>
          <span className="text-cyan-500" aria-hidden="true">·</span>
          <span>DualSense Edge Haptics</span>
        </div>
      </div>
    </div>
  );
};

export const RacingVisual: React.FC<VisualProps> = ({ className = '', isHovered = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`group relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#140a1b] via-[#090611] to-[#030206] border border-fuchsia-500/30 shadow-[0_10px_40px_rgba(217,70,239,0.3)] ${className}`}>
      {/* High-speed motion light cones */}
      <div 
        className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ transform: isHovered ? 'scale(1.2) translateX(-20px)' : 'scale(1)' }}
      />
      <div 
        className="absolute bottom-0 left-1/4 w-80 h-80 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ transform: isHovered ? 'scale(1.15) translateX(20px)' : 'scale(1)' }}
      />

      {/* Actual Uploaded Image */}
      <div className="relative w-full h-full overflow-hidden">
        <img 
          src="/images/zones/zone3_racing.jpg"
          alt="Zone 3 Motion Racing Simulators - Casa Milano"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-80'
          } ${isHovered ? 'scale-105 filter brightness-105' : 'scale-100'}`}
        />

        {/* Ambient Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030206] via-[#090611]/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090611]/40 via-transparent to-[#090611]/40 pointer-events-none" />
      </div>

      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-950/80 backdrop-blur-md border border-fuchsia-500/40 text-[11px] font-mono font-semibold uppercase tracking-wider text-fuchsia-300 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse" />
          <span>Zone 03 · Direct Drive</span>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
          <Sparkles className="w-3 h-3 text-fuchsia-400" />
          <span>3DOF Motion</span>
        </div>
      </div>

      {/* Bottom Info HUD overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-fuchsia-500/30 text-xs text-slate-200 z-10 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-fuchsia-400" />
          <span className="text-white font-display font-bold tracking-wide uppercase">Motion Racing Simulators</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>Fanatec DD2 25Nm</span>
          <span className="text-fuchsia-500" aria-hidden="true">·</span>
          <span>Triple 165Hz Curved</span>
        </div>
      </div>
    </div>
  );
};

export const ArcadeVisual: React.FC<VisualProps> = ({ className = '', isHovered = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`group relative w-full h-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#1b120c] via-[#100a08] to-[#050302] border border-amber-500/30 shadow-[0_10px_40px_rgba(245,158,11,0.3)] ${className}`}>
      {/* Warm Neon Glow */}
      <div 
        className="absolute top-1/4 left-1/3 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ transform: isHovered ? 'scale(1.2)' : 'scale(1)' }}
      />
      <div 
        className="absolute bottom-0 right-10 w-72 h-72 bg-orange-600/20 rounded-full blur-3xl pointer-events-none transition-all duration-700"
        style={{ transform: isHovered ? 'scale(1.15)' : 'scale(1)' }}
      />

      {/* Actual Uploaded Image */}
      <div className="relative w-full h-full overflow-hidden">
        <img 
          src="/images/zones/zone4_arcade.jpg"
          alt="Zone 4 Retro Modern Arcade - Casa Milano"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-80'
          } ${isHovered ? 'scale-105 filter brightness-105' : 'scale-100'}`}
        />

        {/* Ambient Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050302] via-[#100a08]/30 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#100a08]/40 via-transparent to-[#100a08]/40 pointer-events-none" />
      </div>

      {/* Top Badges */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 backdrop-blur-md border border-amber-500/40 text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-300 shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Zone 04 · Retro Modern</span>
        </div>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Sanwa Denshi</span>
        </div>
      </div>

      {/* Bottom Info HUD overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-amber-500/30 text-xs text-slate-200 z-10 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-white font-display font-bold tracking-wide uppercase">Retro-Modern Arcade Hall</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
          <span>Japanese Candy Cabs</span>
          <span className="text-amber-500" aria-hidden="true">·</span>
          <span>120+ Classic & Fighter Hits</span>
        </div>
      </div>
    </div>
  );
};
