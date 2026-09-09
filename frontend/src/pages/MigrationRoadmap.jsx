import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  Zap, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useVisualIntelligenceData } from '../hooks/useVisualIntelligenceData';
import PQCMigrationJourneyVisualizer from '../components/visuals/PQCMigrationJourneyVisualizer';

export default function MigrationRoadmap({ cbomReport, onSelectAsset }) {
  const [selectedPhase, setSelectedPhase] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { migrationJourneyData } = useVisualIntelligenceData(cbomReport);

  if (!cbomReport) {
    return (
      <div className="p-12 text-center text-slate-400 command-card max-w-xl mx-auto my-12">
        <Compass className="w-12 h-12 text-cyan-500/50 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-bold text-white mb-2">No Active Migration Roadmap</h3>
        <p className="text-xs text-slate-400 mb-4">Execute a cryptographic scan in Scan Studio to generate a phased PQC transition roadmap.</p>
      </div>
    );
  }

  const rm = cbomReport.roadmap_report;
  const assets = cbomReport.assets || [];

  // Filter assets
  const filteredAssets = assets.filter((a) => {
    const matchesPhase = selectedPhase === 'ALL' || a.migration_phase === selectedPhase;
    const matchesSearch = !searchQuery || 
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
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'PHASE_2_HIGH_PRIORITY':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'PHASE_3_PLANNED':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto command-grid">
      
      {/* SIGNATURE VISUALIZATION 2: PQC MIGRATION JOURNEY */}
      <PQCMigrationJourneyVisualizer 
        visualData={migrationJourneyData}
        assets={assets}
        onSelectAsset={onSelectAsset}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl command-card">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs font-mono">
          <button
            onClick={() => setSelectedPhase('ALL')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedPhase === 'ALL'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
            }`}
          >
            All Phases ({assets.length})
          </button>
          <button
            onClick={() => setSelectedPhase('PHASE_1_IMMEDIATE')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedPhase === 'PHASE_1_IMMEDIATE'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
            }`}
          >
            Phase 1 ({assets.filter(a => a.migration_phase === 'PHASE_1_IMMEDIATE').length})
          </button>
          <button
            onClick={() => setSelectedPhase('PHASE_2_HIGH_PRIORITY')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedPhase === 'PHASE_2_HIGH_PRIORITY'
                ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
            }`}
          >
            Phase 2 ({assets.filter(a => a.migration_phase === 'PHASE_2_HIGH_PRIORITY').length})
          </button>
          <button
            onClick={() => setSelectedPhase('PHASE_3_PLANNED')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedPhase === 'PHASE_3_PLANNED'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
            }`}
          >
            Phase 3 ({assets.filter(a => a.migration_phase === 'PHASE_3_PLANNED').length})
          </button>
          <button
            onClick={() => setSelectedPhase('PHASE_4_MONITOR')}
            className={`px-3 py-1.5 rounded-lg transition ${
              selectedPhase === 'PHASE_4_MONITOR'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
            }`}
          >
            Phase 4 ({assets.filter(a => a.migration_phase === 'PHASE_4_MONITOR').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            placeholder="Search roadmap assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Asset Roadmap Action Cards */}
      <div className="space-y-3">
        {filteredAssets.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-mono text-xs command-card">
            No assets match the selected phase filter or search query.
          </div>
        ) : (
          filteredAssets.map((asset) => {
            const r_str = (asset.risk_level && asset.risk_level.value) ? asset.risk_level.value : (asset.risk_level || 'MEDIUM');
            return (
              <div
                key={asset.asset_id}
                className="p-5 rounded-xl command-card hover:border-cyan-500/50 transition flex flex-col xl:flex-row xl:items-center justify-between gap-4 font-mono text-xs"
              >
                {/* Left: Asset Details */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                      #{asset.migration_priority} {asset.asset_id}
                    </span>
                    <span className="font-bold text-sm text-white">
                      {asset.algorithm} {asset.key_size ? `(${asset.key_size}-bit)` : ''}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPhaseBadge(asset.migration_phase)}`}>
                      {asset.phase_label || asset.migration_phase}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r_str === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      r_str === 'HIGH' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' :
                      'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}>
                      Risk Score: {asset.risk_score}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 truncate font-mono" title={`${asset.file}:${asset.line_number || 1}`}>
                    Location: <span className="text-cyan-300">{asset.file}:{asset.line_number || 1}</span> &bull; Criticality: <span className="text-amber-400">{asset.business_criticality}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    <strong className="text-cyan-400 font-mono">Suggested Action:</strong> {asset.suggested_action}
                  </p>
                </div>

                {/* Right: Recommendation & Metrics */}
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between xl:justify-end gap-4 pt-3 xl:pt-0 border-t xl:border-t-0 xl:border-l border-[#1E2D4A] xl:pl-5 flex-shrink-0">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">
                      Target PQC Replacement
                    </span>
                    <div className="font-bold text-xs text-emerald-400">
                      {asset.recommended_pqc || 'ML-KEM-768'}
                    </div>
                    {asset.hybrid_alternative && (
                      <div className="text-[10px] text-cyan-300 truncate max-w-[180px]" title={asset.hybrid_alternative}>
                        Hybrid: {asset.hybrid_alternative}
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5 text-right sm:border-l sm:border-[#1E2D4A] sm:pl-4">
                    <span className="text-[10px] uppercase text-slate-400 block text-left sm:text-right font-semibold">
                      Effort &amp; Cost
                    </span>
                    <div className="text-xs font-bold text-white text-left sm:text-right">
                      {asset.estimated_effort_hours}h &bull; <span className="text-emerald-400">${asset.estimated_cost_usd?.toLocaleString() || '2,400'}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 text-left sm:text-right">
                      Latency: <span className="text-amber-400 font-semibold">{asset.latency_impact}</span>
                    </div>
                  </div>

                  {onSelectAsset && (
                    <button
                      onClick={() => onSelectAsset(asset)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0D1730] hover:bg-cyan-500/20 text-cyan-400 border border-[#1E2D4A] hover:border-cyan-500/50 transition flex items-center gap-1.5 flex-shrink-0"
                    >
                      <span>Inspect</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
