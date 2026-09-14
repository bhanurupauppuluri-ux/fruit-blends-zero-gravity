import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Activity, Layers, Disc } from 'lucide-react';
import { setSoundMuted, getSoundMuted, playClick } from '../utils/audio';

export default function Navbar({ activeTheme }) {
  const [isMuted, setIsMuted] = useState(getSoundMuted());

  const toggleSound = () => {
    const newMuted = !isMuted;
    setSoundMuted(newMuted);
    setIsMuted(newMuted);
    if (!newMuted) playClick();
  };

  const accentColor = activeTheme?.colors?.accent || '#FF007A';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-5 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between pointer-events-auto">
        
        {/* Brand Logo */}
        <a 
          href="#hero" 
          onClick={playClick}
          className="flex items-center gap-3 group glass-pill px-4 py-2 rounded-full transition-all duration-300 hover:border-white/30"
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${activeTheme?.colors?.start || '#FF007A'}, ${activeTheme?.colors?.end || '#7928CA'})`,
              boxShadow: `0 0 15px ${accentColor}66`
            }}
          >
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
              FRUIT BLENDS
              <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-white/10 text-white/80 font-normal">
                ZERO-G
              </span>
            </span>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 glass-panel px-3 py-1.5 rounded-full shadow-glass">
          <a
            href="#hero"
            onClick={playClick}
            className="px-4 py-2 text-xs font-semibold text-white/80 hover:text-white rounded-full transition-all duration-200 hover:bg-white/5 flex items-center gap-1.5"
          >
            <Disc className="w-3.5 h-3.5 text-pink-400" />
            Physics Field
          </a>
          <a
            href="#blend-lab"
            onClick={playClick}
            className="px-4 py-2 text-xs font-semibold text-white/80 hover:text-white rounded-full transition-all duration-200 hover:bg-white/5 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Mixer Lab
          </a>
          <a
            href="#gallery"
            onClick={playClick}
            className="px-4 py-2 text-xs font-semibold text-white/80 hover:text-white rounded-full transition-all duration-200 hover:bg-white/5 flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            3D Showcase
          </a>
          <a
            href="#telemetry"
            onClick={playClick}
            className="px-4 py-2 text-xs font-semibold text-white/80 hover:text-white rounded-full transition-all duration-200 hover:bg-white/5 flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            Telemetry
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Audio Toggle Button */}
          <button
            onClick={toggleSound}
            data-interactive="true"
            className="glass-pill p-2.5 rounded-full text-white/80 hover:text-white transition-all duration-300 hover:scale-105 flex items-center justify-center group"
            title={isMuted ? "Unmute Audio Feedback" : "Mute Audio Feedback"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400 group-hover:text-white" />
            ) : (
              <div className="flex items-center gap-1">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="flex items-center gap-0.5 h-3 px-0.5">
                  <span className="w-0.5 h-2 bg-emerald-400 animate-pulse rounded-full" />
                  <span className="w-0.5 h-3 bg-emerald-400 animate-pulse delay-75 rounded-full" />
                  <span className="w-0.5 h-1.5 bg-emerald-400 animate-pulse delay-150 rounded-full" />
                </span>
              </div>
            )}
          </button>

          {/* CTA Sample Request */}
          <a
            href="#blend-lab"
            onClick={playClick}
            data-interactive="true"
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs text-white transition-all duration-300 shadow-lg hover:brightness-115 hover:scale-105 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${activeTheme?.colors?.start || '#FF007A'}, ${activeTheme?.colors?.end || '#7928CA'})`,
              boxShadow: `0 4px 20px ${accentColor}44`
            }}
          >
            Blend Custom Elixir
          </a>
        </div>

      </div>
    </header>
  );
}
