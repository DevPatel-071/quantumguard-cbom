import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function HNDLTimelineVisual({ cbomReport, onNavigate }) {
  if (!cbomReport) return null;

  const metadata = cbomReport.metadata || {};
  const x = metadata.data_lifetime_years || 10.0;
  const y = metadata.migration_time_years || 3.0;
  const z = metadata.quantum_timeline_years || 15.0;

  const isUrgent = (x + y) > z;
  const exposureYears = isUrgent ? Math.round((x + y - z) * 10) / 10 : 0;
  const urgentCount = cbomReport.scan_summary?.mosca_urgent_count || (isUrgent ? cbomReport.assets?.length || 12 : 0);

  return (
    <div className="p-6 rounded-2xl command-card border-indigo-500/30 space-y-4 flex flex-col justify-between relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Mosca Theorem &amp; HNDL Threat Horizon
          </span>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold border ${
          isUrgent ? 'bg-rose-950/80 text-rose-300 border-rose-800/60' : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
        }`}>
          {isUrgent ? `⚠ ${urgentCount} HNDL Urgent Assets` : '✓ Safe Timeline'}
        </span>
      </div>

      {/* Conceptual HNDL Process Flow Illustration */}
      <div className="p-4 rounded-xl bg-[#040814] border border-[#1E2D4A] space-y-3 font-mono text-xs">
        <div className="text-[10px] text-slate-400 uppercase flex items-center justify-between">
          <span>Harvest-Now-Decrypt-Later (SNDL) Vector</span>
          <span className="text-cyan-400">X ({x}y) + Y ({y}y) {isUrgent ? '>' : '≤'} Z ({z}y)</span>
        </div>

        {/* Horizontal Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-[10px]">
          <div className="p-2 rounded-lg bg-[#070D1E] border border-[#1E2D4A]">
            <span className="text-cyan-300 font-bold block">1. TODAY</span>
            <span className="text-slate-400 text-[9px]">Encrypted Traffic Sent</span>
          </div>
          <div className="p-2 rounded-lg bg-[#070D1E] border border-rose-500/30">
            <span className="text-rose-400 font-bold block">2. HARVEST</span>
            <span className="text-slate-400 text-[9px]">Adversary Intercepts &amp; Stores</span>
          </div>
          <div className="p-2 rounded-lg bg-[#070D1E] border border-purple-500/30">
            <span className="text-purple-300 font-bold block">3. CRQC ARRIVAL</span>
            <span className="text-slate-400 text-[9px]">Year {z} (Quantum Break)</span>
          </div>
          <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-500/50">
            <span className="text-rose-300 font-bold block">4. DECRYPT LATER</span>
            <span className="text-rose-400 text-[9px]">Retroactive Decryption</span>
          </div>
        </div>

        {/* Mosca Status Callout */}
        <div className={`p-3 rounded-lg border text-[11px] leading-relaxed flex items-start gap-2.5 ${
          isUrgent ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
        }`}>
          {isUrgent ? (
            <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          )}
          <p className="font-sans text-[11px]">
            {isUrgent 
              ? `Because your data lifetime (${x} years) + migration time (${y} years) exceeds quantum horizon (${z} years), intercepted ciphertext is exposed to future quantum decryption with a ${exposureYears}-year vulnerability window.`
              : `Your cryptographic migration schedule (X + Y = ${x + y} years) safely completes before the estimated quantum computer arrival (${z} years).`}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400">Data Secrecy: <strong className="text-white">{x} Years</strong></span>
        {onNavigate && (
          <button
            onClick={() => onNavigate('simulators')}
            className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Simulate Mosca Parameters</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}
