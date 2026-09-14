import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Plus, Trash2, Sparkles, RefreshCw, Droplet, Flame, CheckCircle2 } from 'lucide-react';
import { INGREDIENT_ITEMS } from '../data/flavors';
import { playFluidPour, playVortexBlend, playGlassTap, playClick } from '../utils/audio';
import NutritionStats from './NutritionStats';

export default function BlendLab({ activeTheme, onThemeChange }) {
  const [selectedIngredients, setSelectedIngredients] = useState([
    INGREDIENT_ITEMS[0], // Dragonfruit
    INGREDIENT_ITEMS[2], // Mint
    INGREDIENT_ITEMS[6]  // Ice
  ]);
  const [isBlending, setIsBlending] = useState(false);
  const [wavePhase, setWavePhase] = useState(0);
  const [blendSuccess, setBlendSuccess] = useState(false);

  // Dynamic wave physics loop
  useEffect(() => {
    let animId;
    const animateWave = () => {
      setWavePhase(prev => (prev + 0.05) % (Math.PI * 2));
      animId = requestAnimationFrame(animateWave);
    };
    animId = requestAnimationFrame(animateWave);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Add ingredient
  const handleAddIngredient = (item) => {
    if (selectedIngredients.length >= 7) return;
    setSelectedIngredients(prev => [...prev, item]);
    playFluidPour();
  };

  // Remove ingredient
  const handleRemoveIngredient = (index) => {
    setSelectedIngredients(prev => prev.filter((_, i) => i !== index));
    playGlassTap();
  };

  // Reset mixer
  const handleReset = () => {
    setSelectedIngredients([]);
    setBlendSuccess(false);
    playClick();
  };

  // Trigger Vortex Blending
  const handleTriggerBlend = () => {
    if (selectedIngredients.length === 0 || isBlending) return;
    setIsBlending(true);
    setBlendSuccess(false);
    playVortexBlend();

    setTimeout(() => {
      setIsBlending(false);
      setBlendSuccess(true);

      // Trigger Confetti Burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: selectedIngredients.map(i => i.color)
        });
      } catch (e) {
        // Fallback
      }
    }, 1500);
  };

  // Calculate live cumulative nutrition
  const liveNutrition = selectedIngredients.reduce(
    (acc, curr) => ({
      antioxidants: Math.min(100, acc.antioxidants + curr.antioxidants),
      sugars: Math.round((acc.sugars + curr.sugars) * 10) / 10,
      hydration: Math.min(100, acc.hydration + curr.hydration),
      vitaminC: Math.min(200, acc.vitaminC + curr.vitaminC)
    }),
    { antioxidants: 10, sugars: 2, hydration: 20, vitaminC: 15 }
  );

  // Calculate liquid fill percentage (max 80%)
  const fillPercentage = Math.min(80, Math.max(15, selectedIngredients.length * 11));

  // Determine blended liquid primary color
  const primaryLiquidColor = selectedIngredients.length > 0
    ? selectedIngredients[0].color
    : (activeTheme?.colors?.accent || '#FF007A');

  const secondaryLiquidColor = selectedIngredients.length > 1
    ? selectedIngredients[1].color
    : (activeTheme?.colors?.end || '#7928CA');

  // Dynamic SVG Wave Path generator
  const getWavePath = (width = 300, height = 360, fillPct = 50) => {
    const liquidY = height - (height * (fillPct / 100));
    const amplitude = isBlending ? 18 : 8;
    const frequency = 0.025;

    let path = `M 0 ${liquidY}`;
    for (let x = 0; x <= width; x += 10) {
      const y = liquidY + Math.sin(x * frequency + wavePhase) * amplitude;
      path += ` L ${x} ${y}`;
    }
    path += ` L ${width} ${height} L 0 ${height} Z`;
    return path;
  };

  return (
    <section id="blend-lab" className="relative w-full py-24 px-4 sm:px-8 z-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 glass-pill px-4 py-1.5 rounded-full mb-4 text-xs font-semibold text-pink-400 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Alchemy Station
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
            MIX & BLEND LAB
          </h2>
          <p className="mt-4 text-slate-300 text-sm sm:text-base font-medium">
            Drag or tap ingredients to craft your custom anti-gravity elixir. Watch the liquid level rise with real-time wave physics.
          </p>
        </div>

        {/* Mixer Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-16">
          
          {/* Left Column: Ingredient Shelf */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-3xl shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                Raw Botanicals
              </h3>
              <span className="text-xs text-slate-400 font-mono">Tap to add</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {INGREDIENT_ITEMS.map((item) => {
                const count = selectedIngredients.filter(i => i.id === item.id).length;
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleAddIngredient(item)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.96 }}
                    data-interactive="true"
                    className="flex items-center justify-between p-3 rounded-2xl glass-panel-hover border border-white/5 bg-white/[0.02] text-left transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md border border-white/10"
                        style={{ backgroundColor: `${item.color}22` }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span>+{item.antioxidants}% Antiox</span>
                          <span>•</span>
                          <span>+{item.vitaminC}% Vit C</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {count > 0 && (
                        <span className="w-5 h-5 rounded-full bg-pink-500 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                          {count}
                        </span>
                      )}
                      <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20">
                        <Plus className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Center Column: Central Glass Blending Vessel */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center">
            
            <div className="relative w-[280px] sm:w-[320px] h-[400px] flex items-center justify-center">
              
              {/* Glass Vessel Outer Glow */}
              <div 
                className="absolute inset-4 rounded-[60px] blur-[30px] opacity-30 transition-all duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${primaryLiquidColor} 0%, ${secondaryLiquidColor} 100%)`
                }}
              />

              {/* Glass Cylinder Container */}
              <div className="relative w-full h-full glass-panel rounded-[60px] border-2 border-white/20 shadow-2xl overflow-hidden flex flex-col justify-end backdrop-blur-heavy">
                
                {/* Measuring Gauge Ticks */}
                <div className="absolute left-4 top-12 bottom-12 z-20 flex flex-col justify-between opacity-30 text-[9px] font-mono text-white pointer-events-none">
                  <span>800ml</span>
                  <span>600ml</span>
                  <span>400ml</span>
                  <span>200ml</span>
                </div>

                {/* Morphing SVG Liquid Canvas */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                  <defs>
                    <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={primaryLiquidColor} stopOpacity="0.85" />
                      <stop offset="100%" stopColor={secondaryLiquidColor} stopOpacity="0.9" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* SVG Dynamic Wave Path */}
                  <path
                    d={getWavePath(320, 400, fillPercentage)}
                    fill="url(#liquidGrad)"
                    filter="url(#glow)"
                    className="transition-all duration-500"
                  />
                </svg>

                {/* Floating Dropped Ingredients Inside Liquid */}
                <div className="absolute inset-0 z-20 pointer-events-none flex flex-wrap items-end justify-center pb-12 px-6 gap-2">
                  <AnimatePresence>
                    {selectedIngredients.map((item, idx) => (
                      <motion.div
                        key={`${item.id}-${idx}`}
                        initial={{ y: -80, scale: 0, opacity: 0 }}
                        animate={{ 
                          y: isBlending ? [0, -40, 0] : [0, -6, 0],
                          x: isBlending ? [0, (idx % 2 === 0 ? 30 : -30), 0] : 0,
                          rotate: isBlending ? 360 : 0,
                          scale: 1, 
                          opacity: 1 
                        }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ 
                          duration: isBlending ? 0.6 : 2, 
                          repeat: isBlending ? Infinity : Infinity,
                          repeatType: 'reverse'
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-lg border border-white/20 backdrop-blur-md"
                        style={{ backgroundColor: `${item.color}44` }}
                      >
                        {item.icon}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Vortex Blade Graphic at Bottom */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <RefreshCw className={`w-8 h-8 text-white/40 ${isBlending ? 'animate-spin text-amber-400' : ''}`} />
                </div>

              </div>
            </div>

            {/* Action Buttons underneath vessel */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={handleTriggerBlend}
                disabled={selectedIngredients.length === 0 || isBlending}
                data-interactive="true"
                className={`px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-wider text-white transition-all duration-300 shadow-xl flex items-center gap-2 ${
                  selectedIngredients.length === 0 
                    ? 'opacity-40 cursor-not-allowed bg-slate-800' 
                    : 'hover:scale-105 active:scale-95'
                }`}
                style={{
                  background: selectedIngredients.length > 0 
                    ? `linear-gradient(135deg, ${primaryLiquidColor}, ${secondaryLiquidColor})`
                    : undefined,
                  boxShadow: selectedIngredients.length > 0
                    ? `0 0 25px ${primaryLiquidColor}66`
                    : undefined
                }}
              >
                {isBlending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Synthesizing Elixir...
                  </>
                ) : blendSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    Blend Complete!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Activate Vortex Blend
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                data-interactive="true"
                className="p-3.5 rounded-full glass-panel text-slate-400 hover:text-white hover:border-white/30 transition-all duration-200"
                title="Clear Vessel"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: Active Blend Recipe Summary */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-3xl shadow-glass flex flex-col justify-between h-full">
            <div>
              <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center justify-between">
                <span>Vessel Contents</span>
                <span className="text-xs font-mono text-pink-400 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20">
                  {selectedIngredients.length} / 7 items
                </span>
              </h3>

              {selectedIngredients.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs font-medium border border-dashed border-white/10 rounded-2xl">
                  Vessel is empty. Add ingredients from the left shelf to craft a blend.
                </div>
              ) : (
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {selectedIngredients.map((item, idx) => (
                    <motion.div
                      key={`summary-${idx}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-xs font-bold text-slate-200">{item.name}</span>
                      </div>

                      <button
                        onClick={() => handleRemoveIngredient(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Macro Breakdown */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Calculated Volume</span>
                <span className="font-mono font-bold text-white">{selectedIngredients.length * 100 + 200} ml</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Antioxidant Index</span>
                <span className="font-mono font-bold text-pink-400">{liveNutrition.antioxidants}%</span>
              </div>
            </div>
          </div>

        </div>

        {/* Live Macro Telemetry Section */}
        <NutritionStats nutrition={liveNutrition} activeTheme={activeTheme} />

      </div>
    </section>
  );
}
