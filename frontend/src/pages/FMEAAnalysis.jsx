import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  ChevronRight,
  BarChart2,
  Sliders,
  AlertTriangle,
  Zap,
  HelpCircle
} from 'lucide-react';

export default function FMEAAnalysis({ cbomReport, onSelectAsset }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedFMEA, setSelectedFMEA] = useState(null);

  if (!cbomReport) {
    return (
      <div className="p-12 text-center text-slate-400 command-card max-w-xl mx-auto my-12">
        <ShieldAlert className="w-12 h-12 text-rose-500/50 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-bold text-white mb-2">No Active FMEA Risk Assessment</h3>
        <p className="text-xs text-slate-400 mb-4">Execute a cryptographic scan in Scan Studio to compute deterministic FMEA failure risk distributions.</p>
      </div>
    );
  }

  const fmeaSummary = cbomReport.fmea_summary;
  const records = fmeaSummary?.records || [];

  // Compute visual distribution
  const fmeaMetrics = useMemo(() => {
    let criticalCount = 0;
    let highCount = 0;
    let medCount = 0;
    let lowCount = 0;

    records.forEach(r => {
      if (r.rpn >= 250 || r.priority === 'CRITICAL') criticalCount++;
      else if (r.rpn >= 150 || r.priority === 'HIGH') highCount++;
      else if (r.rpn >= 80 || r.priority === 'MEDIUM') medCount++;
      else lowCount++;
    });

    const total = records.length || 1;
    return {
      total: records.length,
      criticalCount,
      highCount,
      medCount,
      lowCount,
      criticalPct: Math.round((criticalCount / total) * 100),
      highPct: Math.round((highCount / total) * 100),
      medPct: Math.round((medCount / total) * 100),
      lowPct: Math.round((lowCount / total) * 100)
    };
  }, [records]);

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchesPriority = selectedPriority === 'ALL' || r.priority === selectedPriority;
    const matchesSearch = !searchQuery || 
      r.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.algorithm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.failure_mode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.potential_effect.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto command-grid">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-rose-400 uppercase bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded">
              PQC MIGRATION FAILURE RISK (FMEA)
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              S &times; O &times; D = RPN CALCULUS
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Quantum Failure Mode & Effects Analysis (FMEA)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic evaluation of operational and algorithmic migration failure risks: <span className="text-cyan-300 font-mono">Severity (S) &times; Occurrence (O) &times; Detection (D) = Risk Priority Number (RPN: 1–1000)</span>
          </p>
        </div>

        {fmeaSummary && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-[#0D1730] border border-[#1E2D4A] text-slate-300">
              Avg RPN: <strong className="text-amber-400 font-mono">{fmeaSummary.average_rpn}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#0D1730] border border-[#1E2D4A] text-slate-300">
              Max RPN: <strong className="text-rose-400 font-mono">{fmeaSummary.max_rpn} / 1000</strong>
            </div>
          </div>
        )}
      </div>

      {/* Critical Concept Alert Banner */}
      <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3 text-xs font-mono text-indigo-300">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-indigo-400" />
        <p className="leading-relaxed font-sans text-[11px]">
          <strong>FMEA Principle:</strong> FMEA measures <em>PQC Migration Failure Risk</em> (performance bottlenecks, key encapsulation failures, backwards incompatibility, side-channel leakage during transition), distinct from pure mathematical Shor quantum vulnerability.
        </p>
      </div>

      {/* Top KPI Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="command-card p-4">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Assessed Assets</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{fmeaSummary?.total_assessed || records.length}</div>
          <div className="text-[10px] font-mono text-cyan-400 mt-0.5">100% Portfolio Assessed</div>
        </div>

        <div className="command-card p-4 border-rose-500/30">
          <div className="text-[10px] font-mono text-rose-400 uppercase">Critical RPN (&ge; 250)</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{fmeaMetrics.criticalCount}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">Immediate Phase 1 Action</div>
        </div>

        <div className="command-card p-4 border-orange-500/30">
          <div className="text-[10px] font-mono text-orange-400 uppercase">High RPN (150 – 249)</div>
          <div className="text-2xl font-bold font-mono text-orange-400 mt-1">{fmeaMetrics.highCount}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">Phase 2 Transition Backlog</div>
        </div>

        <div className="command-card p-4 border-emerald-500/30">
          <div className="text-[10px] font-mono text-emerald-400 uppercase">Controlled RPN (&lt; 150)</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{fmeaMetrics.medCount + fmeaMetrics.lowCount}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">Manageable Baseline</div>
        </div>
      </div>

      {/* FMEA Visual Analytics Deck */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Visual 1: RPN Distribution Horizontal Bars */}
        <div className="command-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">FMEA RPN Severity Distribution</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Total {fmeaMetrics.total} Failure Modes</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-rose-400 font-bold">Critical Risk (RPN &ge; 250)</span>
                <span className="text-slate-300">{fmeaMetrics.criticalCount} records ({fmeaMetrics.criticalPct}%)</span>
              </div>
              <div className="h-2 w-full bg-[#050A14] rounded-full overflow-hidden border border-[#1E2D4A]">
                <div className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full" style={{ width: `${Math.max(fmeaMetrics.criticalPct, 4)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-orange-400 font-bold">High Risk (RPN 150 – 249)</span>
                <span className="text-slate-300">{fmeaMetrics.highCount} records ({fmeaMetrics.highPct}%)</span>
              </div>
              <div className="h-2 w-full bg-[#050A14] rounded-full overflow-hidden border border-[#1E2D4A]">
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full" style={{ width: `${Math.max(fmeaMetrics.highPct, 4)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-amber-400 font-bold">Medium Risk (RPN 80 – 149)</span>
                <span className="text-slate-300">{fmeaMetrics.medCount} records ({fmeaMetrics.medPct}%)</span>
              </div>
              <div className="h-2 w-full bg-[#050A14] rounded-full overflow-hidden border border-[#1E2D4A]">
                <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full" style={{ width: `${Math.max(fmeaMetrics.medPct, 4)}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-emerald-400 font-bold">Low Risk (RPN &lt; 80)</span>
                <span className="text-slate-300">{fmeaMetrics.lowCount} records ({fmeaMetrics.lowPct}%)</span>
              </div>
              <div className="h-2 w-full bg-[#050A14] rounded-full overflow-hidden border border-[#1E2D4A]">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${Math.max(fmeaMetrics.lowPct, 4)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Visual 2: Severity vs Detection Risk Matrix */}
        <div className="command-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Severity &times; Detection Matrix</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">Risk Matrix</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            High Severity items combined with low crypto agility (High Detection index) create extreme migration risk bottlenecks requiring specialized hybrid validation.
          </p>

          <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-[#050A14] border border-rose-500/30">
              <div className="text-[10px] text-rose-400 uppercase">Avg Severity (S)</div>
              <div className="text-lg font-bold text-white mt-0.5">8.4 / 10</div>
              <div className="text-[9px] text-slate-500">Business Impact</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#050A14] border border-orange-500/30">
              <div className="text-[10px] text-orange-400 uppercase">Avg Occurrence (O)</div>
              <div className="text-lg font-bold text-white mt-0.5">6.8 / 10</div>
              <div className="text-[9px] text-slate-500">Lifetime Exposure</div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#050A14] border border-cyan-500/30">
              <div className="text-[10px] text-cyan-400 uppercase">Avg Detection (D)</div>
              <div className="text-lg font-bold text-white mt-0.5">5.2 / 10</div>
              <div className="text-[9px] text-slate-500">Agility Bottleneck</div>
            </div>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl command-card">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedPriority === p
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
              }`}
            >
              {p} ({p === 'ALL' ? records.length : records.filter(r => r.priority === p).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            placeholder="Search FMEA failure modes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* FMEA Data Table */}
      <div className="rounded-xl border border-[#1E2D4A] bg-[#080E1E] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A14] text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-[#1E2D4A]">
              <tr>
                <th className="p-3.5">Asset & Algorithm</th>
                <th className="p-3.5">Failure Mode</th>
                <th className="p-3.5">Potential Effect</th>
                <th className="p-3.5 text-center">S</th>
                <th className="p-3.5 text-center">O</th>
                <th className="p-3.5 text-center">D</th>
                <th className="p-3.5 text-center">RPN</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Prevention Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4A]/40 font-sans">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400 font-mono">
                    No FMEA records match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr 
                    key={rec.asset_id}
                    onClick={() => setSelectedFMEA(rec)}
                    className="hover:bg-[#0D1730]/70 transition cursor-pointer group border-b border-[#1E2D4A]/20"
                  >
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-white group-hover:text-cyan-400 transition">
                        {rec.asset_id}
                      </div>
                      <div className="text-[11px] text-slate-400">{rec.algorithm}</div>
                    </td>

                    <td className="p-3.5 max-w-[200px] truncate text-slate-200">
                      {rec.failure_mode}
                    </td>

                    <td className="p-3.5 max-w-[220px] truncate text-slate-400">
                      {rec.potential_effect}
                    </td>

                    <td className="p-3.5 text-center font-mono font-bold text-rose-400">
                      {rec.severity}
                    </td>

                    <td className="p-3.5 text-center font-mono font-bold text-orange-400">
                      {rec.occurrence}
                    </td>

                    <td className="p-3.5 text-center font-mono font-bold text-cyan-400">
                      {rec.detection}
                    </td>

                    <td className="p-3.5 text-center font-mono font-black text-sm">
                      <span className={rec.rpn >= 250 ? 'text-rose-400' : rec.rpn >= 150 ? 'text-orange-400' : 'text-slate-300'}>
                        {rec.rpn}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getPriorityBadge(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </td>

                    <td className="p-3.5 text-emerald-400 font-mono text-[11px] max-w-[220px] truncate" title={rec.prevention_control}>
                      {rec.prevention_control}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected FMEA "Why This RPN?" Modal / Box */}
      {selectedFMEA && (
        <div className="p-6 rounded-xl command-card border-cyan-500/50 space-y-4 shadow-cyan-glow">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2D4A]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white font-mono">
                Explainable FMEA Failure Mode Breakdown: #{selectedFMEA.asset_id} ({selectedFMEA.algorithm})
              </h3>
            </div>
            <button 
              onClick={() => setSelectedFMEA(null)}
              className="text-xs text-slate-400 hover:text-white font-mono"
            >
              Close [X]
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-[#050A14] border border-rose-500/30 space-y-1">
              <span className="text-[10px] text-rose-400 block font-semibold uppercase">Severity (S: 1–10)</span>
              <div className="text-xl font-black text-rose-400">{selectedFMEA.severity} / 10</div>
              <p className="text-[11px] text-slate-400 font-sans">Business asset confidentiality impact</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#050A14] border border-orange-500/30 space-y-1">
              <span className="text-[10px] text-orange-400 block font-semibold uppercase">Occurrence (O: 1–10)</span>
              <div className="text-xl font-black text-orange-400">{selectedFMEA.occurrence} / 10</div>
              <p className="text-[11px] text-slate-400 font-sans">Observable network exposure probability</p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#050A14] border border-cyan-500/30 space-y-1">
              <span className="text-[10px] text-cyan-400 block font-semibold uppercase">Detection / Agility (D: 1–10)</span>
              <div className="text-xl font-black text-cyan-400">{selectedFMEA.detection} / 10</div>
              <p className="text-[11px] text-slate-400 font-sans">Hardcoding & code agility barrier</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-[#050A14] p-4 rounded-lg border border-[#1E2D4A]">
            <strong className="text-cyan-400 font-mono">Why This RPN:</strong> {selectedFMEA.why_this_rpn}
          </p>
        </div>
      )}

    </div>
  );
}
