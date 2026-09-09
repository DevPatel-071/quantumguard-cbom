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
      name: 'Legacy Cryptography', 
      phaseTag: 'Phase 1 Action',
      count: legacyCount, 
      pct: Math.round((legacyCount / total) * 100), 
      color: '#EF4444', 
      badgeBg: 'bg-rose-950/90',
      badgeBorder: 'border-rose-700/60',
      badgeText: 'text-rose-300',
      label: '🔴 Shor Vulnerable (RSA / ECC)',
      desc: 'Classical asymmetric primitives broken by polynomial quantum prime factorization.'
    },
    { 
      name: 'Hybrid Candidates', 
      phaseTag: 'Phase 2 Pilot',
      count: hybridCount, 
      pct: Math.round((hybridCount / total) * 100), 
      color: '#A855F7', 
      badgeBg: 'bg-purple-950/90',
      badgeBorder: 'border-purple-700/60',
      badgeText: 'text-purple-300',
      label: '🟣 Dual Classical + PQC Wrapper',
      desc: 'Composite X.509 certs & hybrid KEMs maintaining FIPS compliance & backwards compat.'
    },
    { 
      name: 'PQC Standardized', 
      phaseTag: 'Phase 3 Target',
      count: pqcReadyCount, 
      pct: Math.round((pqcReadyCount / total) * 100), 
      color: '#00F0FF', 
      badgeBg: 'bg-cyan-950/90',
      badgeBorder: 'border-cyan-700/60',
      badgeText: 'text-cyan-300',
      label: '🔵 NIST FIPS 203/204 Standards',
      desc: 'Standardized ML-KEM-768 key encapsulation & ML-DSA-65 digital signatures.'
    },
    { 
      name: 'Validated Secure', 
      phaseTag: 'Phase 4 Assurance',
      count: validatedCount, 
      pct: Math.round((validatedCount / total) * 100), 
      color: '#10B981', 
      badgeBg: 'bg-emerald-950/90',
      badgeBorder: 'border-emerald-700/60',
      badgeText: 'text-emerald-300',
      label: '🟢 Agility & KAT Validated',
      desc: 'Known-Answer-Tests verified with latency SLA and continuous drift monitoring.'
    }
  ];

  return (
    <div className="p-6 sm:p-7 rounded-2xl command-card border-cyan-500/30 space-y-6 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2D4A] pb-4 z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 shadow-cyan-glow flex-shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              Portfolio Migration Roadmap &amp; Readiness
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Multi-Stage Cryptographic Transition Pipeline &amp; NIST PQC Standardization
            </p>
          </div>
        </div>

        <div className="flex-shrink-0">
          <span className="text-xs font-mono text-emerald-300 font-bold bg-emerald-950/90 border border-emerald-700/60 px-3 py-1 rounded-full flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>PQC Ready: {pqcReadyCount} / {total} Assets ({Math.round((pqcReadyCount / total) * 100)}%)</span>
          </span>
        </div>
      </div>

      {/* Overall Progression Bar */}
      <div className="p-4 rounded-xl bg-[#040814] border border-[#1E2D4A] space-y-2.5 z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
          <span className="text-slate-300 font-bold">Aggregate Cryptographic Migration Distribution</span>
          <span className="text-cyan-400 font-bold">
            {Math.round(((total - legacyCount) / total) * 100)}% Transition Completed or In-Flight
          </span>
        </div>
        
        {/* Multi-Segment Bar */}
        <div className="w-full h-3.5 rounded-full bg-[#070D1E] border border-[#1E2D4A] flex overflow-hidden">
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

        {/* Legend Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Legacy: {legacyCount} ({Math.round((legacyCount/total)*100)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span>Hybrid: {hybridCount} ({Math.round((hybridCount/total)*100)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>PQC Ready: {pqcReadyCount} ({Math.round((pqcReadyCount/total)*100)}%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Validated: {validatedCount} ({Math.round((validatedCount/total)*100)}%)</span>
          </div>
        </div>
      </div>

      {/* 4 Phased Progress Stage Cards with Zero Horizontal Collisions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 z-10 font-mono">
        {stages.map((stg, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#070D1E] border border-[#1E2D4A] hover:border-cyan-500/40 transition flex flex-col justify-between space-y-3 group"
          >
            {/* Top Row: Phase Tag & Percentage */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400 uppercase font-bold tracking-wider">{stg.phaseTag}</span>
                <span className="text-slate-300 font-bold">{stg.pct}% of Portfolio</span>
              </div>

              {/* Asset Count & Stage Name */}
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="text-2xl font-black text-white font-mono" style={{ color: stg.color }}>
                  {stg.count}
                </span>
                <span className="text-xs text-slate-300 font-bold uppercase tracking-wide">
                  {stg.name}
                </span>
              </div>

              {/* Status Badge (Dedicated Row to prevent overlap) */}
              <div className="pt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block ${stg.badgeBg} ${stg.badgeBorder} ${stg.badgeText}`}>
                  {stg.label}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed pt-1">
                {stg.desc}
              </p>
            </div>

            {/* Individual Progress Track */}
            <div className="w-full h-1.5 bg-[#050A14] rounded-full overflow-hidden mt-2">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.max(stg.pct, 5)}%`, backgroundColor: stg.color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#1E2D4A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono z-10">
        <span className="text-slate-400">
          Total Cryptographic Inventory: <strong className="text-white">{total} Discovered Assets</strong>
        </span>

        {onNavigate && (
          <button
            onClick={() => onNavigate('roadmap')}
            className="text-cyan-400 hover:text-cyan-300 hover:underline font-bold flex items-center gap-1.5 transition self-end sm:self-auto"
          >
            <span>Open Interactive PQC Migration Roadmap &amp; Playbook</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
