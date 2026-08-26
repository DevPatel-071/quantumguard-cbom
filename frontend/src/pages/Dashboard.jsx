import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Gauge,
  Compass,
  DollarSign,
  Zap
} from 'lucide-react';

export default function Dashboard({ cbomReport, onNavigate, onSelectAsset }) {
  if (!cbomReport) {
    return (
      <div className="p-8 text-center text-slate-400">
        No active inventory available. Please run a cryptographic discovery scan.
      </div>
    );
  }

  const s = cbomReport.scan_summary;
  const r = cbomReport.readiness_assessment;
  const rm = cbomReport.roadmap_report;
  const c = cbomReport.cost_summary;
  const assets = cbomReport.assets || [];

  // Top 5-10 Immediate Priorities (Phase 1 or Top Risk)
  const topPriorities = assets
    .filter(a => a.migration_phase === 'PHASE_1_IMMEDIATE' || a.risk_level === 'CRITICAL' || (a.mosca && a.mosca.is_urgent))
    .slice(0, 7);

  const score = r ? r.overall_score : 70.0;
  const statusLabel = r ? r.status_label : 'Moderate Readiness';

  const getScoreColor = (sc) => {
    if (sc >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (sc >= 75) return 'text-sky-400 border-sky-500/30 bg-sky-500/10';
    if (sc >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    if (sc >= 25) return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <span>Executive Quantum Posture Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400">
            Target System: <strong className="text-slate-200">{s.target_name}</strong> &bull; Scanned {s.files_scanned} files across AST, dependencies, and certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('roadmap')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 transition"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Migration Roadmap</span>
          </button>
          <button
            onClick={() => onNavigate('scan')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/20 transition"
          >
            <span>Run New Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Banner: Quantum Readiness Scorecard & Cost Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Readiness Score Card (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2.5 max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-950 border border-slate-800 text-slate-300">
              <Gauge className="w-3.5 h-3.5 text-sky-400" />
              <span>QUANTUM READINESS POSTURE</span>
            </div>
            <h2 className="text-lg font-bold text-slate-100">
              Organization Readiness Index
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {r ? r.summary : 'Evaluates cryptographic inventory coverage, PQC adoption, critical risk mitigation, and HNDL immunity.'}
            </p>
            <button
              onClick={() => onNavigate('readiness')}
              className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition pt-1"
            >
              <span>Inspect All 6 Readiness Pillars</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center min-w-[170px] text-center space-y-1 ${getScoreColor(score)}`}>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Readiness Score
            </span>
            <div className="text-4xl font-black font-mono">
              {score}
              <span className="text-base text-slate-500 font-normal">/100</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950 border border-current">
              {statusLabel}
            </span>
          </div>
        </div>

        {/* Migration Budget & Effort Summary Card */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
                Migration Budget & Effort
              </span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              ${c ? c.total_estimated_cost_usd.toLocaleString() : '82,980'}
            </div>
            <p className="text-xs text-slate-400">
              Total estimated effort: <strong className="text-slate-200">{rm ? rm.total_effort_hours : 680} hours</strong>
            </p>
          </div>

          <div className="space-y-1.5 text-xs font-mono border-t border-slate-800 pt-3 text-slate-400">
            <div className="flex justify-between">
              <span>Phase 1 (Immediate):</span>
              <span className="text-rose-400 font-bold">{rm ? rm.phases[0].asset_count : 12} assets</span>
            </div>
            <div className="flex justify-between">
              <span>Phase 2 (High Priority):</span>
              <span className="text-amber-400 font-bold">{rm ? rm.phases[1].asset_count : 13} assets</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('simulators')}
            className="w-full py-2 rounded-xl text-xs font-bold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition text-center"
          >
            Adjust Rates in Cost Simulator
          </button>
        </div>

      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-500 font-mono uppercase">Total Assets</span>
          <div className="text-2xl font-black text-slate-100">{s.crypto_assets_count}</div>
          <span className="text-[10px] text-slate-400">{s.files_scanned} files inspected</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-rose-500/30 bg-rose-500/5 space-y-1">
          <span className="text-[10px] text-rose-400 font-mono uppercase">Shor Vulnerable</span>
          <div className="text-2xl font-black text-rose-400">{s.quantum_vulnerable_count}</div>
          <span className="text-[10px] text-slate-400">Broken by CRQC</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-rose-400 font-mono uppercase">Critical Risks</span>
          <div className="text-2xl font-black text-rose-400">{s.critical_risk_count}</div>
          <span className="text-[10px] text-slate-400">Score &ge; 75/100</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] text-amber-400 font-mono uppercase">High Risks</span>
          <div className="text-2xl font-black text-amber-400">{s.high_risk_count}</div>
          <span className="text-[10px] text-slate-400">Score 50-74</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 bg-amber-500/5 space-y-1">
          <span className="text-[10px] text-amber-400 font-mono uppercase">Mosca Urgent</span>
          <div className="text-2xl font-black text-amber-400">{s.mosca_urgent_count}</div>
          <span className="text-[10px] text-slate-400">X + Y &gt; Z active</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-emerald-500/30 bg-emerald-500/5 space-y-1">
          <span className="text-[10px] text-emerald-400 font-mono uppercase">PQC-Ready</span>
          <div className="text-2xl font-black text-emerald-400">{s.pqc_ready_count}</div>
          <span className="text-[10px] text-slate-400">FIPS 203/204</span>
        </div>
      </div>

      {/* "WHAT SHOULD I FIX FIRST?" Section */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-rose-500/30 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="space-y-0.5">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>WHAT SHOULD I FIX FIRST? — Top Immediate Migration Priorities</span>
            </h3>
            <p className="text-xs text-slate-400">
              Ranked sequentially by Shor vulnerability, active Mosca HNDL urgency, and business criticality impact.
            </p>
          </div>

          <button
            onClick={() => onNavigate('roadmap')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
          >
            <span>View Full 4-Phase Roadmap ({assets.length} assets)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {topPriorities.map((asset) => (
            <div
              key={asset.asset_id}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-sky-400 text-xs">
                    #{asset.migration_priority} {asset.asset_id}
                  </span>
                  <span className="font-bold text-slate-200 text-xs">
                    {asset.algorithm} {asset.key_size ? `(${asset.key_size}-bit)` : ''}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    Risk: {asset.risk_score} (CRITICAL)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {asset.phase_label}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  Location: <span className="text-indigo-300">{asset.file}:{asset.line_number || 1}</span> &bull; Criticality: {asset.business_criticality}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  <strong>Action:</strong> {asset.suggested_action}
                </p>
              </div>

              <div className="flex items-center gap-3 md:border-l md:border-slate-800 md:pl-4 flex-shrink-0">
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-500 block">
                    Recommended Target
                  </span>
                  <span className="font-bold text-xs text-emerald-400 font-mono">
                    {asset.recommended_pqc || 'ML-KEM-768'}
                  </span>
                </div>
                <button
                  onClick={() => onSelectAsset(asset)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-800 transition flex items-center gap-1"
                >
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
