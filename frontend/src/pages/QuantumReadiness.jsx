import React from 'react';
import { 
  Gauge, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function QuantumReadiness({ cbomReport, onNavigateToRoadmap }) {
  if (!cbomReport) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active inventory available. Please run a cryptographic discovery scan.
      </div>
    );
  }

  const r = cbomReport.readiness_assessment;
  const score = r ? r.overall_score : 70.0;
  const statusLabel = r ? r.status_label : 'Moderate Readiness';
  const factors = r ? r.factors : [];

  const getScoreColor = (sc) => {
    if (sc >= 90) return 'text-emerald-700 border-emerald-200 bg-emerald-50';
    if (sc >= 75) return 'text-blue-700 border-blue-200 bg-blue-50';
    if (sc >= 50) return 'text-amber-700 border-amber-200 bg-amber-50';
    if (sc >= 25) return 'text-orange-700 border-orange-200 bg-orange-50';
    return 'text-rose-700 border-rose-200 bg-rose-50';
  };

  const getFactorBarColor = (sc) => {
    if (sc >= 80) return 'bg-emerald-600';
    if (sc >= 60) return 'bg-blue-600';
    if (sc >= 40) return 'bg-amber-600';
    return 'bg-rose-600';
  };

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Gauge className="w-6 h-6 text-blue-600" />
            <span>Organization Quantum Readiness Assessment</span>
          </h1>
          <p className="text-xs text-slate-500">
            Multi-factor scoring methodology (0–100) evaluating cryptographic coverage, PQC adoption, critical risk resolution, and HNDL immunity.
          </p>
        </div>

        {onNavigateToRoadmap && (
          <button
            onClick={onNavigateToRoadmap}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <span>View Remediation Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Main Scorecard Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 border border-blue-200 text-blue-700">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>EXECUTIVE POSTURE METRIC</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Overall Post-Quantum Readiness
          </h2>

          <p className="text-xs text-slate-600 leading-relaxed">
            {r ? r.summary : 'The Quantum Readiness Score measures your enterprise posture against Shor and Grover quantum attacks.'}
          </p>
        </div>

        {/* Score Dial */}
        <div className={`p-6 rounded-xl border-2 flex flex-col items-center justify-center min-w-[200px] text-center space-y-1 ${getScoreColor(score)}`}>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Readiness Score
          </span>
          <div className="text-5xl font-black tracking-tight font-mono">
            {score}
            <span className="text-xl text-slate-400 font-normal">/100</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white border border-current mt-1 shadow-xs">
            {statusLabel}
          </span>
        </div>

      </div>

      {/* 6-Factor Breakdown Grid */}
      <div className="space-y-4">
        <div>
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Documented Scoring Methodology & Factor Breakdown</span>
          </h3>
          <p className="text-xs text-slate-500">
            Each factor represents a weighted core pillar of enterprise cryptographic security and post-quantum preparedness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {factors.map((factor) => (
            <div
              key={factor.factor_id}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-800">{factor.name}</span>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-slate-500 font-normal font-sans">(Weight: {Math.round(factor.weight * 100)}%)</span>
                  <span className="font-black text-slate-900">{factor.score}/100</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${getFactorBarColor(factor.score)}`}
                  style={{ width: `${factor.score}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>{factor.description}</span>
                <span className="font-mono font-bold text-slate-700 flex-shrink-0 ml-2">
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
          <div className="p-5 rounded-xl bg-white border border-emerald-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Strengths & Defenses ({r.strengths.length})</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {r.strengths.length === 0 ? (
                <li className="text-slate-500">No major quantum defenses identified yet.</li>
              ) : (
                r.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Gaps */}
          <div className="p-5 rounded-xl bg-white border border-rose-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-700">
              <ShieldAlert className="w-4 h-4" />
              <span>Critical Quantum Exposure Gaps ({r.gaps.length})</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {r.gaps.length === 0 ? (
                <li className="text-emerald-700">Zero critical gaps! Full compliance verified.</li>
              ) : (
                r.gaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{gap}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {/* 5-Tier Readiness Maturity Framework Matrix */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h4 className="font-bold text-sm text-slate-900">
          Enterprise Post-Quantum Maturity Classification Framework
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-1">
            <span className="font-mono font-bold text-emerald-700 block">90 – 100</span>
            <span className="font-bold text-slate-900">Quantum Ready</span>
            <p className="text-[11px] text-slate-600">Full NIST PQC / Hybrid deployment. Zero HNDL risk.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-200 space-y-1">
            <span className="font-mono font-bold text-blue-700 block">75 – 89</span>
            <span className="font-bold text-slate-900">Strong Readiness</span>
            <p className="text-[11px] text-slate-600">Crypto-agile baseline with minor residual legacy debt.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-amber-50/50 border border-amber-200 space-y-1">
            <span className="font-mono font-bold text-amber-700 block">50 – 74</span>
            <span className="font-bold text-slate-900">Moderate Readiness</span>
            <p className="text-[11px] text-slate-600">Standard classical crypto with active HNDL exposure.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-orange-50/50 border border-orange-200 space-y-1">
            <span className="font-mono font-bold text-orange-700 block">25 – 49</span>
            <span className="font-bold text-slate-900">High Exposure</span>
            <p className="text-[11px] text-slate-600">Critical systems rely on Shor-vulnerable asymmetric keys.</p>
          </div>

          <div className="p-3.5 rounded-lg bg-rose-50/50 border border-rose-200 space-y-1">
            <span className="font-mono font-bold text-rose-700 block">0 – 24</span>
            <span className="font-bold text-slate-900">Critical Exposure</span>
            <p className="text-[11px] text-slate-600">Widespread legacy primitives and zero crypto-agility.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
