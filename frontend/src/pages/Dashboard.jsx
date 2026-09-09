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
  ChevronRight, 
  Gauge, 
  Compass, 
  DollarSign, 
  Activity, 
  Network, 
  Lock, 
  FileSearch,
  Database,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard({ cbomReport, onNavigate, onSelectAsset }) {
  // Empty State / First-Time Onboarding
  if (!cbomReport || !cbomReport.scan_summary || cbomReport.scan_summary.crypto_assets_count === 0) {
    return (
      <div className="p-6 sm:p-12 max-w-4xl mx-auto space-y-8 text-center animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-600 p-3 shadow-lg shadow-blue-500/20 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-10 h-10 fill-none">
            <circle cx="50" cy="50" r="34" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
            <path d="M54 54 L74 74" stroke="#38BDF8" strokeWidth="12" strokeLinecap="round" />
            <circle cx="50" cy="50" r="9" fill="#FFFFFF" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            QUANTUM READINESS DASHBOARD
          </h1>
          <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
            Prepare Today, Secure Tomorrow.
          </p>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Understand your cryptographic exposure and plan your transition to quantum-resilient security.
          </p>
        </div>

        {/* 6 Onboarding Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-left">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-blue-600">01. Source Discovery</span>
            <p className="text-xs text-slate-500">Select Git repo, upload folder, or test sample suite.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-indigo-600">02. User Consent</span>
            <p className="text-xs text-slate-500">Choose Single Scan or Continuous Monitoring mode.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-purple-600">03. CBOM Generation</span>
            <p className="text-xs text-slate-500">CycloneDX 1.6 compliant asset extraction.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-amber-600">04. Quantum FMEA</span>
            <p className="text-xs text-slate-500">Deterministic Severity, Occurrence & Detection (RPN).</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-rose-600">05. Mosca HNDL Matrix</span>
            <p className="text-xs text-slate-500">Harvest Now Decrypt Later exposure evaluation.</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-xs font-bold text-emerald-600">06. Migration Roadmap</span>
            <p className="text-xs text-slate-500">4-Phase action plan with cost & latency modeling.</p>
          </div>
        </div>

        <div>
          <button
            onClick={() => onNavigate('scan')}
            className="px-6 py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition flex items-center gap-2 mx-auto"
          >
            <FileSearch className="w-4 h-4" />
            <span>Start First Scan</span>
          </button>
        </div>
      </div>
    );
  }

  const s = cbomReport.scan_summary;
  const r = cbomReport.readiness_assessment;
  const rm = cbomReport.roadmap_report;
  const c = cbomReport.cost_summary;
  const fmea = cbomReport.fmea_summary;
  const dep = cbomReport.dependency_graph;
  const assets = cbomReport.assets || [];

  // Top 5-7 Immediate Priorities
  const topPriorities = assets
    .filter(a => a.migration_phase === 'PHASE_1_IMMEDIATE' || a.risk_level === 'CRITICAL' || (a.mosca && a.mosca.is_urgent))
    .slice(0, 6);

  const score = r ? r.overall_score : 70.0;
  const statusLabel = r ? r.status_label : 'Moderate Readiness';

  const getScoreBadge = (sc) => {
    if (sc >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (sc >= 75) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (sc >= 50) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (sc >= 25) return 'bg-orange-50 text-orange-700 border-orange-200';
    return 'bg-rose-50 text-rose-700 border-rose-200';
  };

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto">
      
      {/* Page Heading & Target Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              QUANTUM READINESS DASHBOARD
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Monitoring Active
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Understand your cryptographic exposure and plan your transition to quantum-resilient security.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('roadmap')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs transition"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Migration Roadmap</span>
          </button>
          <button
            onClick={() => onNavigate('scan')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition"
          >
            <span>Run New Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Crypto Assets */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Crypto Assets
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-3xl font-bold text-slate-900 font-mono">
              {s.crypto_assets_count}
            </div>
            <p className="text-[11px] text-slate-500">
              {s.files_scanned} files inspected across source & config
            </p>
          </div>
        </div>

        {/* KPI 2: High Risk Assets */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              High Risk Assets
            </span>
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-3xl font-bold text-orange-600 font-mono">
              {s.high_risk_count}
            </div>
            <p className="text-[11px] text-slate-500">
              Score 50-74 &bull; Requires phased replacement
            </p>
          </div>
        </div>

        {/* KPI 3: Critical Assets */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Critical Assets
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-0.5">
            <div className="text-3xl font-bold text-rose-600 font-mono">
              {s.critical_risk_count}
            </div>
            <p className="text-[11px] text-slate-500">
              Score &ge; 75/100 &bull; Immediate Shor/HNDL threat
            </p>
          </div>
        </div>

        {/* KPI 4: Quantum Readiness */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 hover:shadow-sm transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Quantum Readiness
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-slate-900 font-mono">{score}</span>
              <span className="text-xs font-medium text-slate-400">/ 100</span>
              <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full border ${getScoreBadge(score)}`}>
                {statusLabel}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Secondary Row: Executive Readiness Card & Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Readiness Overview Card (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                  Posture Summary
                </span>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs text-slate-600 font-medium">Target: {s.target_name}</span>
              </div>
              <button
                onClick={() => onNavigate('readiness')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
              >
                <span>View Full Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed">
              {r ? r.summary : 'Evaluates cryptographic inventory coverage, PQC adoption, critical risk mitigation, and HNDL immunity.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Shor Quantum Vulnerable</span>
              <span className="text-lg font-bold text-rose-600 font-mono">{s.quantum_vulnerable_count}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Mosca Urgent (X+Y &gt; Z)</span>
              <span className="text-lg font-bold text-amber-600 font-mono">{s.mosca_urgent_count}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block">PQC Standardized (FIPS)</span>
              <span className="text-lg font-bold text-emerald-600 font-mono">{s.pqc_ready_count}</span>
            </div>
          </div>
        </div>

        {/* Financial & Effort Budget Card (1 col) */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Migration Projection
              </span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-emerald-700 font-mono">
              ${c ? c.total_estimated_cost_usd.toLocaleString() : '82,980'}
            </div>
            <p className="text-xs text-slate-500">
              Total engineering effort: <strong className="text-slate-800 font-semibold">{rm ? rm.total_effort_hours : 680} hours</strong>
            </p>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
            <div className="flex justify-between">
              <span>Phase 1 (Immediate):</span>
              <span className="text-rose-600 font-bold">{rm ? rm.phases[0].asset_count : 12} assets</span>
            </div>
            <div className="flex justify-between">
              <span>FMEA Critical RPN:</span>
              <span className="text-amber-600 font-bold">{fmea ? fmea.critical_rpn_count : 12} assets</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('simulators')}
            className="w-full py-2 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition text-center shadow-xs"
          >
            Open Financial & Latency Simulator
          </button>
        </div>

      </div>

      {/* Priority Remediation Backlog & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Top Immediate Priorities (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Priority Quantum Vulnerability Backlog</span>
              </h2>
              <p className="text-xs text-slate-500">
                Ranked by Shor vulnerability, Mosca HNDL urgency, and business criticality.
              </p>
            </div>

            <button
              onClick={() => onNavigate('cbom')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
            >
              <span>View Full CBOM ({assets.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {topPriorities.map((asset) => (
              <div
                key={asset.asset_id}
                className="p-4 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-blue-700 text-xs">
                      #{asset.migration_priority} {asset.asset_id}
                    </span>
                    <span className="font-bold text-slate-900 text-xs">
                      {asset.algorithm} {asset.key_size ? `(${asset.key_size}-bit)` : ''}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                      Risk: {asset.risk_score} (CRITICAL)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                      {asset.phase_label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {asset.file}:{asset.line_number || 1} &bull; Criticality: {asset.business_criticality}
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    <strong className="text-slate-900">Action:</strong> {asset.suggested_action}
                  </p>
                </div>

                <div className="flex items-center gap-3 md:border-l md:border-slate-200 md:pl-4 flex-shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                      Recommended
                    </span>
                    <span className="font-bold text-xs text-emerald-700 font-mono">
                      {asset.recommended_pqc || 'ML-KEM-768'}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectAsset(asset)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 transition shadow-xs flex items-center gap-1"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dependency & FMEA Snapshot (1 col) */}
        <div className="space-y-6">
          
          {/* FMEA Card */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Quantum FMEA Summary</span>
              </span>
              <button 
                onClick={() => onNavigate('fmea')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View Matrix
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-sans">Max Portfolio RPN:</span>
                <span className="text-rose-600 font-bold">{fmea ? fmea.max_rpn : 392} / 1000</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-sans">Average RPN:</span>
                <span className="text-amber-600 font-bold">{fmea ? fmea.average_rpn : 297.9}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-sans">Critical Priority Assets:</span>
                <span className="text-rose-600 font-bold">{fmea ? fmea.critical_rpn_count : 12}</span>
              </div>
            </div>
          </div>

          {/* Dependency Intelligence Card */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-600" />
                <span>Dependency Graph Trace</span>
              </span>
              <button 
                onClick={() => onNavigate('dependencies')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Explore Graph
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-sans">Total Graph Nodes:</span>
                <span className="text-blue-700 font-bold">{dep?.nodes?.length || 48}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-sans">Packages Detected:</span>
                <span className="text-indigo-700 font-bold">{dep?.total_packages || 11}</span>
              </div>
              <div className="flex justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-600 font-sans">Vulnerable Packages:</span>
                <span className="text-rose-600 font-bold">{dep?.vulnerable_packages_count || 3}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
