import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  Activity, 
  Layers, 
  Cpu, 
  Terminal, 
  X, 
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function FMEAMigrationFailureEngine({ visualData, onSelectAsset }) {
  const [selectedFailureMode, setSelectedFailureMode] = useState(null);

  if (!visualData || !visualData.failureModes || visualData.failureModes.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 command-card">
        <ShieldAlert className="w-10 h-10 text-rose-500/50 mx-auto mb-3 animate-pulse" />
        <h4 className="text-base font-bold text-white mb-1">No Data Available for Visualization</h4>
        <p className="text-xs text-slate-400">Perform a cryptographic scan to generate the deterministic PQC migration failure simulation.</p>
      </div>
    );
  }

  const { stages, failureModes, highestRPNFailureMode, distribution, averageRPN, maxRPN, totalAssessed } = visualData;
  const isAllControlled = !highestRPNFailureMode || highestRPNFailureMode.rpn < 80;

  // Find stage for highest RPN mode to highlight the flow path
  const focalStage = highestRPNFailureMode ? highestRPNFailureMode.stage : 'MIGRATION';

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return {
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          border: 'border-rose-500/50',
          glow: 'shadow-[0_0_20px_rgba(239,68,68,0.35)]',
          text: 'text-rose-400',
          bar: 'bg-rose-500'
        };
      case 'HIGH':
        return {
          badge: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
          border: 'border-orange-500/50',
          glow: 'shadow-[0_0_15px_rgba(249,115,22,0.3)]',
          text: 'text-orange-400',
          bar: 'bg-orange-500'
        };
      case 'MEDIUM':
        return {
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          border: 'border-amber-500/40',
          glow: 'shadow-[0_0_10px_rgba(245,158,11,0.2)]',
          text: 'text-amber-400',
          bar: 'bg-amber-500'
        };
      default:
        return {
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          border: 'border-emerald-500/40',
          glow: 'shadow-[0_0_10px_rgba(16,185,129,0.2)]',
          text: 'text-emerald-400',
          bar: 'bg-emerald-500'
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Header & Intelligence Banner */}
      <div className="command-card p-6 border-rose-500/30 relative overflow-hidden">
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-950/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-widest text-rose-400 uppercase bg-rose-950/80 border border-rose-700/60 px-2 py-0.5 rounded">
                SIGNATURE VISUALIZATION 1
              </span>
              <span className="text-[10px] font-mono text-cyan-400 border border-cyan-800/40 bg-cyan-950/50 px-2 py-0.5 rounded">
                PQC MIGRATION FAILURE RISK (FMEA)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
              <span>PQC Migration Failure Intelligence</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              Visualizing where cryptographic migration can fail. Deterministic evaluation of transition breakdown points.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-lg bg-[#070D1E] border border-[#1E2D4A] text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Primary Focal RPN</div>
              <div className={`text-lg font-bold font-mono ${isAllControlled ? 'text-emerald-400' : 'text-rose-400'}`}>
                {highestRPNFailureMode ? `${highestRPNFailureMode.rpn} / 1000` : 'Controlled'}
              </div>
            </div>
            <div className="px-3.5 py-2 rounded-lg bg-[#070D1E] border border-[#1E2D4A] text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Avg System RPN</div>
              <div className="text-lg font-bold font-mono text-amber-400">
                {averageRPN}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Focus Alert Callout */}
        <div className={`mt-5 p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono transition-all duration-300 ${
          isAllControlled 
            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300' 
            : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <AlertTriangle className={`w-4 h-4 flex-shrink-0 ${isAllControlled ? 'text-emerald-400' : 'text-rose-400 animate-bounce'}`} />
            <div>
              <strong className="text-white">Primary Visual Focus:</strong>{' '}
              {highestRPNFailureMode ? (
                <span>
                  <strong className="underline decoration-rose-500">{highestRPNFailureMode.name}</strong> has highest calculated Risk Priority Number (RPN <span className="text-rose-300 font-bold">{highestRPNFailureMode.rpn}</span>) in stage <span className="text-cyan-300 font-bold">{highestRPNFailureMode.stage}</span>.
                </span>
              ) : (
                'All cryptographic assets exhibit controlled transition failure scores (RPN < 80).'
              )}
            </div>
          </div>
          {highestRPNFailureMode && (
            <button
              onClick={() => setSelectedFailureMode(highestRPNFailureMode)}
              className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-white text-[11px] font-mono flex items-center gap-1.5 transition self-start sm:self-auto"
            >
              <span>Inspect Focal Failure Mode</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 6-Stage System Pipeline Simulation Flow */}
      <div className="command-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>PQC MIGRATION PIPELINE &amp; FAILURE VULNERABILITY TRACE</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            6 Operational Stages &times; 8 Failure Mode Gates
          </span>
        </div>

        {/* Interactive SVG Flow Diagram */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[780px] grid grid-cols-6 gap-2.5 relative">
            {stages.map((stg, idx) => {
              const isStageFocal = focalStage.replace('_', ' ') === stg.name || focalStage === stg.id;
              return (
                <div 
                  key={stg.id}
                  className={`p-3.5 rounded-xl border relative transition-all duration-300 flex flex-col justify-between ${
                    isStageFocal && !isAllControlled
                      ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] ring-1 ring-rose-500/50'
                      : 'bg-[#0A1224] border-[#1E2D4A] hover:border-cyan-500/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                      <span className={isStageFocal && !isAllControlled ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                        STAGE 0{idx + 1}
                      </span>
                      {isStageFocal && !isAllControlled && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      )}
                    </div>
                    <div className="text-xs font-bold font-mono text-white tracking-tight">
                      {stg.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 mt-1 line-clamp-1">
                      {stg.sub}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Gate Status:</span>
                    <span className={isStageFocal && !isAllControlled ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                      {isStageFocal && !isAllControlled ? '⚠ High Risk' : '✓ Verified'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 8 Interactive Failure Mode Nodes */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              <span>8 Canonical PQC Migration Failure Modes</span>
            </h3>
            <p className="text-xs text-slate-400">
              Calculated from active CBOM inventory: <span className="text-cyan-300 font-mono">Severity (S) &times; Occurrence (O) &times; Detection (D) = RPN</span>
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Click any failure node to inspect affected assets &amp; mitigations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {failureModes.map((mode) => {
            const style = getPriorityStyle(mode.priority);
            const isFocal = highestRPNFailureMode?.id === mode.id && !isAllControlled;
            const isSelected = selectedFailureMode?.id === mode.id;

            return (
              <div
                key={mode.id}
                onClick={() => setSelectedFailureMode(mode)}
                className={`command-card p-4.5 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                  isSelected 
                    ? 'ring-2 ring-cyan-400 bg-[#0E1B38]' 
                    : isFocal 
                      ? `${style.border} ${style.glow} bg-rose-950/20` 
                      : 'hover:border-cyan-500/50 hover:bg-[#0B1428]'
                }`}
              >
                {isFocal && (
                  <div className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-bl uppercase tracking-wider animate-pulse">
                    Focal Risk
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {mode.stage}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${style.badge}`}>
                      {mode.priority}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-1.5">
                    <span>{mode.name}</span>
                  </h4>

                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mb-3">
                    {mode.description}
                  </p>
                </div>

                <div>
                  {/* S * O * D Calculus Pills */}
                  <div className="grid grid-cols-3 gap-1.5 p-2 rounded-lg bg-[#050A14] border border-[#1E2D4A] mb-3 text-center">
                    <div>
                      <div className="text-[9px] font-mono text-slate-400">SEV (S)</div>
                      <div className="text-xs font-bold font-mono text-white">{mode.severity}/10</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-slate-400">OCC (O)</div>
                      <div className="text-xs font-bold font-mono text-white">{mode.occurrence}/10</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono text-slate-400">DET (D)</div>
                      <div className="text-xs font-bold font-mono text-white">{mode.detection}/10</div>
                    </div>
                  </div>

                  {/* Calculated RPN Score Bar */}
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">RPN Score:</span>
                    <span className={`font-bold ${style.text}`}>{mode.rpn} / 1000</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#050A14] rounded-full overflow-hidden border border-[#1E2D4A]">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                      style={{ width: `${Math.min(100, Math.round((mode.rpn / 1000) * 100))}%` }}
                    />
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[10px] font-mono text-cyan-400">
                    <span>{mode.assetCount} Affected Assets</span>
                    <span className="flex items-center gap-1">Details &rarr;</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RPN Severity Distribution Visual Chart */}
      <div className="command-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>RPN DISTRIBUTION ACROSS CRYPTOGRAPHIC PORTFOLIO ({totalAssessed} ASSETS)</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Max RPN: <strong className="text-rose-400 font-mono">{maxRPN}</strong> / 1000
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40">
            <div className="flex items-center justify-between text-xs font-mono text-rose-400 mb-1">
              <span>CRITICAL (RPN &ge; 250)</span>
              <strong>{distribution.critical}</strong>
            </div>
            <div className="text-xl font-bold font-mono text-rose-400 mb-2">{distribution.criticalPct}%</div>
            <div className="w-full h-2 bg-[#050A14] rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${distribution.criticalPct}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-orange-950/30 border border-orange-500/40">
            <div className="flex items-center justify-between text-xs font-mono text-orange-400 mb-1">
              <span>HIGH (150 – 249)</span>
              <strong>{distribution.high}</strong>
            </div>
            <div className="text-xl font-bold font-mono text-orange-400 mb-2">{distribution.highPct}%</div>
            <div className="w-full h-2 bg-[#050A14] rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 transition-all duration-500" style={{ width: `${distribution.highPct}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-1">
              <span>MEDIUM (80 – 149)</span>
              <strong>{distribution.medium}</strong>
            </div>
            <div className="text-xl font-bold font-mono text-amber-400 mb-2">{distribution.mediumPct}%</div>
            <div className="w-full h-2 bg-[#050A14] rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: `${distribution.mediumPct}%` }} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-1">
              <span>LOW (&lt; 80)</span>
              <strong>{distribution.low}</strong>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400 mb-2">{distribution.lowPct}%</div>
            <div className="w-full h-2 bg-[#050A14] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${distribution.lowPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Failure Mode Detailed Inspector Modal / Drawer */}
      {selectedFailureMode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="command-card max-w-2xl w-full p-6 border-cyan-500/40 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#1E2D4A] pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase bg-cyan-950/80 border border-cyan-800/60 px-2 py-0.5 rounded">
                    FAILURE MODE INSPECTION
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    STAGE: {selectedFailureMode.stage}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <span>{selectedFailureMode.name}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedFailureMode(null)}
                className="p-1.5 rounded-lg bg-[#070D1E] hover:bg-[#1E2D4A] text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              {selectedFailureMode.description}
            </p>

            {/* S * O * D Breakdown Box */}
            <div className="grid grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-[#050A14] border border-[#1E2D4A] text-center font-mono">
              <div>
                <span className="text-[10px] text-slate-400">Severity</span>
                <div className="text-base font-bold text-white">{selectedFailureMode.severity}/10</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Occurrence</span>
                <div className="text-base font-bold text-white">{selectedFailureMode.occurrence}/10</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Detection</span>
                <div className="text-base font-bold text-white">{selectedFailureMode.detection}/10</div>
              </div>
              <div>
                <span className="text-[10px] text-rose-400 font-bold">Total RPN</span>
                <div className="text-base font-bold text-rose-400">{selectedFailureMode.rpn}/1000</div>
              </div>
            </div>

            {/* Affected Assets List */}
            <div>
              <div className="text-xs font-bold font-mono text-white mb-2 flex items-center justify-between">
                <span>Affected Assets ({selectedFailureMode.affectedAssets.length})</span>
                <span className="text-[10px] text-slate-400">Real Discovery Telemetry</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedFailureMode.affectedAssets.map((asset) => (
                  <div
                    key={asset.asset_id}
                    onClick={() => {
                      if (onSelectAsset) onSelectAsset(asset);
                      setSelectedFailureMode(null);
                    }}
                    className="p-2.5 rounded-lg bg-[#0A1224] border border-[#1E2D4A] hover:border-cyan-500/50 cursor-pointer flex items-center justify-between text-xs font-mono transition"
                  >
                    <div>
                      <div className="text-cyan-300 font-bold">{asset.asset_id} &bull; {asset.algorithm}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{asset.file}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded">
                        Target: {asset.recommended_pqc || 'ML-KEM-768'}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mitigation Control Action */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs font-mono text-emerald-300">
              <strong className="text-white block mb-1">Recommended Mitigation Action:</strong>
              <p className="text-[11px] leading-relaxed text-emerald-200">
                Deploy hybrid key exchange wrappers (e.g. X25519 + ML-KEM-768) and automated Known Answer Test (KAT) regression harnesses to eliminate {selectedFailureMode.name.toLowerCase()} without downtime.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedFailureMode(null)}
                className="px-4 py-2 rounded-lg bg-[#0A1224] hover:bg-[#1E2D4A] border border-[#1E2D4A] text-white text-xs font-mono transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
