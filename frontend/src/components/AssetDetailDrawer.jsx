import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Code, 
  Network,
  Cpu,
  Info,
  Layers,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';

export default function AssetDetailDrawer({ asset, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'risk' | 'fmea' | 'dependencies' | 'pqc'

  if (!asset) return null;

  const r_str = (asset.risk_level && asset.risk_level.value) ? asset.risk_level.value : (asset.risk_level || 'MEDIUM');
  const factors = asset.risk_factor_breakdown || [];
  const fmea = asset.fmea;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#080E1E] border-l border-[#1E2D4A] h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-200 command-grid"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-cyan-400 text-xs">
                #{asset.migration_priority} {asset.asset_id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-mono">
                {asset.phase_label || 'Phase 1: Immediate'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-mono">
              <span>{asset.algorithm}</span>
              {asset.key_size && (
                <span className="text-sm font-normal text-slate-400 font-mono">({asset.key_size}-bit)</span>
              )}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {asset.file}:{asset.line_number || 1} &bull; <span className="text-cyan-300">{asset.usage}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#050A14] hover:bg-[#0D1730] text-slate-400 hover:text-white border border-[#1E2D4A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 rounded-xl bg-[#050A14] border border-[#1E2D4A] text-xs font-mono">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'risk', label: 'Why Risky?' },
            { id: 'fmea', label: 'FMEA (RPN)' },
            { id: 'dependencies', label: 'Dependencies' },
            { id: 'pqc', label: 'PQC Plan' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-2 rounded-lg transition text-center truncate ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold shadow-cyan-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#050A14] border border-rose-500/30 space-y-1">
                <span className="text-[10px] text-rose-400 block font-semibold uppercase">Risk Score</span>
                <span className="font-bold text-base text-rose-400">{asset.risk_score} / 100</span>
              </div>
              <div className="p-3 rounded-xl bg-[#050A14] border border-orange-500/30 space-y-1">
                <span className="text-[10px] text-orange-400 block font-semibold uppercase">FMEA RPN</span>
                <span className="font-bold text-base text-orange-400">{fmea ? fmea.rpn : 288} / 1000</span>
              </div>
              <div className="p-3 rounded-xl bg-[#050A14] border border-cyan-500/30 space-y-1">
                <span className="text-[10px] text-cyan-400 block font-semibold uppercase">Target Phase</span>
                <span className="font-bold text-base text-cyan-400">{asset.migration_phase?.replace('PHASE_', 'P') || 'P1'}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#050A14] border border-emerald-500/30 space-y-1">
                <span className="text-[10px] text-emerald-400 block font-semibold uppercase">Est. Budget</span>
                <span className="font-bold text-base text-emerald-400">${asset.estimated_cost_usd?.toLocaleString() || '2,800'}</span>
              </div>
            </div>

            {/* Plain English Action */}
            <div className="p-4 rounded-xl bg-[#050A14] border border-cyan-500/40 space-y-1 text-xs font-mono">
              <span className="font-bold text-cyan-400 text-[11px] block uppercase">
                Suggested Migration Strategy:
              </span>
              <p className="text-slate-300 leading-relaxed font-sans">
                {asset.suggested_action || 'Begin transition to NIST FIPS 203/204 standardized algorithms.'}
              </p>
            </div>

            {/* Source Code Evidence */}
            {asset.code_snippet && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Source Code Evidence</span>
                  </span>
                  <span className="text-cyan-400">Line {asset.line_number || 1}</span>
                </div>
                <pre className="p-4 rounded-xl bg-[#040711] border border-[#1E2D4A] text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                  <code>{asset.code_snippet}</code>
                </pre>
              </div>
            )}
          </div>
        )}

        {/* 2. RISK BREAKDOWN TAB */}
        {activeTab === 'risk' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#050A14] border border-rose-500/40 space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Deterministic Risk Factor Point Allocation</span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-black bg-rose-950/60 text-rose-300 border border-rose-500/40">
                  {asset.risk_score} / 100
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {asset.risk_explanation || `Asset '${asset.algorithm}' carries ${r_str} quantum vulnerability.`}
              </p>
            </div>

            {factors.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                  Point Contribution Breakdown:
                </span>
                <div className="space-y-2">
                  {factors.map((f, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A] flex items-center justify-between text-xs font-mono"
                    >
                      <div className="space-y-0.5">
                        <span className="text-white font-bold">{f.factor_name}</span>
                        <p className="text-[11px] text-slate-400 font-sans">{f.description}</p>
                      </div>
                      <span className={`font-black text-sm flex-shrink-0 ml-3 ${f.score_points >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {f.score_points >= 0 ? `+${f.score_points}` : f.score_points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. QUANTUM FMEA TAB */}
        {activeTab === 'fmea' && (
          <div className="space-y-4">
            {fmea ? (
              <div className="space-y-4 font-mono">
                <div className="p-5 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white uppercase flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>FMEA Quantum Failure Mode Analysis</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/60 text-rose-300 border border-rose-500/40">
                      RPN: {fmea.rpn} ({fmea.priority})
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs pt-2">
                    <div className="p-2.5 rounded-lg bg-[#080E1E] border border-rose-500/30">
                      <span className="text-[10px] text-rose-400 block uppercase font-semibold">Severity (S)</span>
                      <span className="font-bold text-base text-rose-400">{fmea.severity} / 10</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#080E1E] border border-orange-500/30">
                      <span className="text-[10px] text-orange-400 block uppercase font-semibold">Occurrence (O)</span>
                      <span className="font-bold text-base text-orange-400">{fmea.occurrence} / 10</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#080E1E] border border-cyan-500/30">
                      <span className="text-[10px] text-cyan-400 block uppercase font-semibold">Detection (D)</span>
                      <span className="font-bold text-base text-cyan-400">{fmea.detection} / 10</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] space-y-1">
                    <span className="font-bold text-slate-300 text-[11px] block uppercase">Failure Mode:</span>
                    <p className="text-slate-300 font-sans">{fmea.failure_mode}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] space-y-1">
                    <span className="font-bold text-slate-300 text-[11px] block uppercase">Potential Effect:</span>
                    <p className="text-slate-300 font-sans">{fmea.potential_effect}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#050A14] border border-cyan-500/30 space-y-1">
                    <span className="font-bold text-cyan-400 text-[11px] block uppercase">Why This RPN:</span>
                    <p className="text-slate-300 leading-relaxed font-sans">{fmea.why_this_rpn}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 text-xs font-mono command-card">
                No FMEA record calculated for this asset.
              </div>
            )}
          </div>
        )}

        {/* 4. DEPENDENCIES TAB */}
        {activeTab === 'dependencies' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-3 text-xs font-mono">
              <div className="flex items-center gap-2 font-bold text-white uppercase">
                <Network className="w-4 h-4 text-cyan-400" />
                <span>Upstream &amp; Downstream Dependency Trace</span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-[#080E1E] border border-[#1E2D4A]">
                  <span className="text-[10px] text-slate-400 block font-sans">Upstream Cryptographic Library:</span>
                  <span className="font-bold text-cyan-400 text-sm">{asset.upstream_package || asset.library || 'Standard Cryptography'}</span>
                </div>

                <div className="p-3 rounded-lg bg-[#080E1E] border border-[#1E2D4A]">
                  <span className="text-[10px] text-slate-400 block font-sans">Caller Source File:</span>
                  <span className="font-bold text-indigo-400 text-xs">{asset.file} (Line {asset.line_number || 1})</span>
                </div>

                <div className="p-3 rounded-lg bg-[#080E1E] border border-[#1E2D4A]">
                  <span className="text-[10px] text-slate-400 block font-sans">Functional Purpose:</span>
                  <span className="text-slate-200 text-xs">{asset.usage}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. PQC & MIGRATION TAB */}
        {activeTab === 'pqc' && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-[#050A14] border border-emerald-500/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                  NIST Standardized Target (FIPS 203/204)
                </span>
                <div className="text-sm font-bold text-emerald-400">{asset.recommended_pqc || 'ML-KEM-768'}</div>
                <p className="text-[11px] text-slate-400 font-sans">Pure lattice-based post-quantum replacement.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#050A14] border border-cyan-500/40 space-y-1">
                <span className="text-[10px] font-bold uppercase text-cyan-400 block">
                  Transitional Hybrid Alternative
                </span>
                <div className="text-sm font-bold text-cyan-400">{asset.hybrid_alternative || 'X25519 + ML-KEM-768'}</div>
                <p className="text-[11px] text-slate-400 font-sans">Dual classical + PQC protection for backward compatibility.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-2">
              <span className="font-bold text-white block uppercase">Financial &amp; Effort Projection:</span>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Engineering Effort:</span>
                <span className="text-white font-bold">{asset.estimated_effort_hours} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Migration Cost:</span>
                <span className="text-emerald-400 font-bold">${asset.estimated_cost_usd?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Latency Overhead Impact:</span>
                <span className="text-amber-400 font-bold">{asset.latency_impact}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
