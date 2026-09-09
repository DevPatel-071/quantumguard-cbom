import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Code, 
  Network,
  Cpu,
  Info 
} from 'lucide-react';

export default function AssetDetailDrawer({ asset, onClose }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'risk' | 'fmea' | 'dependencies' | 'pqc'

  if (!asset) return null;

  const r_str = (asset.risk_level && asset.risk_level.value) ? asset.risk_level.value : (asset.risk_level || 'MEDIUM');
  const factors = asset.risk_factor_breakdown || [];
  const fmea = asset.fmea;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white border-l border-slate-200 h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-blue-700 text-xs">
                #{asset.migration_priority} {asset.asset_id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                {asset.phase_label || 'Phase 1: Immediate'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 font-sans">
              <span>{asset.algorithm}</span>
              {asset.key_size && (
                <span className="text-sm font-normal text-slate-500 font-mono">({asset.key_size}-bit)</span>
              )}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              {asset.file}:{asset.line_number || 1} &bull; {asset.usage}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 border border-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'risk', label: 'Why Risky? (+pts)' },
            { id: 'fmea', label: 'FMEA (RPN)' },
            { id: 'dependencies', label: 'Dependencies' },
            { id: 'pqc', label: 'PQC & Migration' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-1.5 px-2 rounded-lg transition text-center ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 font-bold border border-slate-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 block font-medium">Risk Score</span>
                <span className="font-bold text-base text-rose-600 font-mono">{asset.risk_score} / 100</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 block font-medium">FMEA RPN</span>
                <span className="font-bold text-base text-amber-600 font-mono">{fmea ? fmea.rpn : 288} / 1000</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 block font-medium">Target Phase</span>
                <span className="font-bold text-base text-blue-700 font-mono">{asset.migration_phase?.replace('PHASE_', 'P') || 'P1'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 block font-medium">Est. Budget</span>
                <span className="font-bold text-base text-emerald-600 font-mono">${asset.estimated_cost_usd?.toLocaleString() || '2,800'}</span>
              </div>
            </div>

            {/* Plain English Action */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-1 text-xs">
              <span className="font-bold text-slate-800 text-[11px] block">
                Suggested Migration Strategy:
              </span>
              <p className="text-slate-700 leading-relaxed">
                {asset.suggested_action || 'Begin transition to NIST FIPS 203/204 standardized algorithms.'}
              </p>
            </div>

            {/* Source Code Evidence */}
            {asset.code_snippet && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 font-mono">
                  <span className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Code className="w-3.5 h-3.5 text-blue-600" />
                    <span>Source Code Evidence</span>
                  </span>
                  <span>Line {asset.line_number || 1}</span>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                  <code>{asset.code_snippet}</code>
                </pre>
              </div>
            )}
          </div>
        )}

        {/* 2. RISK BREAKDOWN TAB */}
        {activeTab === 'risk' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Deterministic Risk Factor Point Allocation</span>
                </div>
                <span className="px-2.5 py-1 rounded-md text-xs font-black bg-rose-100 text-rose-800 font-mono border border-rose-200">
                  {asset.risk_score} / 100
                </span>
              </div>

              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {asset.risk_explanation || `Asset '${asset.algorithm}' carries ${r_str} quantum vulnerability.`}
              </p>
            </div>

            {factors.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Point Contribution Breakdown:
                </span>
                <div className="space-y-2">
                  {factors.map((f, idx) => (
                    <div 
                      key={idx} 
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono"
                    >
                      <div className="space-y-0.5">
                        <span className="text-slate-900 font-bold">{f.factor_name}</span>
                        <p className="text-[11px] text-slate-600 font-sans">{f.description}</p>
                      </div>
                      <span className={`font-black text-sm flex-shrink-0 ml-3 ${f.score_points >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
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
              <div className="space-y-4">
                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>FMEA Quantum Failure Analysis</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      RPN: {fmea.rpn} ({fmea.priority})
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono pt-2">
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                      <span className="text-[10px] text-slate-500 block">Severity (S)</span>
                      <span className="font-bold text-base text-rose-600">{fmea.severity} / 10</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                      <span className="text-[10px] text-slate-500 block">Occurrence (O)</span>
                      <span className="font-bold text-base text-amber-600">{fmea.occurrence} / 10</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                      <span className="text-[10px] text-slate-500 block">Detection (D)</span>
                      <span className="font-bold text-base text-blue-600">{fmea.detection} / 10</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 text-[11px] block">Failure Mode:</span>
                    <p className="text-slate-700">{fmea.failure_mode}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-800 text-[11px] block">Potential Effect:</span>
                    <p className="text-slate-700">{fmea.potential_effect}</p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-blue-700 text-[11px] block">Why This RPN:</span>
                    <p className="text-slate-700 leading-relaxed">{fmea.why_this_rpn}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-500 text-xs">
                No FMEA record calculated for this asset.
              </div>
            )}
          </div>
        )}

        {/* 4. DEPENDENCIES TAB */}
        {activeTab === 'dependencies' && (
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Network className="w-4 h-4 text-blue-600" />
                <span>Upstream & Downstream Dependency Trace</span>
              </div>

              <div className="space-y-2 font-mono">
                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-sans">Upstream Cryptographic Library:</span>
                  <span className="font-bold text-blue-700 text-sm">{asset.upstream_package || asset.library || 'Standard Cryptography'}</span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-sans">Caller Source File:</span>
                  <span className="font-bold text-indigo-700 text-xs">{asset.file} (Line {asset.line_number || 1})</span>
                </div>

                <div className="p-3 rounded-lg bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-sans">Functional Purpose:</span>
                  <span className="text-slate-800 text-xs">{asset.usage}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. PQC & MIGRATION TAB */}
        {activeTab === 'pqc' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-bold uppercase font-mono text-emerald-800 block">
                  NIST Standardized Target (FIPS 203/204)
                </span>
                <div className="text-sm font-bold text-emerald-700">{asset.recommended_pqc || 'ML-KEM-768'}</div>
                <p className="text-[11px] text-slate-600">Pure lattice-based post-quantum replacement.</p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                <span className="text-[10px] font-bold uppercase font-mono text-blue-800 block">
                  Transitional Hybrid Alternative
                </span>
                <div className="text-sm font-bold text-blue-700">{asset.hybrid_alternative || 'X25519 + ML-KEM-768'}</div>
                <p className="text-[11px] text-slate-600">Dual classical + PQC protection for backward compatibility.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
              <span className="font-bold text-slate-900 block font-sans">Financial & Effort Projection:</span>
              <div className="flex justify-between">
                <span className="text-slate-600">Estimated Engineering Effort:</span>
                <span className="text-slate-900 font-bold">{asset.estimated_effort_hours} hrs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Estimated Migration Cost:</span>
                <span className="text-emerald-700 font-bold">${asset.estimated_cost_usd?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Latency Overhead Impact:</span>
                <span className="text-amber-700 font-bold">{asset.latency_impact}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
