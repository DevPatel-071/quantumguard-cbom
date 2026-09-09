import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2, Circle, Shield } from 'lucide-react';

export default function ScanLoadingModal({ isOpen, targetName = "Target Repository" }) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [progress, setProgress] = useState(12);

  const stages = [
    { label: "01 Crypto Discovery", detail: "Initializing 30+ classical & post-quantum AST signatures" },
    { label: "02 CBOM Generation", detail: "Extracting key sizes, curves, protocols into CycloneDX 1.6 schema" },
    { label: "03 Dependency Mapping", detail: "Tracing application to library, capability, and risk propagation" },
    { label: "04 Quantum Risk Analysis", detail: "Evaluating Shor discrete-log threats and Mosca X + Y > Z timeline" },
    { label: "05 FMEA Assessment", detail: "Computing Severity, Observable Occurrence, Detection & RPN" },
    { label: "06 PQC Recommendations", detail: "Mapping NIST FIPS 203/204/205 standards and hybrid alternatives" },
    { label: "07 Migration Planning", detail: "Assembling 4-phase transition roadmap & financial estimates" },
    { label: "08 Dashboard Update", detail: "Synthesizing executive readiness dial and telemetry feeds" }
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
    }, 550);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#080E1E] border border-cyan-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-center relative overflow-hidden animate-scaleUp command-grid shadow-cyan-glow">
        
        {/* Top Logo & Title */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-[11px] font-mono font-bold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>QUANTECT INTELLIGENCE PIPELINE</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
            Discovering Cryptographic Assets...
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Target System: <strong className="text-cyan-300">{targetName}</strong>
          </p>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2 max-w-md mx-auto font-mono">
          <div className="flex justify-between items-center text-xs">
            <span className="text-cyan-400 font-bold">{stages[currentStageIdx]?.label}</span>
            <span className="text-white font-bold">{Math.min(100, progress)}%</span>
          </div>

          <div className="w-full bg-[#050A14] rounded-full h-2 overflow-hidden border border-[#1E2D4A]">
            <div 
              className="bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 h-full rounded-full transition-all duration-300 shadow-cyan-glow"
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
        </div>

        {/* Multi-Stage Check List */}
        <div className="p-4 rounded-xl bg-[#050A14] border border-[#1E2D4A] text-left space-y-3 max-h-60 overflow-y-auto font-mono">
          {stages.map((stg, idx) => {
            const isCompleted = idx < currentStageIdx;
            const isCurrent = idx === currentStageIdx;

            return (
              <div 
                key={idx} 
                className={`flex items-start gap-3 text-xs transition-opacity duration-200 ${
                  isCurrent ? 'opacity-100' : isCompleted ? 'opacity-90' : 'opacity-30'
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
                  <div className={`font-bold ${isCurrent ? 'text-cyan-400' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                    {stg.label}
                  </div>
                  {isCurrent && (
                    <div className="text-[10px] text-slate-400 font-sans">
                      {stg.detail}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guarantee */}
        <div className="text-[11px] text-slate-400 font-mono">
          Prepare Today, Secure Tomorrow &bull; NIST FIPS 203 / 204 / 205
        </div>

      </div>
    </div>
  );
}
