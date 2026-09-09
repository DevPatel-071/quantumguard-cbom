import React from 'react';
import { Compass, CheckCircle2, ArrowRight, ShieldCheck, Layers, Sparkles } from 'lucide-react';

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
    { name: 'Legacy Crypto', count: legacyCount, pct: Math.round((legacyCount / total) * 100), color: '#EF4444', label: '🔴 Shor Vulnerable' },
    { name: 'Hybrid Candidates', count: hybridCount, pct: Math.round((hybridCount / total) * 100), color: '#A855F7', label: '🟣 Dual Wrapper' },
    { name: 'PQC Ready', count: pqcReadyCount, pct: Math.round((pqcReadyCount / total) * 100), color: '#00F0FF', label: '🔵 FIPS 203/204' },
    { name: 'Validated Secure', count: validatedCount, pct: Math.round((validatedCount / total) * 100), color: '#10B981', label: '🟢 Quantum Agility' }
  ];

  return (
    <div className="p-6 rounded-2xl command-card border-cyan-500/30 space-y-4 flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Portfolio Migration Progress
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded">
          {pqcReadyCount} / {total} PQC Resilient
        </span>
      </div>

      {/* 4 Phased Progress Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
        {stages.map((stg, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-[#070D1E] border border-[#1E2D4A] flex flex-col justify-between space-y-2"
          >
            <div>
              <span className="text-[10px] text-slate-400 block">{stg.name}</span>
              <div className="text-lg font-black text-white mt-0.5">{stg.count} Assets</div>
              <span className="text-[9px] font-bold block" style={{ color: stg.color }}>
                {stg.label}
              </span>
            </div>

            <div className="w-full h-1.5 bg-[#050A14] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(stg.pct, 4)}%`, backgroundColor: stg.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400">Total Pipeline: <strong className="text-white">{total} Assets</strong></span>
        {onNavigate && (
          <button
            onClick={() => onNavigate('roadmap')}
            className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Open PQC Migration Journey</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
