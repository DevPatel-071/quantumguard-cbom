import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, Cpu, Lock, Network, CheckCircle2 } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(15);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(45), 400);
    const timer2 = setTimeout(() => setProgress(82), 1000);
    const timer3 = setTimeout(() => setProgress(100), 1600);
    const timer4 = setTimeout(() => setFading(true), 1900);
    const timer5 = setTimeout(() => onFinish(), 2300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-50 bg-[#060913] text-white flex flex-col justify-between p-6 sm:p-12 transition-opacity duration-500 select-none overflow-hidden ${
      fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
    }`}>
      
      {/* Background Ambient Glows & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(2,132,199,0.18),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0e172a10_1px,transparent_1px),linear-gradient(to_bottom,#0e172a10_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between z-10 text-[10px] font-mono tracking-widest text-slate-400 uppercase">
        <div className="space-y-0.5">
          <div className="text-slate-300 font-bold">QUANTUM READY</div>
          <div className="text-slate-500">SECURE INFRASTRUCTURE</div>
        </div>

        <div className="text-right space-y-0.5 hidden sm:block">
          <div className="text-cyan-400 font-bold">DISCOVER &bull; ANALYZE &bull; MIGRATE</div>
          <div className="text-slate-500">NIST FIPS 203 / 204 / 205</div>
        </div>
      </div>

      {/* Center Core: Q Emblem & Branding */}
      <div className="flex flex-col items-center justify-center text-center space-y-6 z-10 my-auto">
        
        {/* Animated Q Emblem */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
          {/* Pulsing Quantum Orbit Rings */}
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-30" />
          <div className="absolute -inset-3 rounded-full border border-sky-500/30 animate-pulse" />
          <div className="absolute -inset-6 rounded-full border border-indigo-500/15" />
          
          {/* Main Q Glyph Container */}
          <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-[#0B1528] via-[#0D1F3C] to-[#13305A] border border-cyan-500/40 p-1 shadow-2xl shadow-cyan-500/20 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-20 h-20 fill-none">
              {/* Outer Ring */}
              <circle 
                cx="50" 
                cy="50" 
                r="36" 
                stroke="url(#qGradient)" 
                strokeWidth="11" 
                strokeLinecap="round" 
              />
              {/* Inner Cut / Stylized Q Tail */}
              <path 
                d="M56 56 L76 76" 
                stroke="url(#qTailGradient)" 
                strokeWidth="12" 
                strokeLinecap="round" 
              />
              {/* Quantum Core Node */}
              <circle cx="50" cy="50" r="10" fill="#00E5FF" className="animate-pulse" />
              
              <defs>
                <linearGradient id="qGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="50%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
                <linearGradient id="qTailGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" />
                  <stop offset="100%" stopColor="#38BDF8" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-1 font-sans">
            <span>QUAN</span>
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">TECT</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-300 tracking-wide">
            Quantum Cryptographic Readiness Platform
          </p>
          <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-mono font-bold text-cyan-300 tracking-widest mt-1">
            PREPARE TODAY, SECURE TOMORROW.
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="w-64 sm:w-80 space-y-2 pt-2">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>Initializing QUANTECT...</span>
            </span>
            <span className="font-bold text-slate-300">{progress}%</span>
          </div>

          <div className="w-full bg-slate-900/90 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 h-full rounded-full transition-all duration-300 shadow-sm shadow-cyan-400"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

      </div>

      {/* Bottom Pillars */}
      <div className="z-10 border-t border-slate-800/80 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-[11px]">
          <div className="flex items-center justify-center gap-2 text-slate-400 py-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>Discover Risks Early</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400 py-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <span>Enable Safer Transition</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400 py-1">
            <Cpu className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
            <span>Build Resilient Systems</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-slate-400 py-1">
            <Network className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>For a Secure Digital Future</span>
          </div>
        </div>
      </div>

    </div>
  );
}
