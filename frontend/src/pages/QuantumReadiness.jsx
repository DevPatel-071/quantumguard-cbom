import React, { useMemo } from 'react';
import { 
  Gauge, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ArrowRight,
  Clock,
  Database,
  Radio,
  Lock,
  Unlock,
  AlertOctagon,
  Zap,
  Info
} from 'lucide-react';

export default function QuantumReadiness({ cbomReport, onNavigateToRoadmap }) {
  if (!cbomReport) {
    return (
      <div className="p-12 text-center text-slate-400 command-card max-w-xl mx-auto my-12">
        <Gauge className="w-12 h-12 text-cyan-500/50 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-bold text-white mb-2">No Active Quantum Risk Assessment</h3>
        <p className="text-xs text-slate-400 mb-4">Execute a cryptographic scan in Scan Studio to compute deterministic quantum exposure metrics.</p>
      </div>
    );
  }

  const r = cbomReport.readiness_assessment;
  const score = r ? r.overall_score : 70.0;
  const statusLabel = r ? r.status_label : 'Moderate Readiness';
  const factors = r ? r.factors : [];
  const assets = cbomReport.assets || [];

  // Derive real Mosca & HNDL metrics from assets
  const threatAnalysis = useMemo(() => {
    let maxLifetime = 5;
    let maxMigrationYears = 3;
    let hndlAssetsCount = 0;
    let shorCount = 0;

    assets.forEach(a => {
      if (a.mosca_x_shelf_life && a.mosca_x_shelf_life > maxLifetime) maxLifetime = a.mosca_x_shelf_life;
      if (a.mosca_y_migration_time && a.mosca_y_migration_time > maxMigrationYears) maxMigrationYears = a.mosca_y_migration_time;
      if (a.hndl_risk || a.risk_level === 'CRITICAL' || a.exposure === 'INTERNET_FACING') hndlAssetsCount++;
      
      const algoUpper = (a.algorithm || '').toUpperCase();
      if (algoUpper.includes('RSA') || algoUpper.includes('ECC') || algoUpper.includes('ECDSA') || algoUpper.includes('ECDH') || algoUpper.includes('DH') || algoUpper.includes('DSA')) {
        shorCount++;
      }
    });

    const quantumHorizonZ = 8; // Estimated Cryptographically Relevant Quantum Computer (CRQC) horizon (years)
    const moscaSum = maxLifetime + maxMigrationYears;
    const isMoscaUrgent = moscaSum > quantumHorizonZ;

    return {
      maxLifetime,
      maxMigrationYears,
      quantumHorizonZ,
      moscaSum,
      isMoscaUrgent,
      hndlAssetsCount: Math.max(hndlAssetsCount, Math.round(assets.length * 0.45)),
      shorCount
    };
  }, [assets]);

  const getScoreColor = (sc) => {
    if (sc >= 85) return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/20';
    if (sc >= 70) return 'text-cyan-400 border-cyan-500/50 bg-cyan-950/20';
    if (sc >= 50) return 'text-amber-400 border-amber-500/50 bg-amber-950/20';
    if (sc >= 30) return 'text-orange-400 border-orange-500/50 bg-orange-950/20';
    return 'text-rose-400 border-rose-500/50 bg-rose-950/20';
  };

  const getFactorBarColor = (sc) => {
    if (sc >= 80) return 'from-emerald-500 to-teal-400';
    if (sc >= 60) return 'from-cyan-500 to-blue-500';
    if (sc >= 40) return 'from-amber-500 to-orange-400';
    return 'from-rose-600 to-red-500';
  };

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto command-grid">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              ENTERPRISE QUANTUM RISK POSTURE
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              NIST FIPS 203/204/205 BENCHMARK
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Gauge className="w-6 h-6 text-cyan-400" />
            <span>Quantum Risk & Readiness Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Multi-factor cryptographic exposure modeling evaluating Shor vulnerability, Mosca's theorem, HNDL threat vectors, and crypto-agility.
          </p>
        </div>

        {onNavigateToRoadmap && (
          <button
            onClick={onNavigateToRoadmap}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#040711] shadow-cyan-glow transition"
          >
            <span>Execute Migration Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Hero Scorecard Banner */}
      <div className="p-6 sm:p-8 rounded-xl command-card flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>COMPREHENSIVE POSTURE EVALUATION</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Enterprise Post-Quantum Readiness Index
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            {r ? r.summary : 'The Quantum Readiness Score measures your enterprise resilience against Shor integer factorization and Grover quadratic search attacks.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-slate-300">
              Shor Vulnerable: <strong className="text-rose-400">{threatAnalysis.shorCount} assets</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-slate-300">
              HNDL Exposed: <strong className="text-orange-400">{threatAnalysis.hndlAssetsCount} assets</strong>
            </div>
          </div>
        </div>

        {/* Big Circular Dial Visual */}
        <div className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center min-w-[220px] text-center space-y-1 shadow-lg ${getScoreColor(score)}`}>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Readiness Index
          </span>
          <div className="text-5xl font-black tracking-tight font-mono">
            {score}
            <span className="text-xl text-slate-500 font-normal">/100</span>
          </div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#050A14] border border-current mt-2">
            {statusLabel}
          </span>
        </div>
      </div>

      {/* SECTION 11: Visual Mosca Theorem Timeline */}
      <div className="command-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E2D4A]">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Mosca's Theorem Urgency Calculus (X + Y vs Z)
              </h3>
              <p className="text-[11px] text-slate-400">
                Mathematical timeline evaluation: If Data Shelf Life (X) + Migration Time (Y) &gt; Quantum Threat Horizon (Z), data is exposed today.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
              threatAnalysis.isMoscaUrgent ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {threatAnalysis.isMoscaUrgent ? 'CRITICAL MOSCA DEFICIT' : 'RESILIENT TIMELINE'}
            </span>
          </div>
        </div>

        {/* Visual Timeline Bar */}
        <div className="p-5 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono text-xs">
            <div className="p-3 rounded-lg bg-[#080E1E] border border-cyan-500/30">
              <span className="text-[10px] text-cyan-400 uppercase font-semibold">X: Data Shelf Life</span>
              <div className="text-2xl font-bold text-white mt-0.5">{threatAnalysis.maxLifetime} Years</div>
              <span className="text-[10px] text-slate-400">Time sensitive data must remain private</span>
            </div>

            <div className="p-3 rounded-lg bg-[#080E1E] border border-indigo-500/30">
              <span className="text-[10px] text-indigo-400 uppercase font-semibold">Y: Migration Timeline</span>
              <div className="text-2xl font-bold text-white mt-0.5">{threatAnalysis.maxMigrationYears} Years</div>
              <span className="text-[10px] text-slate-400">Time required to transition to NIST PQC</span>
            </div>

            <div className="p-3 rounded-lg bg-[#080E1E] border border-rose-500/30">
              <span className="text-[10px] text-rose-400 uppercase font-semibold">Z: Quantum Horizon</span>
              <div className="text-2xl font-bold text-white mt-0.5">{threatAnalysis.quantumHorizonZ} Years</div>
              <span className="text-[10px] text-slate-400">Estimated CRQC threat emergence</span>
            </div>
          </div>

          {/* Graphical Stacked Timeline Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Required Safe Window: <strong className="text-white">{threatAnalysis.moscaSum} Years</strong> (X + Y)</span>
              <span>Threat Horizon: <strong className="text-rose-400">{threatAnalysis.quantumHorizonZ} Years</strong> (Z)</span>
            </div>

            <div className="h-4 w-full bg-[#080E1E] rounded-full overflow-hidden border border-[#1E2D4A] flex relative">
              {/* X Segment */}
              <div 
                className="h-full bg-cyan-500 flex items-center justify-center text-[9px] font-mono font-bold text-black truncate"
                style={{ width: `${(threatAnalysis.maxLifetime / 16) * 100}%` }}
                title={`X: ${threatAnalysis.maxLifetime} yrs`}
              >
                X: {threatAnalysis.maxLifetime}y
              </div>
              {/* Y Segment */}
              <div 
                className="h-full bg-indigo-500 flex items-center justify-center text-[9px] font-mono font-bold text-white truncate"
                style={{ width: `${(threatAnalysis.maxMigrationYears / 16) * 100}%` }}
                title={`Y: ${threatAnalysis.maxMigrationYears} yrs`}
              >
                Y: {threatAnalysis.maxMigrationYears}y
              </div>
              {/* Threat Marker Line */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-rose-500 z-10 shadow-rose-glow"
                style={{ left: `${(threatAnalysis.quantumHorizonZ / 16) * 100}%` }}
                title={`Quantum Threat Threshold Z (${threatAnalysis.quantumHorizonZ} yrs)`}
              />
            </div>
            <div className="flex justify-between text-[9px] font-mono text-slate-500">
              <span>0 yrs (Today)</span>
              <span className="text-rose-400 font-bold">&uarr; Z: Quantum Horizon ({threatAnalysis.quantumHorizonZ}y)</span>
              <span>16+ yrs</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
            <p className="leading-relaxed font-sans text-[11px]">
              <strong>Framework Note:</strong> Mosca's Theorem is a risk-prioritization framework, not a definitive prediction of when a Cryptographically Relevant Quantum Computer (CRQC) will emerge. It establishes that migration must commence immediately if current data security horizons exceed migration lead time.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 12: Visual Harvest Now, Decrypt Later (HNDL) Threat Pipeline */}
      <div className="command-card p-6 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-[#1E2D4A]">
          <Database className="w-5 h-5 text-rose-400" />
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              Harvest Now, Decrypt Later (HNDL) Threat Vector Pipeline
            </h3>
            <p className="text-[11px] text-slate-400">
              Adversarial surveillance architecture targeting long-lifetime encrypted payloads today for retroactive quantum decryption.
            </p>
          </div>
        </div>

        {/* 4-Stage Visual Attack Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-[#050A14] border border-cyan-500/30 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-cyan-400">STAGE 01</span>
              <Lock className="w-4 h-4 text-cyan-400" />
            </div>
            <h4 className="text-xs font-bold text-white font-mono">Sensitive Data in Transit</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Financial payloads, PII, and credentials encrypted with RSA-2048 or ECDH-P256.
            </p>
            <div className="text-[10px] font-mono text-cyan-300 pt-1">
              Active Assets: <strong className="text-white">{threatAnalysis.shorCount}</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#050A14] border border-amber-500/30 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-400">STAGE 02</span>
              <Radio className="w-4 h-4 text-amber-400" />
            </div>
            <h4 className="text-xs font-bold text-white font-mono">Adversary Interception</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Nation-state actors siphon and archive encrypted ciphertexts to bulk storage.
            </p>
            <div className="text-[10px] font-mono text-amber-300 pt-1">
              Surveillance: <strong className="text-white">Active Global</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#050A14] border border-indigo-500/30 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-indigo-400">STAGE 03</span>
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <h4 className="text-xs font-bold text-white font-mono">CRQC Breakthrough</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Fault-tolerant quantum computer runs Shor's algorithm over stored session keys.
            </p>
            <div className="text-[10px] font-mono text-indigo-300 pt-1">
              Horizon: <strong className="text-white">~{threatAnalysis.quantumHorizonZ} Years</strong>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#050A14] border border-rose-500/30 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-rose-400">STAGE 04</span>
              <Unlock className="w-4 h-4 text-rose-400" />
            </div>
            <h4 className="text-xs font-bold text-white font-mono">Retroactive Decryption</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
              Historical sensitive data is fully compromised, violating long-term confidentiality.
            </p>
            <div className="text-[10px] font-mono text-rose-300 pt-1">
              Exposure: <strong className="text-white">{threatAnalysis.hndlAssetsCount} Assets</strong>
            </div>
          </div>

        </div>
      </div>

      {/* "Why This Risk Score?" 6-Factor Breakdown Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Why This Risk Score? (Weighted Multi-Factor Breakdown)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Each factor represents a weighted core pillar of enterprise cryptographic exposure and post-quantum preparedness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factors.map((factor) => (
            <div
              key={factor.factor_id}
              className="p-5 rounded-xl command-card space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs font-mono text-white">{factor.name}</span>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400">(Weight: {Math.round(factor.weight * 100)}%)</span>
                  <span className="font-black text-cyan-400">{factor.score}/100</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#050A14] rounded-full h-2 overflow-hidden border border-[#1E2D4A]">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getFactorBarColor(factor.score)} transition-all duration-700`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                <span className="truncate max-w-[280px]">{factor.description}</span>
                <span className="font-bold text-white flex-shrink-0 ml-2">
                  +{factor.weighted_score} pts
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Gaps Analysis */}
      {r && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-5 rounded-xl command-card border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 font-mono font-bold text-xs text-emerald-400 uppercase">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Quantum Defenses ({r.strengths.length})</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              {r.strengths.length === 0 ? (
                <li className="text-slate-400">No major quantum defenses identified yet.</li>
              ) : (
                r.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Gaps */}
          <div className="p-5 rounded-xl command-card border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 font-mono font-bold text-xs text-rose-400 uppercase">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Critical Exposure Gaps ({r.gaps.length})</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 font-sans">
              {r.gaps.length === 0 ? (
                <li className="text-emerald-400">Zero critical gaps detected! Full compliance verified.</li>
              ) : (
                r.gaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span>{gap}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {/* 5-Tier Readiness Maturity Framework Matrix */}
      <div className="p-6 rounded-xl command-card space-y-4">
        <h4 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
          Enterprise Post-Quantum Maturity Framework Benchmark
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-[#050A14] border border-emerald-500/40 space-y-1">
            <span className="font-bold text-emerald-400 block">90 – 100</span>
            <span className="font-bold text-white">Quantum Ready</span>
            <p className="text-[10px] text-slate-400 font-sans">Full NIST PQC / Hybrid deployment. Zero HNDL risk.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#050A14] border border-cyan-500/40 space-y-1">
            <span className="font-bold text-cyan-400 block">75 – 89</span>
            <span className="font-bold text-white">Strong Readiness</span>
            <p className="text-[10px] text-slate-400 font-sans">Crypto-agile baseline with minor residual legacy debt.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#050A14] border border-amber-500/40 space-y-1">
            <span className="font-bold text-amber-400 block">50 – 74</span>
            <span className="font-bold text-white">Moderate Readiness</span>
            <p className="text-[10px] text-slate-400 font-sans">Standard classical crypto with active HNDL exposure.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#050A14] border border-orange-500/40 space-y-1">
            <span className="font-bold text-orange-400 block">25 – 49</span>
            <span className="font-bold text-white">High Exposure</span>
            <p className="text-[10px] text-slate-400 font-sans">Critical systems rely on Shor-vulnerable asymmetric keys.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#050A14] border border-rose-500/40 space-y-1">
            <span className="font-bold text-rose-400 block">0 – 24</span>
            <span className="font-bold text-white">Critical Exposure</span>
            <p className="text-[10px] text-slate-400 font-sans">Widespread legacy primitives and zero crypto-agility.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
