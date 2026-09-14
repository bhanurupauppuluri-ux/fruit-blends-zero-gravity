import React from 'react';
import { Sparkles, ArrowUp, Github, Code, Cpu } from 'lucide-react';
import { playClick } from '../utils/audio';

export default function Footer({ activeTheme }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    playClick();
  };

  const accentColor = activeTheme?.colors?.accent || '#FF007A';

  return (
    <footer className="relative w-full z-20 pt-16 pb-12 px-4 sm:px-8 border-t border-white/10 glass-panel">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Portfolio Branding */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2 font-display font-extrabold text-lg text-white mb-2">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-white"
              style={{
                background: `linear-gradient(135deg, ${activeTheme?.colors?.start || '#FF007A'}, ${activeTheme?.colors?.end || '#7928CA'})`
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>FRUIT BLENDS</span>
          </div>
          <p className="text-xs text-slate-400 max-w-sm">
            Zero-Gravity Interactive Showcase. Crafted with React, Vite, Matter.js 2D Physics Engine, Framer Motion, and Web Audio API.
          </p>
        </div>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {['React 18', 'Vite', 'Matter.js', 'Framer Motion', 'Tailwind CSS', 'Web Audio API'].map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-mono font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 flex items-center gap-1.5"
            >
              <Code className="w-3 h-3 text-pink-400" />
              {tech}
            </span>
          ))}
        </div>

        {/* Right Back to Top Action */}
        <button
          onClick={scrollToTop}
          data-interactive="true"
          className="glass-pill p-3.5 rounded-full text-white/80 hover:text-white transition-all duration-300 hover:scale-110 flex items-center gap-2 text-xs font-semibold"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-4 h-4 text-emerald-400" />
        </button>

      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[11px] text-slate-500 font-mono">
        <span>© {new Date().getFullYear()} Senior Creative Technologist Portfolio Project.</span>
        <span>60+ FPS Hardware Accelerated</span>
      </div>
    </footer>
  );
}
