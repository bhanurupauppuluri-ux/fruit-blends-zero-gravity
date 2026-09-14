import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackgroundMesh({ activeTheme }) {
  const startColor = activeTheme?.colors?.start || '#FF007A';
  const endColor = activeTheme?.colors?.end || '#7928CA';

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#08080C]">
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay z-10" />

      {/* Dynamic Ambient Mesh Glows */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTheme?.id || 'default'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          {/* Top Left Gradient Mesh Orb */}
          <div
            className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[140px] opacity-35 transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, ${startColor} 0%, rgba(8, 8, 12, 0) 70%)`
            }}
          />

          {/* Bottom Right Gradient Mesh Orb */}
          <div
            className="absolute top-[40%] -right-[15%] w-[65vw] h-[65vw] rounded-full blur-[160px] opacity-30 transition-all duration-1000"
            style={{
              background: `radial-gradient(circle, ${endColor} 0%, rgba(8, 8, 12, 0) 70%)`
            }}
          />

          {/* Central Ambient Glow */}
          <div
            className="absolute top-[25%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[180px] opacity-20 transition-all duration-1000 mix-blend-screen"
            style={{
              background: `radial-gradient(circle, ${startColor} 0%, ${endColor} 50%, rgba(8, 8, 12, 0) 80%)`
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Subtle Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" 
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
