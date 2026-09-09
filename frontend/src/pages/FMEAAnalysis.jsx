import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Sparkles,
  Info,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function FMEAAnalysis({ cbomReport, onSelectAsset }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedFMEA, setSelectedFMEA] = useState(null);

  if (!cbomReport) {
    return (
      <div className="p-8 text-center text-slate-500">
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
      case 'CRITICAL': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIUM': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <span>Quantum Failure Mode & Effects Analysis (FMEA)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Evaluates potential failure risks during PQC/hybrid migration: <span className="font-semibold text-blue-700">Severity (S) &times; Occurrence (O) &times; Detection (D) = Risk Priority Number (RPN)</span>.
          </p>
        </div>

        {fmeaSummary && (
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
              Avg RPN: <strong className="text-amber-700 font-mono">{fmeaSummary.average_rpn}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
              Max RPN: <strong className="text-rose-600 font-mono">{fmeaSummary.max_rpn} / 1000</strong>
            </div>
          </div>
        )}
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Assessed Assets</span>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {fmeaSummary?.total_assessed || 0}
          </div>
          <span className="text-[11px] text-slate-500">100% portfolio coverage</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Critical RPN (&ge; 250)</span>
          <div className="text-2xl font-bold text-rose-600 font-mono">
            {fmeaSummary?.critical_rpn_count || 0}
          </div>
          <span className="text-[11px] text-slate-500">Immediate remediation priority</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">High RPN (150 – 249)</span>
          <div className="text-2xl font-bold text-amber-600 font-mono">
            {fmeaSummary?.high_rpn_count || 0}
          </div>
          <span className="text-[11px] text-slate-500">Phase 2 transition backlog</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Controlled RPN (&lt; 150)</span>
          <div className="text-2xl font-bold text-emerald-700 font-mono">
            {(fmeaSummary?.medium_rpn_count || 0) + (fmeaSummary?.low_rpn_count || 0)}
          </div>
          <span className="text-[11px] text-slate-500">Manageable / PQC baseline</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedPriority === p
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {p} ({p === 'ALL' ? records.length : records.filter(r => r.priority === p).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search FMEA failure modes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* FMEA Data Table */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
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
            <tbody className="divide-y divide-slate-100 font-sans">
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
                    className="hover:bg-slate-50 transition cursor-pointer group"
                  >
                    <td className="py-3.5 pr-4 font-mono">
                      <div className="font-bold text-slate-900 group-hover:text-blue-700 transition">
                        {rec.asset_id}
                      </div>
                      <div className="text-[11px] text-slate-500">{rec.algorithm}</div>
                    </td>

                    <td className="py-3.5 px-3 max-w-[200px] truncate text-slate-800">
                      {rec.failure_mode}
                    </td>

                    <td className="py-3.5 px-3 max-w-[220px] truncate text-slate-600">
                      {rec.potential_effect}
                    </td>

                    <td className="py-3.5 px-2 text-center font-mono font-bold text-rose-600">
                      {rec.severity}
                    </td>

                    <td className="py-3.5 px-2 text-center font-mono font-bold text-amber-600">
                      {rec.occurrence}
                    </td>

                    <td className="py-3.5 px-2 text-center font-mono font-bold text-blue-600">
                      {rec.detection}
                    </td>

                    <td className="py-3.5 px-3 text-center font-mono font-black text-sm">
                      <span className={rec.rpn >= 250 ? 'text-rose-600' : rec.rpn >= 150 ? 'text-amber-600' : 'text-slate-700'}>
                        {rec.rpn}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getPriorityBadge(rec.priority)}`}>
                        {rec.priority}
                      </span>
                    </td>

                    <td className="py-3.5 pl-3 text-slate-700 text-[11px] max-w-[220px] truncate">
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
        <div className="p-6 rounded-xl bg-white border border-blue-200 space-y-4 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900 font-mono">
                Explainable FMEA RPN Breakdown: #{selectedFMEA.asset_id} ({selectedFMEA.algorithm})
              </h3>
            </div>
            <button 
              onClick={() => setSelectedFMEA(null)}
              className="text-xs text-slate-500 hover:text-slate-900 font-medium"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block font-sans">Severity (S: 1–10)</span>
              <div className="text-xl font-black text-rose-600">{selectedFMEA.severity} / 10</div>
              <p className="text-[11px] text-slate-600 font-sans">Impact on confidentiality & core business assets</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block font-sans">Occurrence (O: 1–10)</span>
              <div className="text-xl font-black text-amber-600">{selectedFMEA.occurrence} / 10</div>
              <p className="text-[11px] text-slate-600 font-sans">Observable exposure & data lifetime duration</p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] text-slate-500 block font-sans">Detection (D: 1–10)</span>
              <div className="text-xl font-black text-blue-600">{selectedFMEA.detection} / 10</div>
              <p className="text-[11px] text-slate-600 font-sans">Cryptographic transparency & agility difficulty</p>
            </div>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            <strong className="text-slate-900">Why This RPN:</strong> {selectedFMEA.why_this_rpn}
          </p>
        </div>
      )}

    </div>
  );
}
