import React from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Code, 
  FileText, 
  Layers, 
  Zap, 
  DollarSign, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Compass,
  Info
} from 'lucide-react';

export default function AssetDetailDrawer({ asset, onClose }) {
  if (!asset) return null;

  const r_str = (asset.risk_level && asset.risk_level.value) ? asset.risk_level.value : (asset.risk_level || 'MEDIUM');
  const factors = asset.risk_factor_breakdown || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#0F1422] border-l border-slate-800 h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sky-400 text-xs">
                #{asset.migration_priority} {asset.asset_id}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {asset.phase_label || 'Phase 1: Immediate'}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
              <span>{asset.algorithm}</span>
              {asset.key_size && (
                <span className="text-sm font-normal text-slate-400 font-mono">({asset.key_size}-bit)</span>
              )}
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              {asset.file}:{asset.line_number || 1} &bull; {asset.usage}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature 7: "WHY IS THIS RISKY?" Breakdown */}
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>WHY IS THIS RISKY? — Deterministic Factor Breakdown</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-rose-500/20 text-rose-300 font-mono border border-rose-500/40">
              Score: {asset.risk_score}/100
            </span>
          </div>

          {/* Plain-English Explanation */}
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {asset.risk_explanation || (
              `Asset '${asset.algorithm}' carries ${r_str} quantum vulnerability. It is susceptible to Shor's polynomial-time attack and exposes sensitive data to Harvest-Now-Decrypt-Later (HNDL) compromise.`
            )}
          </p>

          {/* Itemized Point Additions */}
          {factors.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-rose-500/20">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Risk Engine Point Allocation:
              </span>
              <div className="space-y-1.5">
                {factors.map((f, idx) => (
                  <div 
                    key={idx} 
                    className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-slate-300 text-[11px] truncate">{f.factor_name}</span>
                    <span className={`font-bold flex-shrink-0 ml-2 ${f.score_points >= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {f.score_points >= 0 ? `+${f.score_points}` : f.score_points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Feature 1 & 3: Migration Roadmap & Financial Impact Card */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Migration Roadmap & Effort Planning</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 block">Target Phase</span>
              <span className="font-bold text-indigo-400">{asset.migration_phase?.replace('PHASE_', 'Phase ') || 'Phase 1'}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 block">Estimated Effort</span>
              <span className="font-bold text-slate-200">{asset.estimated_effort_hours || 24} hrs</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 block">Est. Migration Cost</span>
              <span className="font-bold text-emerald-400">${asset.estimated_cost_usd?.toLocaleString() || '2,800'}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
              <span className="text-[10px] text-slate-500 block">Latency Impact</span>
              <span className="font-bold text-amber-300">{asset.latency_impact || 'LOW'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-slate-300 font-mono text-[11px] block">
              Suggested Migration Action:
            </span>
            <p className="text-slate-300 leading-relaxed">
              {asset.suggested_action || asset.recommended_action || 'Begin migration to NIST PQC standardized algorithms.'}
            </p>
          </div>
        </div>

        {/* Target PQC & Hybrid Replacement */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-200">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Target PQC Replacement Playbook</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <span className="text-[10px] font-bold uppercase font-mono text-emerald-400 block">
                NIST Standardized Target (FIPS 203/204)
              </span>
              <div className="text-sm font-bold text-emerald-300">{asset.recommended_pqc || 'ML-KEM-768'}</div>
              <p className="text-[11px] text-slate-400">Pure lattice-based post-quantum encryption/signing.</p>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-1">
              <span className="text-[10px] font-bold uppercase font-mono text-indigo-400 block">
                Transitional Hybrid Alternative
              </span>
              <div className="text-sm font-bold text-indigo-300">{asset.hybrid_alternative || 'X25519 + ML-KEM-768'}</div>
              <p className="text-[11px] text-slate-400">Dual classical + PQC protection for backward compatibility.</p>
            </div>
          </div>
        </div>

        {/* Source Code Evidence */}
        {asset.code_snippet && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-2 font-bold text-slate-300">
                <Code className="w-3.5 h-3.5 text-sky-400" />
                <span>Source Code Evidence</span>
              </span>
              <span>Line {asset.line_number || 1}</span>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
              <code>{asset.code_snippet}</code>
            </pre>
          </div>
        )}

        {/* Mosca X + Y > Z Breakdown */}
        {asset.mosca && (
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-200 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Mosca Theorem ($X + Y &gt; Z$) Timeline</span>
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                asset.mosca.is_urgent ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {asset.mosca.urgency}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Lifetime (X)</span>
                <span className="font-bold text-sky-400">{asset.mosca.x_data_lifetime}y</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Migration (Y)</span>
                <span className="font-bold text-indigo-400">{asset.mosca.y_migration_time}y</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">X + Y</span>
                <span className="font-bold text-amber-400">{asset.mosca.x_plus_y}y</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Quantum (Z)</span>
                <span className="font-bold text-purple-400">{asset.mosca.z_quantum_timeline}y</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
