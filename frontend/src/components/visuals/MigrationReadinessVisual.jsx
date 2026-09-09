import React from 'react';
import { Compass, CheckCircle2, ArrowRight, ShieldCheck, Layers, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export default function MigrationReadinessVisual({ cbomReport, onNavigate }) {
  if (!cbomReport || !cbomReport.assets) return null;

  const assets = cbomReport.assets || [];
  const total = assets.length || 1;

  let legacyCount = 0;
  let hybridCount = 0;
  let pqcReadyCount = 0;
  let validatedCount = 0;

  assets.forEach(a => {
    const qv = a.quantum_vulnerability;
    const algo = (a.algorithm || '').toUpperCase();
    const phase = a.migration_phase;

    if (qv === 'QUANTUM_RESISTANT' || algo.includes('ML-') || algo.includes('SLH-') || algo.includes('FALCON')) {
      pqcReadyCount++;
    } else if (phase === 'PHASE_2_HIGH_PRIORITY' || a.hybrid_alternative) {
      hybridCount++;
    } else if (phase === 'PHASE_4_MONITOR') {
      validatedCount++;
    } else {
      legacyCount++;
    }
  });

  const stages = [
    { 
      name: 'Legacy Crypto', 
      count: legacyCount, 
      pct: Math.round((legacyCount / total) * 100), 
      color: '#EF4444', 
      badgeBg: 'bg-rose-950/80',
      badgeBorder: 'border-rose-700/60',
      badgeText: 'text-rose-300',
      label: '🔴 Shor Vulnerable',
      desc: 'RSA / ECC primitives requiring immediate transition.'
    },
    { 
      name: 'Hybrid Candidates', 
      count: hybridCount, 
      pct: Math.round((hybridCount / total) * 100), 
      color: '#A855F7', 
      badgeBg: 'bg-purple-950/80',
      badgeBorder: 'border-purple-700/60',
      badgeText: 'text-purple-300',
      label: '🟣 Dual Wrapper',
      desc: 'X25519 + ML-KEM composite encapsulation candidates.'
    },
    { 
      name: 'PQC Ready', 
      count: pqcReadyCount, 
      pct: Math.round((pqcReadyCount / total) * 100), 
      color: '#00F0FF', 
      badgeBg: 'bg-cyan-950/80',
      badgeBorder: 'border-cyan-700/60',
      badgeText: 'text-cyan-300',
      label: '🔵 FIPS 203/204',
      desc: 'Pure post-quantum NIST standardized algorithms.'
    },
    { 
      name: 'Validated Secure', 
      count: validatedCount, 
      pct: Math.round((validatedCount / total) * 100), 
      color: '#10B981', 
      badgeBg: 'bg-emerald-950/80',
      badgeBorder: 'border-emerald-700/60',
      badgeText: 'text-emerald-300',
      label: '🟢 Agility Validated',
      desc: 'KAT verified and benchmarked against SLA latency.'
    }
  ];

  return (
    <div className="p-6 rounded-2xl command-card border-cyan-500/30 space-y-5 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Portfolio Migration Progress
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Multi-Stage Cryptographic Transition Pipeline
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-700/60 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{pqcReadyCount} / {total} PQC Resilient</span>
        </span>
      </div>

      {/* Overall Progression Bar */}
      <div className="p-3.5 rounded-xl bg-[#040814] border border-[#1E2D4A] space-y-2 z-10">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">Migration Readiness Distribution</span>
          <span className="font-bold text-white">{Math.round(((total - legacyCount) / total) * 100)}% Transition Ready</span>
        </div>
        
        {/* Multi-Segment Bar */}
        <div className="w-full h-3 rounded-full bg-[#070D1E] border border-[#1E2D4A] flex overflow-hidden">
          <div 
            style={{ width: `${(legacyCount / total) * 100}%` }} 
            className="h-full bg-rose-500 transition-all duration-700 hover:opacity-80" 
            title={`Legacy: ${legacyCount} assets`}
          />
          <div 
            style={{ width: `${(hybridCount / total) * 100}%` }} 
            className="h-full bg-purple-500 transition-all duration-700 hover:opacity-80" 
            title={`Hybrid: ${hybridCount} assets`}
          />
          <div 
            style={{ width: `${(pqcReadyCount / total) * 100}%` }} 
            className="h-full bg-cyan-400 transition-all duration-700 hover:opacity-80" 
            title={`PQC Ready: ${pqcReadyCount} assets`}
          />
          <div 
            style={{ width: `${(validatedCount / total) * 100}%` }} 
            className="h-full bg-emerald-400 transition-all duration-700 hover:opacity-80" 
            title={`Validated: ${validatedCount} assets`}
          />
        </div>
      </div>

      {/* 4 Phased Progress Stage Cards */}
      <div className="grid grid-cols-2 gap-2.5 font-mono text-xs z-10">
        {stages.map((stg, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[#070D1E] border border-[#1E2D4A] hover:border-cyan-500/40 transition flex flex-col justify-between space-y-2 group"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase">{stg.name}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${stg.badgeBg} ${stg.badgeBorder} ${stg.badgeText}`}>
                  {stg.label}
                </span>
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-white font-mono">{stg.count}</span>
                <span className="text-[10px] text-slate-400">assets ({stg.pct}%)</span>
              </div>
              <p className="text-[10px] text-slate-400 font-sans leading-snug line-clamp-2 pt-0.5">
                {stg.desc}
              </p>
            </div>

            <div className="w-full h-1.5 bg-[#050A14] rounded-full overflow-hidden mt-1">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(stg.pct, 4)}%`, backgroundColor: stg.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-xs font-mono z-10">
        <span className="text-slate-400">Total Portfolio: <strong className="text-white">{total} Assets</strong></span>
        {onNavigate && (
          <button
            onClick={() => onNavigate('roadmap')}
            className="text-cyan-400 hover:text-cyan-300 hover:underline font-bold flex items-center gap-1.5 transition"
          >
            <span>Open PQC Migration Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
