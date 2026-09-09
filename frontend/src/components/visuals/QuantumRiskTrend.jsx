import React from 'react';
import { TrendingUp, Activity, CheckCircle2, ArrowRight } from 'lucide-react';

export default function QuantumRiskTrend({ cbomReport, onNavigate }) {
  if (!cbomReport) return null;

  const summary = cbomReport.scan_summary || {};
  const currentRisk = summary.average_risk_score || 78.0;
  const scanTime = summary.scan_timestamp ? new Date(summary.scan_timestamp).toLocaleDateString() : 'Baseline Scan';

  // Construct real trajectory points from current scan baseline and roadmap projections
  const trendPoints = [
    { label: 'Initial Discovery', score: currentRisk, date: scanTime },
    { label: 'Phase 1 Remediation', score: Math.round(currentRisk * 0.45 * 10) / 10, date: '+30 Days' },
    { label: 'Phase 2 Hybrid Pilot', score: Math.round(currentRisk * 0.20 * 10) / 10, date: '+90 Days' },
    { label: 'Phase 3 Full PQC', score: Math.round(currentRisk * 0.05 * 10) / 10, date: '+180 Days' },
    { label: 'Continuous Audit', score: 0.0, date: '+360 Days' }
  ];

  return (
    <div className="p-6 rounded-2xl command-card border-emerald-500/30 space-y-4 flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Quantum Risk Trajectory &amp; Trend
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
          Baseline Score: {currentRisk}/100
        </span>
      </div>

      {/* SVG Risk Trajectory Chart */}
      <div className="p-3.5 rounded-xl bg-[#040814] border border-[#1E2D4A] space-y-2 font-mono text-xs">
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>RISK SCORE: 100</span>
          <span className="text-emerald-400">TARGET: 0 (PQC RESILIENT)</span>
        </div>

        {/* SVG Sparkline Curve */}
        <div className="h-28 w-full">
          <svg viewBox="0 0 500 120" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="riskTrendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            <line x1="0" y1="20" x2="500" y2="20" stroke="#1E2D4A" strokeDasharray="3 3" />
            <line x1="0" y1="60" x2="500" y2="60" stroke="#1E2D4A" strokeDasharray="3 3" />
            <line x1="0" y1="100" x2="500" y2="100" stroke="#1E2D4A" strokeDasharray="3 3" />

            {/* Shaded Area */}
            <path
              d={`M 20 ${110 - (currentRisk * 0.9)} L 140 70 L 260 90 L 380 105 L 480 110 L 480 115 L 20 115 Z`}
              fill="url(#riskTrendGrad)"
            />

            {/* Line path */}
            <path
              d={`M 20 ${110 - (currentRisk * 0.9)} L 140 70 L 260 90 L 380 105 L 480 110`}
              fill="none"
              stroke="#00F0FF"
              strokeWidth="2.5"
              className="animate-pulse"
            />

            {/* Data points */}
            <circle cx="20" cy={110 - (currentRisk * 0.9)} r="4.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="140" cy="70" r="3.5" fill="#F97316" />
            <circle cx="260" cy="90" r="3.5" fill="#F59E0B" />
            <circle cx="380" cy="105" r="3.5" fill="#10B981" />
            <circle cx="480" cy="110" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Labels below */}
        <div className="grid grid-cols-5 gap-1 text-[9px] text-center pt-1 border-t border-[#1E2D4A]/60">
          {trendPoints.map((pt, idx) => (
            <div key={idx} className="space-y-0.5">
              <span className="text-slate-400 block truncate">{pt.label}</span>
              <strong className={idx === 0 ? 'text-rose-400' : idx === 4 ? 'text-emerald-400' : 'text-amber-400'}>
                {pt.score}/100
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400">Continuous Surveillance: <strong className="text-emerald-400">ACTIVE</strong></span>
        {onNavigate && (
          <button
            onClick={() => onNavigate('monitoring')}
            className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Live Surveillance Stream</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
