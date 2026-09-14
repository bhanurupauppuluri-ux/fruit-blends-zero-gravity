import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Flame, Droplets, Zap, Sparkles } from 'lucide-react';

export default function NutritionStats({ nutrition, activeTheme }) {
  const accentColor = activeTheme?.colors?.accent || '#FF007A';

  const metrics = [
    {
      id: 'antioxidants',
      label: 'Antioxidant Density',
      value: nutrition.antioxidants,
      unit: '%',
      icon: ShieldCheck,
      color: '#FF007A',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 'sugars',
      label: 'Natural Sugars',
      value: nutrition.sugars,
      unit: 'g',
      icon: Flame,
      color: '#FF9900',
      gradient: 'from-amber-400 to-orange-500'
    },
    {
      id: 'hydration',
      label: 'Hydration Index',
      value: nutrition.hydration,
      unit: '%',
      icon: Droplets,
      color: '#00D9F6',
      gradient: 'from-cyan-400 to-blue-500'
    },
    {
      id: 'vitaminC',
      label: 'Vitamin C Coverage',
      value: nutrition.vitaminC,
      unit: '%',
      icon: Zap,
      color: '#00F5A0',
      gradient: 'from-emerald-400 to-teal-500'
    }
  ];

  return (
    <div id="telemetry" className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
        <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">
          Live Bio-Telemetry & Macro Analysis
        </h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          // Calculate circle stroke offset for 100 max
          const radius = 36;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (Math.min(m.value, 150) / 100) * circumference;

          return (
            <motion.div
              key={m.id}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="glass-panel p-5 rounded-2xl flex flex-col justify-between shadow-glass relative overflow-hidden group"
            >
              {/* Top Row: Icon & Label */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-300 max-w-[90px] leading-tight">
                  {m.label}
                </span>
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300"
                  style={{ color: m.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              {/* Radial Meter & Value */}
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-3xl font-extrabold text-white tracking-tight">
                    {m.value}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {m.unit}
                  </span>
                </div>

                {/* SVG Radial Wheel */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="28"
                      cy="28"
                      r={radius}
                      className="stroke-white/10 fill-none"
                      strokeWidth="5"
                    />
                    {/* Progress circle */}
                    <motion.circle
                      cx="28"
                      cy="28"
                      r={radius}
                      className="fill-none"
                      stroke={m.color}
                      strokeWidth="5"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Subtle accent line on hover */}
              <div 
                className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(to right, ${m.color}, transparent)` }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
