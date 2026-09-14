import React, { useState } from 'react';
import { FLAVOR_PROFILES } from './data/flavors';
import BackgroundMesh from './components/BackgroundMesh';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HeroCanvas from './components/HeroCanvas';
import BlendLab from './components/BlendLab';
import FlavorGallery from './components/FlavorGallery';
import Footer from './components/Footer';

export default function App() {
  const [activeTheme, setActiveTheme] = useState(FLAVOR_PROFILES[0]);

  return (
    <div className="relative min-h-screen bg-[#08080C] text-slate-100 selection:bg-pink-500 selection:text-white">
      {/* Dynamic Radial Ambient Mesh & Noise Overlay */}
      <BackgroundMesh activeTheme={activeTheme} />

      {/* Dual-Ring Trailing Custom Cursor */}
      <CustomCursor activeTheme={activeTheme} />

      {/* Floating Frosted Glass Navbar */}
      <Navbar activeTheme={activeTheme} />

      {/* Main Content Sections */}
      <main className="relative z-10 flex flex-col items-center">
        {/* Section 1: Hero Physics Canvas (Matter.js) */}
        <HeroCanvas activeTheme={activeTheme} onSelectTheme={setActiveTheme} />

        {/* Section 2: Mix & Blend Lab (SVG Liquid Wave + Telemetry) */}
        <BlendLab activeTheme={activeTheme} onThemeChange={setActiveTheme} />

        {/* Section 3: 3D Gyroscope Card Gallery */}
        <FlavorGallery activeTheme={activeTheme} onSelectTheme={setActiveTheme} />
      </main>

      {/* Footer */}
      <Footer activeTheme={activeTheme} />
    </div>
  );
}
