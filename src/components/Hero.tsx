import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, MapPin, Gamepad2, Play, Pause } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate normalized offset from center (-1 to 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const togglePlay = () => {
    soundManager.playSelect();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    soundManager.playSelect();
    const element = document.getElementById('arena');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleVisitClick = (e: React.MouseEvent) => {
    e.preventDefault();
    soundManager.playSelect();
    const element = document.getElementById('visit');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#050811]"
    >
      {/* High-Resolution Dynamic Backdrop Video Layer with Parallax */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/images/hero-video-poster.jpg"
          className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.14] transition-transform duration-700 ease-out"
          style={{
            transform: `scale(1.06) translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`
          }}
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Soft Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-[#050811]/35 to-[#050811]/80" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050811]/40 to-[#050811]/90" />
      </div>

      {/* Dynamic Cyber Ambient Grid & Depth Layers */}
      <div className="absolute inset-0 cyber-grid opacity-25 pointer-events-none z-[1]" />

      {/* Atmospheric Radial Light Trails & Glows */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none transition-transform duration-1000 ease-out z-[1]"
        style={{
          transform: `translate(calc(-50% + ${mousePos.x * 25}px), calc(-50% + ${mousePos.y * 25}px))`
        }}
      />
      <div 
        className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none transition-transform duration-1000 ease-out z-[1]"
        style={{
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`
        }}
      />

      {/* Cinematic Perspective Stage / Diagonal Neon Vector Rails */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="100%" x2="50%" y2="40%" stroke="#06b6d4" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="100%" y1="100%" x2="50%" y2="40%" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="20%" y1="0" x2="50%" y2="40%" stroke="#06b6d4" strokeWidth="0.5" />
          <line x1="80%" y1="0" x2="50%" y2="40%" stroke="#8b5cf6" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Main Hero Content Frame */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Primary Cinematic Headline */}
        <h1 
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white uppercase leading-[1.05] text-balance max-w-4xl drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]"
        >
          YOUR NEXT LEVEL{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 drop-shadow-[0_0_35px_rgba(6,182,212,0.5)]">
            STARTS HERE.
          </span>
        </h1>

        {/* Supporting Slogan */}
        <div className="mt-6 flex flex-col items-center">
          <p className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-[0.2em] text-slate-200 uppercase">
            PLAY. EAT. CHILL. REPEAT.
          </p>
        </div>

        {/* Two Visually Striking Action CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          
          {/* CTA 1: EXPLORE THE ARENA */}
          <a
            href="#arena"
            onClick={handleExploreClick}
            className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-wider text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.7)] hover:scale-[1.02] active:scale-[0.98] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            {/* Light sweep animation */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-sweep pointer-events-none" />
            <Gamepad2 className="w-5 h-5 text-black group-hover:rotate-12 transition-transform duration-300" />
            <span className="relative z-10">EXPLORE THE ARENA</span>
            <ArrowDown className="w-4 h-4 text-black group-hover:translate-y-1 transition-transform duration-300" />
          </a>

          {/* CTA 2: VISIT CASA MILANO */}
          <a
            href="#visit"
            onClick={handleVisitClick}
            className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-wider text-slate-100 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-400/60 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <MapPin className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <span>VISIT CASA MILANO</span>
          </a>

        </div>

        {/* Refined Minimalist Scroll Indicator */}
        <div className="mt-16 sm:mt-20 flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors">
          <span className="text-[11px] font-mono tracking-widest uppercase">Scroll to Discover</span>
          <div className="w-5 h-9 rounded-full border border-slate-700 flex items-start justify-center p-1">
            <div className="w-1.5 h-2.5 rounded-full bg-cyan-400 animate-bounce" />
          </div>
        </div>

      </div>

      {/* Ambient Video Indicator & Interactive Playback Toggle */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause background video" : "Play background video"}
          className="px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800/90 border border-white/10 hover:border-cyan-400/50 backdrop-blur-md text-[11px] font-mono tracking-wider text-slate-300 hover:text-white flex items-center gap-2 transition-all duration-200 group shadow-lg cursor-pointer"
        >
          <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-pulse' : 'bg-amber-400'}`} />
          <span className="hidden sm:inline">{isPlaying ? 'CINEMATIC VIDEO' : 'VIDEO PAUSED'}</span>
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          ) : (
            <Play className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

    </section>
  );
};
