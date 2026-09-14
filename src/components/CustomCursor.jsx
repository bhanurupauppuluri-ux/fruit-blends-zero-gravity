import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor({ activeTheme }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [trails, setTrails] = useState([]);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth spring physics for outer ring trailing effect
  const springConfig = { damping: 28, stiffness: 350, mass: 0.5 };
  const haloX = useSpring(cursorX, springConfig);
  const haloY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Check if hovering over interactive element
      const target = e.target;
      const isInteractive = target.closest('button, a, input, select, [data-interactive="true"]');
      setIsHovered(!!isInteractive);

      // Randomly spawn subtle particle trail on motion
      if (Math.random() < 0.15) {
        const id = Math.random();
        const newParticle = {
          id,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 6 + 2,
          color: activeTheme?.colors?.accent || '#FF007A'
        };
        setTrails(prev => [...prev.slice(-12), newParticle]);
        setTimeout(() => {
          setTrails(prev => prev.filter(p => p.id !== id));
        }, 600);
      }
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [activeTheme, cursorX, cursorY]);

  // Hide default cursor on desktop
  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  const accentColor = activeTheme?.colors?.accent || '#FF007A';

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Particle Trails */}
      {trails.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 0.2, y: p.y - 15 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* Trailing Glowing Outer Halo Ring */}
      <motion.div
        style={{
          x: haloX,
          y: haloY,
          translateX: '-50%',
          translateY: '-50%',
          borderColor: accentColor,
          boxShadow: isHovered
            ? `0 0 25px ${accentColor}, inset 0 0 15px ${accentColor}`
            : `0 0 12px ${accentColor}`
        }}
        animate={{
          width: isHovered ? 54 : isClicked ? 24 : 36,
          height: isHovered ? 54 : isClicked ? 24 : 36,
          borderWidth: isHovered ? '2px' : '1px',
          opacity: isHovered ? 0.9 : 0.6,
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="absolute rounded-full border pointer-events-none backdrop-blur-[1px]"
      />

      {/* High-Precision Center Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: accentColor,
          boxShadow: `0 0 8px ${accentColor}`
        }}
        animate={{
          scale: isClicked ? 0.6 : isHovered ? 1.5 : 1,
        }}
        transition={{ duration: 0.08 }}
        className="absolute w-2 h-2 rounded-full pointer-events-none"
      />
    </div>
  );
}
