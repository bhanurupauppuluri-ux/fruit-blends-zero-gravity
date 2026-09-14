import React, { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { motion } from 'framer-motion';
import { Sparkles, Zap, RotateCcw, ShieldAlert, Play, Compass } from 'lucide-react';
import { playShockwave, playGlassTap } from '../utils/audio';

export default function HeroCanvas({ activeTheme, onSelectTheme }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);

  const [zeroGravity, setZeroGravity] = useState(true);
  const [activeBodyCount, setActiveBodyCount] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Matter.js Module aliases
    const { Engine, World, Bodies, Body, Vector, Mouse, MouseConstraint, Events } = Matter;

    // Create Matter Engine
    const engine = Engine.create({
      gravity: { x: 0, y: zeroGravity ? 0.02 : 0.4 }
    });
    engineRef.current = engine;

    // Screen Bounds
    const wallOptions = { isStatic: true, restitution: 0.8, friction: 0.1 };
    const ground = Bodies.rectangle(width / 2, height + 30, width + 200, 60, wallOptions);
    const ceiling = Bodies.rectangle(width / 2, -30, width + 200, 60, wallOptions);
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height + 200, wallOptions);
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height + 200, wallOptions);

    World.add(engine.world, [ground, ceiling, leftWall, rightWall]);

    // Create Anti-Gravity Fruit Bodies
    const createFruitBody = (x, y, type) => {
      const radius = Math.random() * 18 + 26; // 26px to 44px radius
      const body = Bodies.circle(x, y, radius, {
        restitution: 0.85,
        frictionAir: 0.02,
        friction: 0.1,
        density: 0.001,
        render: { visible: false }
      });

      // Assign custom visual data
      body.fruitType = type;
      body.fruitRadius = radius;
      body.glowColor = type.color;

      // Give subtle initial anti-gravity linear/angular velocity
      Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 4
      });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);

      return body;
    };

    const fruitTypes = [
      { name: 'dragonfruit', color: '#FF007A', innerColor: '#FFFFFF', seeds: true },
      { name: 'orange', color: '#FF5500', innerColor: '#FFAA00', segments: 8 },
      { name: 'kiwi', color: '#88D000', innerColor: '#E2F775', seeds: true },
      { name: 'blueberry', color: '#4130A8', innerColor: '#6B54E9' },
      { name: 'ice', color: '#A0E7E5', innerColor: 'rgba(255,255,255,0.7)', isIce: true },
      { name: 'mint', color: '#00F5A0', innerColor: '#00D9F6', isLeaf: true }
    ];

    const initialBodies = [];
    const itemCount = Math.min(22, Math.floor(width / 50));
    for (let i = 0; i < itemCount; i++) {
      const type = fruitTypes[i % fruitTypes.length];
      const x = Math.random() * (width - 120) + 60;
      const y = Math.random() * (height - 120) + 60;
      initialBodies.push(createFruitBody(x, y, type));
    }

    World.add(engine.world, initialBodies);
    setActiveBodyCount(initialBodies.length);

    // Mouse Constraint setup for dragging
    const mouse = Mouse.create(canvasRef.current);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    World.add(engine.world, mouseConstraint);

    // Mouse Kinetic Force Field Shockwave
    let lastMousePos = { x: 0, y: 0 };
    let mouseSpeed = 0;

    const handleMouseMove = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const dx = mouseX - lastMousePos.x;
      const dy = mouseY - lastMousePos.y;
      mouseSpeed = Math.sqrt(dx * dx + dy * dy);

      // Repulsive kinetic shockwave when moving mouse quickly
      if (mouseSpeed > 15) {
        const bodies = Matter.Composite.allBodies(engine.world);
        bodies.forEach(body => {
          if (body.isStatic) return;
          const distance = Math.sqrt(
            Math.pow(body.position.x - mouseX, 2) + Math.pow(body.position.y - mouseY, 2)
          );
          if (distance < 160) {
            const forceMagnitude = (1 - distance / 160) * 0.003 * Math.min(mouseSpeed, 30);
            const angle = Math.atan2(body.position.y - mouseY, body.position.x - mouseX);
            Body.applyForce(body, body.position, {
              x: Math.cos(angle) * forceMagnitude,
              y: Math.sin(angle) * forceMagnitude
            });
          }
        });
      }

      lastMousePos = { x: mouseX, y: mouseY };
    };

    const handleCanvasClick = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Burst repulsive force wave on click
      const bodies = Matter.Composite.allBodies(engine.world);
      bodies.forEach(body => {
        if (body.isStatic) return;
        const dist = Math.sqrt(Math.pow(body.position.x - clickX, 2) + Math.pow(body.position.y - clickY, 2));
        if (dist < 280) {
          const force = (1 - dist / 280) * 0.025;
          const angle = Math.atan2(body.position.y - clickY, body.position.x - clickX);
          Body.applyForce(body, body.position, {
            x: Math.cos(angle) * force,
            y: Math.sin(angle) * force
          });
        }
      });

      playShockwave();
    };

    const canvas = canvasRef.current;
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleCanvasClick);

    // Custom High-Performance Canvas Rendering Loop
    const ctx = canvas.getContext('2d');
    let animId;

    const drawFruitGraphic = (ctx, body) => {
      const { x, y } = body.position;
      const angle = body.angle;
      const r = body.fruitRadius;
      const type = body.fruitType;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Outer Radial Glow
      const glowGrad = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 1.5);
      glowGrad.addColorStop(0, type.color + '66');
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.5, 0, Math.PI * 2);
      ctx.fill();

      if (type.isIce) {
        // Render Glassy Ice Cube
        ctx.fillStyle = 'rgba(160, 231, 229, 0.25)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const side = r * 1.4;
        ctx.roundRect(-side / 2, -side / 2, side, side, 8);
        ctx.fill();
        ctx.stroke();

        // Ice reflection highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-side / 3, -side / 3);
        ctx.lineTo(-side / 3 + 8, -side / 3);
        ctx.stroke();
      } else if (type.isLeaf) {
        // Render Mint Leaf
        ctx.fillStyle = '#00F5A0';
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#00D9F6';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Leaf veins
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(-r * 0.7, 0);
        ctx.lineTo(r * 0.7, 0);
        ctx.stroke();
      } else {
        // Render Sliced Fruit Circle
        // Outer Skin Ring
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fillStyle = type.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Inner Fruit Flesh
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2);
        ctx.fillStyle = type.innerColor;
        ctx.fill();

        // Fruit Segments / Seeds
        if (type.segments) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          for (let s = 0; s < type.segments; s++) {
            const segAngle = (Math.PI * 2 / type.segments) * s;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(segAngle) * r * 0.8, Math.sin(segAngle) * r * 0.8);
            ctx.stroke();
          }
        } else if (type.seeds) {
          ctx.fillStyle = '#1A1A1A';
          for (let s = 0; s < 6; s++) {
            const seedAngle = (Math.PI * 2 / 6) * s + 0.2;
            const seedDist = r * 0.45;
            ctx.beginPath();
            ctx.arc(Math.cos(seedAngle) * seedDist, Math.sin(seedAngle) * seedDist, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
    };

    const renderLoop = () => {
      Engine.update(engine, 1000 / 60);

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Render bodies
      const bodies = Matter.Composite.allBodies(engine.world);
      bodies.forEach(body => {
        if (!body.isStatic && body.fruitType) {
          drawFruitGraphic(ctx, body);
        }
      });

      animId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // Window resize handler
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      canvasRef.current.width = w;
      canvasRef.current.height = h;

      Body.setPosition(ground, { x: w / 2, y: h + 30 });
      Body.setPosition(ceiling, { x: w / 2, y: -30 });
      Body.setPosition(leftWall, { x: -30, y: h / 2 });
      Body.setPosition(rightWall, { x: w + 30, y: h / 2 });
    };

    canvas.width = width;
    canvas.height = height;
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('resize', handleResize);
      Engine.clear(engine);
    };
  }, [zeroGravity]);

  // Toggle Gravity Vector
  const toggleGravityMode = () => {
    setZeroGravity(prev => !prev);
    if (engineRef.current) {
      engineRef.current.gravity.y = zeroGravity ? 0.4 : 0.02;
    }
    playGlassTap();
  };

  // Burst Force Shockwave
  const triggerShockwave = () => {
    if (!engineRef.current) return;
    const bodies = Matter.Composite.allBodies(engineRef.current.world);
    bodies.forEach(body => {
      if (!body.isStatic) {
        Matter.Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 14,
          y: (Math.random() - 0.5) * 14
        });
      }
    });
    playShockwave();
  };

  const accentColor = activeTheme?.colors?.accent || '#FF007A';

  return (
    <section id="hero" className="relative w-full min-h-screen pt-20 sm:pt-24 pb-6 flex flex-col justify-between overflow-hidden">
      
      {/* Physics Field Container */}
      <div ref={containerRef} className="absolute inset-0 z-10 w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      </div>

      {/* Hero Typography & Floating Glass Card */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full flex flex-col items-center text-center mt-2 sm:mt-4 pointer-events-none">
        
        {/* Floating Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pointer-events-auto inline-flex items-center gap-2 glass-pill px-3.5 py-1.5 rounded-full mb-3 sm:mb-4 text-[11px] sm:text-xs uppercase tracking-widest text-white/90 shadow-glass"
        >
          <Compass className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />
          <span>Zero-Gravity Kinetic Physics Showcase</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight max-w-5xl text-white drop-shadow-2xl leading-[1.02]"
        >
          FLUID ANTI-GRAVITY <br />
          <span 
            className="bg-clip-text text-transparent bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(135deg, ${activeTheme?.colors?.start || '#FF007A'}, ${activeTheme?.colors?.end || '#7928CA'})`
            }}
          >
            FRUIT ELIXIRS
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-3 sm:mt-4 text-xs sm:text-base lg:text-lg text-slate-300 max-w-xl font-medium leading-relaxed"
        >
          Experience hyper-realistic 2D physics, interactive drag-and-drop alchemy, and dynamic macro telemetry suspended in zero-gravity space.
        </motion.p>

        {/* Hero Interactive Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 pointer-events-auto"
        >
          <a
            href="#blend-lab"
            data-interactive="true"
            className="px-6 py-3 sm:px-8 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm text-white transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2"
            style={{
              background: `linear-gradient(135deg, ${activeTheme?.colors?.start || '#FF007A'}, ${activeTheme?.colors?.end || '#7928CA'})`,
              boxShadow: `0 10px 40px -10px ${accentColor}`
            }}
          >
            <Sparkles className="w-4 h-4" />
            Enter Mix & Blend Lab
          </a>

          <button
            onClick={triggerShockwave}
            data-interactive="true"
            className="glass-panel px-5 py-3 sm:px-6 sm:py-3.5 rounded-full font-semibold text-xs sm:text-sm text-white/90 hover:text-white hover:border-white/30 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Trigger Kinetic Shockwave
          </button>
        </motion.div>
      </div>

      {/* Physics Floating Control Toolbar */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 w-full flex justify-between items-end mt-4 sm:mt-6 pointer-events-none">
        
        {/* Left Telemetry HUD */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-3 glass-panel px-4 py-2 rounded-2xl shadow-glass">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-mono text-slate-300">
            ENGINE: MATTER.JS (60 FPS) • BODIES: {activeBodyCount}
          </span>
        </div>

        {/* Right Physics Controls */}
        <div className="pointer-events-auto flex items-center gap-2 glass-panel p-1.5 rounded-2xl shadow-glass">
          <button
            onClick={toggleGravityMode}
            data-interactive="true"
            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-300 flex items-center gap-1.5 ${
              zeroGravity 
                ? 'bg-white/15 text-white shadow-inner' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className={`w-3.5 h-3.5 ${zeroGravity ? 'text-cyan-400' : ''}`} />
            {zeroGravity ? 'Zero-G Mode (Active)' : 'Buoyancy Mode'}
          </button>

          <button
            onClick={triggerShockwave}
            data-interactive="true"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            title="Scatter Field"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
