import React from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileCode, 
  Lock, 
  Cpu, 
  ExternalLink, 
  HelpCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Layers,
  Terminal
} from 'lucide-react';

export default function AssetDetailDrawer({ asset, onClose }) {
  if (!asset) return null;

  const riskBadgeStyles = {
    CRITICAL: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    LOW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
  }[asset.risk_level] || 'bg-slate-500/20 text-slate-400 border-slate-500/40';

  const confBadgeStyles = {
    CONFIRMED_USAGE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    POTENTIAL_USAGE: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    DEPENDENCY_ONLY: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    INFERRED: 'bg-pink-500/20 text-pink-300 border-pink-500/40'
  }[asset.confidence] || 'bg-slate-500/20 text-slate-400 border-slate-500/40';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div 
        className="w-full max-w-2xl bg-[#0F172A] border-l border-slate-800 h-full flex flex-col shadow-2xl shadow-black overflow-y-auto animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-start justify-between sticky top-0 bg-[#0F172A]/95 backdrop-blur-md z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                {asset.asset_id}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Priority #{asset.migration_priority}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${riskBadgeStyles}`}>
                {asset.risk_level} RISK ({asset.risk_score}/100)
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>{asset.algorithm}</span>
              {asset.key_size && (
                <span className="text-sm font-mono font-normal text-slate-400">
                  ({asset.key_size}-bit {asset.mode || asset.curve || ''})
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              Discovered in <span className="font-mono text-sky-300">{asset.file}</span> (Line {asset.line_number || 'N/A'})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">

          {/* Evidence Code Snippet Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-400" />
                <span>Detection Evidence & Code Context</span>
              </div>
              <span className={`px-2 py-0.5 rounded border text-[10px] ${confBadgeStyles}`}>
                {asset.confidence}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-[11px] text-slate-500 flex justify-between">
                <span>{asset.file} : line {asset.line_number || 1}</span>
                <span className="text-sky-400">{asset.library || 'Native/SDK'}</span>
              </div>
              <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800/80 overflow-x-auto text-emerald-400 font-bold">
                {asset.code_snippet || asset.evidence}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                <strong>Evidence:</strong> {asset.evidence}
              </p>
            </div>
          </div>

          {/* Quick Metadata Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-mono">Usage Function</span>
              <p className="font-semibold text-slate-200">{asset.usage}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-mono">Category</span>
              <p className="font-semibold text-slate-200">{asset.category}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-mono">Business Criticality</span>
              <p className="font-semibold text-slate-200">{asset.business_criticality}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-mono">Network Exposure</span>
              <p className="font-semibold text-slate-200">{asset.exposure}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-mono">Data Lifetime (X)</span>
              <p className="font-semibold text-slate-200">{asset.data_lifetime_years} years</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[11px] text-slate-500 font-mono">Migration Est. (Y)</span>
              <p className="font-semibold text-slate-200">{asset.migration_time_years} years</p>
            </div>
          </div>

          {/* Explainability Engine Card */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-bold uppercase tracking-wider font-mono">
              <HelpCircle className="w-4 h-4" />
              <span>Risk Engine Explainability (Why this Score?)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculated deterministically using multi-factor quantum threat modeling:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {asset.risk_factors && asset.risk_factors.map((factor, fIdx) => (
                <li key={fIdx} className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mosca Assessment Breakdown */}
          {asset.mosca && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-slate-900 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider font-mono">
                  <Clock className="w-4 h-4" />
                  <span>Mosca's Theorem: X + Y &gt; Z</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  asset.mosca.is_urgent 
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                    : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}>
                  {asset.mosca.urgency}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">X (Data Life)</span>
                  <span className="font-bold text-slate-200">{asset.mosca.x_data_lifetime} yrs</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Y (Migration)</span>
                  <span className="font-bold text-slate-200">{asset.mosca.y_migration_time} yrs</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">Z (Quantum)</span>
                  <span className="font-bold text-slate-200">{asset.mosca.z_quantum_timeline} yrs</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {asset.mosca.explanation}
              </p>
              {asset.mosca.hndl_exposure_years > 0 && (
                <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                  <strong>Harvest-Now-Decrypt-Later (HNDL) Window:</strong> {asset.mosca.hndl_exposure_years} years of future exposure for recorded traffic.
                </div>
              )}
            </div>
          )}

          {/* PQC & Hybrid Recommendation Card */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-slate-900 border border-indigo-500/30 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider font-mono">
              <Cpu className="w-4 h-4" />
              <span>Post-Quantum Migration Recommendation</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-[11px] text-purple-400 font-bold uppercase block mb-1">
                  Target Post-Quantum Standard:
                </span>
                <p className="text-emerald-400 font-bold text-sm">
                  {asset.recommended_pqc}
                </p>
              </div>

              {asset.hybrid_alternative && (
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800">
                  <span className="text-[11px] text-sky-400 font-bold uppercase block mb-1">
                    Recommended Transitional Hybrid Scheme:
                  </span>
                  <p className="text-sky-300 font-semibold">
                    {asset.hybrid_alternative}
                  </p>
                </div>
              )}

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 leading-relaxed">
                <span className="text-[11px] text-slate-400 font-bold block mb-1">Priority Justification:</span>
                <p>{asset.migration_reason}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-800 sticky bottom-0 bg-[#0F172A]/95 backdrop-blur-md flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
