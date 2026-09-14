import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, ArrowUpRight, Check, Droplets, Flame, Zap } from 'lucide-react';
import { FLAVOR_PROFILES } from '../data/flavors';
import { playClick, playGlassTap } from '../utils/audio';

export default function FlavorGallery({ activeTheme, onSelectTheme }) {
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState(activeTheme?.id || FLAVOR_PROFILES[0].id);

  // 3D Tilt calculation
  const handleMouseMove = (e, cardId) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotateX = -(y / (rect.height / 2)) * 12; // max 12 deg tilt
    const rotateY = (x / (rect.width / 2)) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    setHoveredCardId(null);
  };

  const handleMouseEnter = (flavor) => {
    setHoveredCardId(flavor.id);
    onSelectTheme(flavor);
    playGlassTap();
  };

  const handleSelectCard = (flavor) => {
    setSelectedCardId(flavor.id);
    onSelectTheme(flavor);
    playClick();
  };

  return (
    <section id="gallery" className="relative w-full py-24 px-4 sm:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full mb-4 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
            <Layers className="w-3.5 h-3.5" />
            Gyroscopic 3D Parallax Gallery
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            SIGNATURE BLENDS
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base font-medium">
            Hover over any blend card to experience 3D tilt dynamics and transition the ambient background mesh to its color spectrum.
          </p>
        </div>

        {/* 3D Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FLAVOR_PROFILES.map((flavor) => {
            const isSelected = selectedCardId === flavor.id;
            const isHovered = hoveredCardId === flavor.id;

            return (
              <div
                key={flavor.id}
                onMouseMove={(e) => handleMouseMove(e, flavor.id)}
                onMouseEnter={() => handleMouseEnter(flavor)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleSelectCard(flavor)}
                data-interactive="true"
                style={{
                  transition: 'transform 0.15s ease-out, border-color 0.4s, box-shadow 0.4s',
                  transformStyle: 'preserve-3d',
                  '--hover-glow': flavor.colors.glow
                }}
                className={`glass-panel glass-panel-hover p-6 rounded-3xl cursor-pointer flex flex-col justify-between relative overflow-hidden group ${
                  isSelected ? 'border-white/40 ring-1 ring-white/30' : ''
                }`}
              >
                {/* Background Ambient Glow */}
                <div 
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[50px] opacity-30 pointer-events-none transition-all duration-500 group-hover:opacity-60"
                  style={{ backgroundColor: flavor.colors.start }}
                />

                {/* Card Top Row */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span 
                      className="text-[10px] font-bold font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-white/10"
                      style={{
                        backgroundColor: `${flavor.colors.start}22`,
                        color: flavor.colors.accent
                      }}
                    >
                      {flavor.name}
                    </span>

                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Blend Name & Tagline */}
                  <h3 className="font-display text-2xl font-extrabold text-white tracking-tight mb-2 group-hover:text-white transition-colors">
                    {flavor.name}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium mb-4 line-clamp-2">
                    {flavor.description}
                  </p>

                  {/* Flavor Note Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {flavor.notes.map((note, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold text-slate-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flavor Intensity Sliders */}
                <div className="space-y-2.5 mb-6 py-3 border-y border-white/10">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Flavor Intensity Spectrum
                  </div>

                  {Object.entries(flavor.intensity).map(([key, val]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-300 capitalize font-medium">
                        <span>{key}</span>
                        <span className="font-mono text-white/80">{val}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${val}%`,
                            background: `linear-gradient(to right, ${flavor.colors.start}, ${flavor.colors.end})`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Card Bottom CTA */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                    <Droplets className="w-3.5 h-3.5" style={{ color: flavor.colors.accent }} />
                    <span>{flavor.nutrition.antioxidants}% Antiox</span>
                  </div>

                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 group-hover:bg-white text-white group-hover:text-slate-950 transition-all duration-300 group-hover:scale-110"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
