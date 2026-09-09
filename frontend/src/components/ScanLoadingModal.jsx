import React, { useEffect, useState } from 'react';
import { Shield, Sparkles, CheckCircle2, Loader2, Circle, Layers, Cpu, Compass } from 'lucide-react';

export default function ScanLoadingModal({ isOpen, targetName = "Target Repository" }) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [progress, setProgress] = useState(12);

  const stages = [
    { label: "Crypto Knowledge Base & Heuristics", detail: "Initializing 30+ classical & post-quantum algorithm signatures" },
    { label: "AST & Source Code Discovery", detail: "Inspecting abstract syntax trees across C++, Python, Java, Go & Rust" },
    { label: "CycloneDX 1.6 CBOM Generation", detail: "Extracting key sizes, curves, modes, protocols and evidence" },
    { label: "Dependency Intelligence Mapping", detail: "Tracing application to library, capability, and risk propagation" },
    { label: "Quantum Risk & Mosca HNDL Analysis", detail: "Evaluating Shor discrete-log threats and X + Y > Z timeline" },
    { label: "Quantum FMEA Assessment", detail: "Computing Severity, Observable Occurrence, Detection & RPN" },
    { label: "PQC & Hybrid Recommendations", detail: "Mapping NIST FIPS 203/204/205 standards and hybrid alternatives" },
    { label: "Command Center Synthesis", detail: "Assembling 4-phase roadmap, cost budget and readiness index" }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIdx(0);
      setProgress(12);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
      setProgress((prev) => {
        if (prev < 95) {
          return prev + Math.floor(Math.random() * 12) + 8;
        }
        return 98;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#090E1A] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-950/40 text-center relative overflow-hidden animate-scaleUp">
        
        {/* Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo & Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[10px] font-mono font-bold text-cyan-300">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>QUANTECT INTELLIGENCE PIPELINE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            Loading Cryptographic Intelligence...
          </h2>
          <p className="text-xs text-slate-400">
            Target System: <strong className="text-slate-200 font-mono">{targetName}</strong>
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2 max-w-md mx-auto">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-cyan-400 font-bold">{stages[currentStageIdx]?.label}</span>
            <span className="text-slate-300 font-bold">{Math.min(100, progress)}%</span>
          </div>

          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 h-full rounded-full transition-all duration-300 shadow-sm shadow-cyan-400"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

        {/* Multi-Stage Check List */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-left space-y-2.5 max-h-56 overflow-y-auto">
          {stages.map((stg, idx) => {
            const isCompleted = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;

            return (
              <div 
                key={idx} 
                className={`flex items-start gap-3 text-xs transition-opacity duration-300 ${
                  isCurrent ? 'opacity-100' : isCompleted ? 'opacity-70' : 'opacity-30'
                }`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-600" />
                  )}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className={`font-semibold ${isCurrent ? 'text-cyan-300' : isCompleted ? 'text-slate-200' : 'text-slate-400'}`}>
                    {stg.label}
                  </div>
                  {isCurrent && (
                    <div className="text-[11px] text-slate-400 font-mono">
                      {stg.detail}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="text-[10px] text-slate-500 font-mono">
          PREPARE TODAY, SECURE TOMORROW &bull; NIST FIPS 203 / 204 / 205
        </div>

      </div>
    </div>
  );
}
