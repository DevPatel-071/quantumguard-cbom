import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Activity, 
  Search, 
  Filter, 
  CheckCircle2, 
  Info,
  ChevronRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export default function FMEAAnalysis({ cbomReport, onSelectAsset }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedFMEA, setSelectedFMEA] = useState(null);

  if (!cbomReport) {
    return (
      <div className="p-8 text-center text-slate-400">
        No active inventory available. Please execute a cryptographic discovery scan.
      </div>
    );
  }

  const fmeaSummary = cbomReport.fmea_summary;
  const records = fmeaSummary?.records || [];

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchesPriority = selectedPriority === 'ALL' || r.priority === selectedPriority;
    const matchesSearch = 
      r.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.algorithm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.failure_mode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.potential_effect.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'HIGH': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'MEDIUM': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      default: return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            <span>Quantum Failure Mode & Effects Analysis (FMEA)</span>
          </h1>
          <p className="text-xs text-slate-400">
            Systematic engineering risk prioritization: <span className="font-mono text-cyan-300">Severity (S) &times; Occurrence (O) &times; Detection (D) = Risk Priority Number (RPN)</span>.
          </p>
        </div>

        {fmeaSummary && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              Avg RPN: <strong className="text-amber-400">{fmeaSummary.average_rpn}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              Max RPN: <strong className="text-rose-400">{fmeaSummary.max_rpn} / 1000</strong>
            </div>
          </div>
        )}
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Total Assessed Assets</span>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {fmeaSummary?.total_assessed || 0}
          </div>
          <span className="text-[11px] text-slate-500">100% portfolio coverage</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 bg-rose-500/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-rose-400">Critical RPN (&ge; 250)</span>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {fmeaSummary?.critical_rpn_count || 0}
          </div>
          <span className="text-[11px] text-slate-400">Immediate remediation priority</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-amber-500/30 bg-amber-500/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-amber-400">High RPN (150 – 249)</span>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {fmeaSummary?.high_rpn_count || 0}
          </div>
          <span className="text-[11px] text-slate-400">Phase 2 transition backlog</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 bg-emerald-500/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-emerald-400">Controlled RPN (&lt; 150)</span>
          <div className="text-2xl font-black text-emerald-300 font-mono">
            {(fmeaSummary?.medium_rpn_count || 0) + (fmeaSummary?.low_rpn_count || 0)}
          </div>
          <span className="text-[11px] text-slate-400">Manageable / PQC baseline</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-3 py-1.5 rounded-xl transition ${
                selectedPriority === p
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {p} ({p === 'ALL' ? records.length : records.filter(r => r.priority === p).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search FMEA failure modes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* FMEA Data Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="pb-3 pr-4">Asset & Algorithm</th>
                <th className="pb-3 px-3">Failure Mode</th>
                <th className="pb-3 px-3">Potential Effect</th>
                <th className="pb-3 px-2 text-center">S</th>
                <th className="pb-3 px-2 text-center">O</th>
                <th className="pb-3 px-2 text-center">D</th>
                <th className="pb-3 px-3 text-center">RPN</th>
                <th className="pb-3 px-3">Priority</th>
                <th className="pb-3 pl-3">Prevention Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-slate-500">
                    No FMEA records match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr 
                    key={rec.asset_id}
                    onClick={() => setSelectedFMEA(rec)}
                    className="hover:bg-slate-800/40 transition cursor-pointer group"
                  >
                    <td className="py-3.5 pr-4 font-mono">
                      <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition">
                        {rec.asset_id}
                      </div>
                      <div className="text-[11px] text-slate-400">{rec.algorithm}</div>
                    </td>

                    <td className="py-3.5 px-3 max-w-[200px] truncate text-slate-300">
                      {rec.failure_mode}
                    </td>

                    <td className="py-3.5 px-3 max-w-[220px] truncate text-slate-400">
                      {rec.potential_effect}
                    </td>

                    <td className="py-3.5 px-2 text-center font-mono font-bold text-rose-400">
                      {rec.severity}
                    </td>

                    <td className="py-3.5 px-2 text-center font-mono font-bold text-amber-400">
                      {rec.occurrence}
                    </td>

                    <td className="py-3.5 px-2 text-center font-mono font-bold text-indigo-400">
                      {rec.detection}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-black text-sm">
                      <span className={rec.rpn >= 250 ? 'text-rose-400' : rec.rpn >= 150 ? 'text-amber-400' : 'text-slate-300'}>
                        {rec.rpn}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getPriorityBadge(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </td>

                    <td className="py-3.5 pl-3 text-slate-300 text-[11px] max-w-[220px] truncate">
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
        <div className="p-6 rounded-3xl bg-slate-900/95 border border-cyan-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-slate-100 font-mono">
                Explainable FMEA RPN Breakdown: #{selectedFMEA.asset_id} ({selectedFMEA.algorithm})
              </h3>
            </div>
            <button 
              onClick={() => setSelectedFMEA(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">Severity (S: 1–10)</span>
              <div className="text-xl font-black text-rose-400">{selectedFMEA.severity} / 10</div>
              <p className="text-[11px] text-slate-400">Impact on confidentiality & core business assets</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">Occurrence (O: 1–10)</span>
              <div className="text-xl font-black text-amber-400">{selectedFMEA.occurrence} / 10</div>
              <p className="text-[11px] text-slate-400">Observable exposure & data lifetime duration</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500 block">Detection (D: 1–10)</span>
              <div className="text-xl font-black text-indigo-400">{selectedFMEA.detection} / 10</div>
              <p className="text-[11px] text-slate-400">Cryptographic transparency & agility difficulty</p>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
            <strong>Why This RPN:</strong> {selectedFMEA.why_this_rpn}
          </p>
        </div>
      )}

    </div>
  );
}
