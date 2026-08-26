import React from 'react';
import { 
  Gauge, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  HelpCircle, 
  TrendingUp, 
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function QuantumReadiness({ cbomReport, onNavigateToRoadmap }) {
  if (!cbomReport) {
    return (
      <div className="p-8 text-center text-slate-400">
        No active inventory available. Please run a cryptographic discovery scan.
      </div>
    );
  }

  const r = cbomReport.readiness_assessment;
  const score = r ? r.overall_score : 70.0;
  const statusLabel = r ? r.status_label : 'Moderate Readiness';
  const factors = r ? r.factors : [];

  const getScoreColor = (sc) => {
    if (sc >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (sc >= 75) return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
    if (sc >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    if (sc >= 25) return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getFactorBarColor = (sc) => {
    if (sc >= 80) return 'bg-emerald-500';
    if (sc >= 60) return 'bg-sky-500';
    if (sc >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <Gauge className="w-6 h-6 text-sky-400" />
            <span>Organization Quantum Readiness Assessment</span>
          </h1>
          <p className="text-xs text-slate-400">
            Transparent, multi-factor scoring methodology (0–100) evaluating cryptographic coverage, PQC adoption, critical risk resolution, and HNDL immunity.
          </p>
        </div>

        {onNavigateToRoadmap && (
          <button
            onClick={onNavigateToRoadmap}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 transition"
          >
            <span>View Remediation Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Scorecard Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-950 border border-slate-800 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>EXECUTIVE POSTURE METRIC</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            Overall Post-Quantum Readiness
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed">
            {r ? r.summary : 'The Quantum Readiness Score measures your enterprise posture against Shor and Grover quantum attacks.'}
          </p>
        </div>

        {/* Score Dial */}
        <div className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center min-w-[200px] text-center space-y-1 ${getScoreColor(score)}`}>
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Readiness Score
          </span>
          <div className="text-5xl font-black tracking-tight font-mono">
            {score}
            <span className="text-xl text-slate-500 font-normal">/100</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-950 border border-current mt-1">
            {statusLabel}
          </span>
        </div>

      </div>

      {/* 6-Factor Breakdown Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Documented Scoring Methodology & Factor Breakdown</span>
            </h3>
            <p className="text-xs text-slate-400">
              Each factor represents a weighted core pillar of enterprise cryptographic security and post-quantum preparedness.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factors.map((factor) => (
            <div
              key={factor.factor_id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-200">{factor.name}</span>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-400 font-normal">(Weight: {int(factor.weight * 100)}%)</span>
                  <span className="font-black text-slate-100">{factor.score}/100</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getFactorBarColor(factor.score)}`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>{factor.description}</span>
                <span className="font-mono font-bold text-slate-300 flex-shrink-0 ml-2">
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
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Strengths & Defenses ({r.strengths.length})</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {r.strengths.length === 0 ? (
                <li className="text-slate-500">No major quantum defenses identified yet.</li>
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
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Critical Quantum Exposure Gaps ({r.gaps.length})</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {r.gaps.length === 0 ? (
                <li className="text-emerald-400">Zero critical gaps! Full compliance verified.</li>
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
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <h4 className="font-bold text-sm text-slate-200">
          Enterprise Post-Quantum Maturity Classification Framework
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-mono font-bold text-emerald-400 block">90 – 100</span>
            <span className="font-bold text-slate-200">Quantum Ready</span>
            <p className="text-[11px] text-slate-400">Full NIST PQC / Hybrid deployment. Zero HNDL risk.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-mono font-bold text-sky-400 block">75 – 89</span>
            <span className="font-bold text-slate-200">Strong Readiness</span>
            <p className="text-[11px] text-slate-400">Crypto-agile baseline with minor residual legacy debt.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-mono font-bold text-amber-400 block">50 – 74</span>
            <span className="font-bold text-slate-200">Moderate Readiness</span>
            <p className="text-[11px] text-slate-400">Standard classical crypto with active HNDL exposure.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-mono font-bold text-orange-400 block">25 – 49</span>
            <span className="font-bold text-slate-200">High Exposure</span>
            <p className="text-[11px] text-slate-400">Critical systems rely on Shor-vulnerable asymmetric keys.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="font-mono font-bold text-rose-400 block">0 – 24</span>
            <span className="font-bold text-slate-200">Critical Exposure</span>
            <p className="text-[11px] text-slate-400">Widespread legacy primitives and zero crypto-agility.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

function int(val) {
  return Math.round(val);
}
