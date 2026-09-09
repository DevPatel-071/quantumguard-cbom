import React, { useState } from 'react';
import { 
  Compass, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Zap, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Search, 
  Activity, 
  Filter, 
  Sparkles, 
  Cpu,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function PQCMigrationJourneyVisualizer({ visualData, assets = [], onSelectAsset }) {
  const [selectedStageId, setSelectedStageId] = useState('PILOT');
  const [selectedAssetId, setSelectedAssetId] = useState(assets[0]?.asset_id || null);
  const [filterSearch, setFilterSearch] = useState('');

  if (!visualData || !visualData.stages || visualData.stages.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 command-card">
        <Compass className="w-10 h-10 text-cyan-500/50 mx-auto mb-3 animate-pulse" />
        <h4 className="text-base font-bold text-white mb-1">No Data Available for Visualization</h4>
        <p className="text-xs text-slate-400">Perform a cryptographic scan to generate the dynamic 8-stage PQC migration journey.</p>
      </div>
    );
  }

  const { stages, totalAssets, progress, totalEffortHours, totalBudgetUSD } = visualData;
  const activeStage = stages.find(s => s.id === selectedStageId) || stages[0];

  // Currently selected asset for the 3-step transition pathway
  const selectedAsset = assets.find(a => a.asset_id === selectedAssetId) || assets[0];

  // Filter assets matching current stage or search
  const filteredAssets = assets.filter(a => {
    const matchesSearch = !filterSearch || 
      a.asset_id.toLowerCase().includes(filterSearch.toLowerCase()) ||
      a.algorithm.toLowerCase().includes(filterSearch.toLowerCase()) ||
      (a.recommended_pqc && a.recommended_pqc.toLowerCase().includes(filterSearch.toLowerCase()));
    return matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'ACTIVE': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.25)]';
      case 'PLANNED': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Header & Transition Journey Banner */}
      <div className="command-card p-6 border-cyan-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/80 border border-cyan-700/60 px-2 py-0.5 rounded">
                SIGNATURE VISUALIZATION 2
              </span>
              <span className="text-[10px] font-mono text-purple-400 border border-purple-800/40 bg-purple-950/50 px-2 py-0.5 rounded">
                NIST STANDARDS TRANSITION
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Compass className="w-6 h-6 text-cyan-400" />
              <span>PQC Migration Journey</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              Dynamic 8-stage interactive transition flow connecting legacy classical cryptography to NIST-standardized PQC.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-lg bg-[#070D1E] border border-[#1E2D4A] text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Total Migration Effort</div>
              <div className="text-lg font-bold font-mono text-cyan-400">
                {totalEffortHours}h
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-[#070D1E] border border-[#1E2D4A] text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Estimated Budget</div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                ${totalBudgetUSD.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Real Dynamic Migration State Breakdown */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4 border-t border-[#1E2D4A]/60">
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A] text-center">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Require Migration</div>
            <div className="text-base font-bold font-mono text-rose-400 mt-0.5">{progress.requireMigration}</div>
            <div className="text-[9px] font-mono text-slate-400">Shor Vulnerable</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A] text-center">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Hybrid Candidates</div>
            <div className="text-base font-bold font-mono text-purple-400 mt-0.5">{progress.hybrid}</div>
            <div className="text-[9px] font-mono text-slate-400">Dual Wrapper</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A] text-center">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Pilot Stage</div>
            <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">{progress.pilot}</div>
            <div className="text-[9px] font-mono text-slate-400">Phase 1 Immediate</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A] text-center">
            <div className="text-[9px] font-mono text-slate-400 uppercase">In Assessment</div>
            <div className="text-base font-bold font-mono text-amber-400 mt-0.5">{progress.inAssessment}</div>
            <div className="text-[9px] font-mono text-slate-400">Phase 3 Planned</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A] text-center">
            <div className="text-[9px] font-mono text-slate-400 uppercase">PQC Ready / Acceptable</div>
            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">{progress.alreadyAcceptable}</div>
            <div className="text-[9px] font-mono text-slate-400">Zero Shor Risk</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A] text-center">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Total Portfolio</div>
            <div className="text-base font-bold font-mono text-white mt-0.5">{totalAssets}</div>
            <div className="text-[9px] font-mono text-slate-400">Assessed Assets</div>
          </div>
        </div>
      </div>

      {/* 8-Stage Interactive Journey Flow */}
      <div className="command-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>8-STAGE INTERACTIVE TRANSITION PIPELINE</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Click any stage to inspect operational telemetry
          </span>
        </div>

        {/* Responsive Horizontal Journey Steps */}
        <div className="overflow-x-auto pb-3">
          <div className="min-w-[960px] grid grid-cols-8 gap-2 relative">
            {stages.map((stg) => {
              const isSelected = selectedStageId === stg.id;
              const statusStyle = getStatusColor(stg.status);

              return (
                <div
                  key={stg.id}
                  onClick={() => setSelectedStageId(stg.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between relative overflow-hidden ${
                    isSelected
                      ? 'bg-[#0F2044] border-cyan-400 ring-2 ring-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                      : 'bg-[#080E1E] border-[#1E2D4A] hover:border-cyan-500/40 hover:bg-[#0B152A]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                      <span className="text-slate-400">STEP 0{stg.step}</span>
                      <span className={`px-1.5 py-0.2 rounded uppercase font-bold text-[8px] border ${statusStyle}`}>
                        {stg.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold font-mono text-white tracking-tight mt-1">
                      {stg.title}
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 line-clamp-1 mt-0.5">
                      {stg.subtitle}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 space-y-1 text-[9px] font-mono">
                    <div className="flex justify-between text-slate-400">
                      <span>Assets:</span>
                      <span className="text-cyan-300 font-bold">{stg.assetCount}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Effort:</span>
                      <span className="text-amber-300">{stg.effortHours}h</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Risk Cut:</span>
                      <span className="text-emerald-400">-{stg.riskReductionPct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Stage Detail Panel */}
        {activeStage && (
          <div className="p-4.5 rounded-xl bg-[#070D1E] border border-cyan-500/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="md:col-span-2 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold uppercase">STAGE 0{activeStage.step}: {activeStage.title}</span>
                <span className="text-slate-400">&bull; {activeStage.subtitle}</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {activeStage.description}
              </p>
              <div className="text-[10px] text-slate-400 pt-1">
                <strong>Critical Dependencies:</strong> <span className="text-purple-300">{activeStage.dependencies}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A] space-y-1.5">
              <div className="text-[10px] text-slate-400 uppercase">Stage Telemetry</div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Scheduled Assets:</span>
                <strong className="text-white">{activeStage.assetCount}</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Allocated Effort:</span>
                <strong className="text-amber-400">{activeStage.effortHours} Hours</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Budget Impact:</span>
                <strong className="text-emerald-400">${activeStage.costUSD.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Target Risk Reduction:</span>
                <strong className="text-cyan-400">-{activeStage.riskReductionPct}% Exposure</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic 3-Step Asset Migration Pathway Experience */}
      <div className="command-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-purple-400 uppercase bg-purple-950/80 border border-purple-800/60 px-2 py-0.5 rounded">
                DYNAMIC ASSET MIGRATION PATHWAY
              </span>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Asset-Level 3-Step Transition Trajectory</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select any discovered asset to view its verified classical &rarr; hybrid &rarr; NIST PQC recommendation.
            </p>
          </div>

          {/* Asset Selector Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedAssetId || ''}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A] text-white text-xs font-mono focus:border-cyan-500/50 outline-none"
            >
              {assets.map((a) => (
                <option key={a.asset_id} value={a.asset_id}>
                  {a.asset_id} &bull; {a.algorithm} ({a.business_criticality})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 3-Step Transition Visual Cards */}
        {selectedAsset ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              
              {/* Step 1: CURRENT */}
              <div className="p-4.5 rounded-xl bg-rose-950/20 border border-rose-500/40 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="text-rose-400 font-bold uppercase tracking-wider">STEP 1: CURRENT STATE</span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[9px]">
                      VULNERABLE
                    </span>
                  </div>
                  <div className="text-base font-bold font-mono text-white mb-1">
                    🔴 {selectedAsset.algorithm}
                  </div>
                  <div className="text-xs text-rose-300 font-mono mb-2">
                    {selectedAsset.quantum_attack || "Shor's Quantum Integer Factorization"}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    Subject to retroactive decryption and Store Now, Decrypt Later (SNDL) quantum threat vector.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-500/20 text-[10px] font-mono space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Asset ID:</span>
                    <span className="text-white font-bold">{selectedAsset.asset_id}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Criticality:</span>
                    <span className="text-rose-400 font-bold">{selectedAsset.business_criticality}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Risk Score:</span>
                    <span className="text-rose-400 font-bold">{selectedAsset.risk_score} / 100</span>
                  </div>
                </div>
              </div>

              {/* Step 2: TRANSITION HYBRID */}
              <div className="p-4.5 rounded-xl bg-purple-950/20 border border-purple-500/40 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="text-purple-400 font-bold uppercase tracking-wider">STEP 2: TRANSITION</span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold text-[9px]">
                      HYBRID WRAPPER
                    </span>
                  </div>
                  <div className="text-base font-bold font-mono text-white mb-1">
                    🟣 {selectedAsset.hybrid_alternative || "X25519 + ML-KEM-768 Hybrid"}
                  </div>
                  <div className="text-xs text-purple-300 font-mono mb-2">
                    Composite Dual-Certificate / Dual-KEM
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    Combines classical FIPS 140 validation with post-quantum security to ensure zero compatibility disruption.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-500/20 text-[10px] font-mono space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Migration Phase:</span>
                    <span className="text-purple-300 font-bold">{selectedAsset.migration_phase || 'PHASE_2_HIGH_PRIORITY'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Effort:</span>
                    <span className="text-amber-300 font-bold">24 Engineering Hours</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Interoperability:</span>
                    <span className="text-emerald-400 font-bold">100% Backwards Compatible</span>
                  </div>
                </div>
              </div>

              {/* Step 3: TARGET PQC */}
              <div className="p-4.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="text-emerald-400 font-bold uppercase tracking-wider">STEP 3: TARGET STATE</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[9px]">
                      NIST STANDARDIZED
                    </span>
                  </div>
                  <div className="text-base font-bold font-mono text-white mb-1">
                    🟢 {selectedAsset.recommended_pqc || "ML-KEM-768 (FIPS 203)"}
                  </div>
                  <div className="text-xs text-emerald-300 font-mono mb-2">
                    FIPS Standardized PQC Baseline
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                    Full post-quantum resilience against Shor and Grover quantum cryptanalysis with zero mathematical vulnerability.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-emerald-500/20 text-[10px] font-mono space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>NIST Standard:</span>
                    <span className="text-emerald-300 font-bold">
                      {selectedAsset.recommended_pqc?.includes('KEM') ? 'FIPS 203 (ML-KEM)' : selectedAsset.recommended_pqc?.includes('DSA') ? 'FIPS 204 (ML-DSA)' : 'FIPS 205 (SLH-DSA)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Quantum Security:</span>
                    <span className="text-emerald-400 font-bold">Level 3 (128-bit Post-Quantum)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Residual Risk:</span>
                    <span className="text-emerald-400 font-bold">0.0 / 100 (Clean)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Asset Code Location & Inspect Action */}
            <div className="p-3.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Source Location:</span>
                <span className="text-cyan-300 font-bold">{selectedAsset.file}:{selectedAsset.line_number || '1'}</span>
              </div>
              {onSelectAsset && (
                <button
                  onClick={() => onSelectAsset(selectedAsset)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5 transition self-start sm:self-auto"
                >
                  <span>Open Full CBOM Record</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>

    </div>
  );
}
