import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  ChevronRight
} from 'lucide-react';

export default function MigrationRoadmap({ cbomReport, onSelectAsset }) {
  const [selectedPhase, setSelectedPhase] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!cbomReport) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active inventory available. Please run a cryptographic discovery scan.
      </div>
    );
  }

  const rm = cbomReport.roadmap_report;
  const assets = cbomReport.assets || [];

  // Filter assets
  const filteredAssets = assets.filter((a) => {
    const matchesPhase = selectedPhase === 'ALL' || a.migration_phase === selectedPhase;
    const matchesSearch = 
      a.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.algorithm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.recommended_pqc && a.recommended_pqc.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.suggested_action && a.suggested_action.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPhase && matchesSearch;
  });

  const getPhaseBadge = (phaseType) => {
    switch (phaseType) {
      case 'PHASE_1_IMMEDIATE':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'PHASE_2_HIGH_PRIORITY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PHASE_3_PLANNED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-blue-600" />
            <span>Post-Quantum Migration Roadmap</span>
          </h1>
          <p className="text-xs text-slate-500">
            Intelligent 4-Phase strategic transition schedule dynamically organized by quantum vulnerability, Mosca urgency, and business criticality.
          </p>
        </div>

        {rm && (
          <div className="flex items-center gap-3 text-xs">
            <div className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
              Total Effort: <strong className="text-blue-700 font-mono">{rm.total_effort_hours}h</strong>
            </div>
            <div className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
              Est. Budget: <strong className="text-emerald-700 font-mono">${rm.total_cost_usd.toLocaleString()}</strong>
            </div>
          </div>
        )}
      </div>

      {/* 4-Phase Visual Overview Cards */}
      {rm && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rm.phases.map((phase) => {
            const isSelected = selectedPhase === phase.phase_type;
            return (
              <div
                key={phase.phase_type}
                onClick={() => setSelectedPhase(isSelected ? 'ALL' : phase.phase_type)}
                className={`p-5 rounded-xl border cursor-pointer transition-all duration-150 bg-white shadow-xs ${
                  isSelected ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-200 hover:border-slate-300'
                } space-y-3`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {phase.target_timeline}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded border font-mono ${getPhaseBadge(phase.phase_type)}`}>
                    {phase.asset_count} Assets
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">{phase.phase_title}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {phase.action_summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-600">
                  <span>Effort: <strong className="text-slate-900">{phase.total_effort_hours}h</strong></span>
                  <span>Cost: <strong className="text-emerald-700">${phase.total_cost_usd.toLocaleString()}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs font-semibold">
          <button
            onClick={() => setSelectedPhase('ALL')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedPhase === 'ALL'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Phases ({assets.length})
          </button>
          <button
            onClick={() => setSelectedPhase('PHASE_1_IMMEDIATE')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedPhase === 'PHASE_1_IMMEDIATE'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Phase 1: Immediate ({assets.filter(a => a.migration_phase === 'PHASE_1_IMMEDIATE').length})
          </button>
          <button
            onClick={() => setSelectedPhase('PHASE_2_HIGH_PRIORITY')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedPhase === 'PHASE_2_HIGH_PRIORITY'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Phase 2: High Priority ({assets.filter(a => a.migration_phase === 'PHASE_2_HIGH_PRIORITY').length})
          </button>
          <button
            onClick={() => setSelectedPhase('PHASE_3_PLANNED')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedPhase === 'PHASE_3_PLANNED'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Phase 3: Planned ({assets.filter(a => a.migration_phase === 'PHASE_3_PLANNED').length})
          </button>
          <button
            onClick={() => setSelectedPhase('PHASE_4_MONITOR')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedPhase === 'PHASE_4_MONITOR'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Phase 4: Monitor ({assets.filter(a => a.migration_phase === 'PHASE_4_MONITOR').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search roadmap assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Asset Roadmap Action Cards */}
      <div className="space-y-3">
        {filteredAssets.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No assets match the selected phase filter or search query.
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const r_str = (asset.risk_level && asset.risk_level.value) ? asset.risk_level.value : (asset.risk_level || 'MEDIUM');
            return (
              <div
                key={asset.asset_id}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition flex flex-col xl:flex-row xl:items-center justify-between gap-4"
              >
                {/* Left: Asset Details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      #{asset.migration_priority} {asset.asset_id}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      {asset.algorithm} {asset.key_size ? `(${asset.key_size}-bit)` : ''}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPhaseBadge(asset.migration_phase)}`}>
                      {asset.phase_label}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      r_str === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                      r_str === 'HIGH' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      Risk Score: {asset.risk_score}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 font-mono truncate" title={`${asset.file}:${asset.line_number || 1}`}>
                    Location: <span className="text-indigo-700">{asset.file}:{asset.line_number || 1}</span> &bull; Criticality: {asset.business_criticality}
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    <strong className="text-slate-900">Suggested Action:</strong> {asset.suggested_action}
                  </p>
                </div>

                {/* Right: Recommendation & Metrics */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between xl:justify-end gap-4 pt-3 xl:pt-0 border-t xl:border-t-0 xl:border-l border-slate-200 xl:pl-5 flex-shrink-0">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block">
                      Target PQC Replacement
                    </span>
                    <div className="font-bold text-xs text-emerald-700 font-mono">
                      {asset.recommended_pqc || 'ML-KEM-768'}
                    </div>
                    {asset.hybrid_alternative && (
                      <div className="text-[11px] text-indigo-700 font-mono truncate max-w-[180px]" title={asset.hybrid_alternative}>
                        Hybrid: {asset.hybrid_alternative}
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5 text-right sm:border-l sm:border-slate-200 sm:pl-4">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 block text-left sm:text-right">
                      Effort &amp; Cost
                    </span>
                    <div className="text-xs font-mono font-bold text-slate-800 text-left sm:text-right">
                      {asset.estimated_effort_hours}h &bull; <span className="text-emerald-700">${asset.estimated_cost_usd?.toLocaleString() || '2,400'}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 text-left sm:text-right">
                      Latency: <span className="text-amber-700 font-semibold">{asset.latency_impact}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectAsset(asset)}
                    className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition flex items-center gap-1.5 shadow-xs flex-shrink-0"
                  >
                    <span>Inspect</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
