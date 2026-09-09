import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, HardDrive, Radio, Cpu, Lock } from 'lucide-react';

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
    <div className="p-6 rounded-2xl command-card border-indigo-500/30 space-y-5 flex flex-col justify-between h-full relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 z-10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-500/40">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              Mosca Theorem &amp; HNDL Threat Horizon
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              Harvest-Now-Decrypt-Later (SNDL) Vulnerability Model
            </span>
          </div>
        </div>

        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold border flex items-center gap-1.5 ${
          isUrgent ? 'bg-rose-950/90 text-rose-300 border-rose-700/60 shadow-rose-glow' : 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60'
        }`}>
          {isUrgent ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
              <span>⚠ {urgentCount} Urgent Assets</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>✓ Safe Timeline</span>
            </>
          )}
        </span>
      </div>

      {/* Equation Ribbon */}
      <div className="px-3.5 py-2 rounded-xl bg-[#040814] border border-[#1E2D4A] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono z-10">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Mosca Inequality:</span>
          <span className="font-bold text-cyan-300">X + Y {isUrgent ? '>' : '≤'} Z</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-slate-300">X (Secrecy): <strong className="text-cyan-400">{x}y</strong></span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-slate-300">Y (Migration): <strong className="text-amber-400">{y}y</strong></span>
          <span className="text-slate-500">&bull;</span>
          <span className="text-slate-300">Z (CRQC): <strong className="text-rose-400">{z}y</strong></span>
        </div>
      </div>

      {/* 4-Step Process Timeline */}
      <div className="space-y-2 z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          
          {/* Step 1: TODAY */}
          <div className="p-3 rounded-xl bg-[#070D1E] border border-cyan-500/30 flex flex-col justify-between space-y-2 relative group hover:border-cyan-500/60 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-cyan-400">1. TODAY</span>
              <Lock className="w-3.5 h-3.5 text-cyan-400/70" />
            </div>
            <div>
              <span className="text-xs font-bold text-white font-mono block">Active Ciphertext</span>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5 leading-snug">
                Encrypted data transmitted over TLS / Public Key.
              </p>
            </div>
            <span className="text-[9px] font-mono text-cyan-300/80 bg-cyan-950/60 px-1.5 py-0.5 rounded w-fit">
              Year 0
            </span>
          </div>

          {/* Step 2: HARVEST */}
          <div className="p-3 rounded-xl bg-[#070D1E] border border-rose-500/30 flex flex-col justify-between space-y-2 relative group hover:border-rose-500/60 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-rose-400">2. HARVEST</span>
              <Radio className="w-3.5 h-3.5 text-rose-400/70" />
            </div>
            <div>
              <span className="text-xs font-bold text-white font-mono block">Data Interception</span>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5 leading-snug">
                Adversary intercepts and stores encrypted blobs.
              </p>
            </div>
            <span className="text-[9px] font-mono text-rose-300/80 bg-rose-950/60 px-1.5 py-0.5 rounded w-fit">
              Years 0 &ndash; {x}
            </span>
          </div>

          {/* Step 3: CRQC ARRIVAL */}
          <div className="p-3 rounded-xl bg-[#070D1E] border border-purple-500/30 flex flex-col justify-between space-y-2 relative group hover:border-purple-500/60 transition">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-purple-300">3. CRQC ARRIVAL</span>
              <Cpu className="w-3.5 h-3.5 text-purple-400/70" />
            </div>
            <div>
              <span className="text-xs font-bold text-white font-mono block">Quantum Break</span>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5 leading-snug">
                Cryptographically Relevant Quantum Computer arrives.
              </p>
            </div>
            <span className="text-[9px] font-mono text-purple-300/80 bg-purple-950/60 px-1.5 py-0.5 rounded w-fit">
              Year {z} (Horizon)
            </span>
          </div>

          {/* Step 4: DECRYPT LATER */}
          <div className={`p-3 rounded-xl flex flex-col justify-between space-y-2 relative group transition ${
            isUrgent ? 'bg-rose-950/40 border border-rose-500/50 hover:border-rose-400' : 'bg-[#070D1E] border border-emerald-500/30 hover:border-emerald-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold ${isUrgent ? 'text-rose-400' : 'text-emerald-400'}`}>
                4. DECRYPT
              </span>
              <HardDrive className={`w-3.5 h-3.5 ${isUrgent ? 'text-rose-400' : 'text-emerald-400'}`} />
            </div>
            <div>
              <span className="text-xs font-bold text-white font-mono block">Retroactive Decrypt</span>
              <p className="text-[10px] text-slate-400 font-sans mt-0.5 leading-snug">
                {isUrgent ? 'Stored data decrypted before secrecy expires.' : 'Migration completed before quantum break.'}
              </p>
            </div>
            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded w-fit ${
              isUrgent ? 'text-rose-300 bg-rose-950/80' : 'text-emerald-300 bg-emerald-950/80'
            }`}>
              {isUrgent ? `⚠ ${exposureYears}y Exposure` : '✓ Protected'}
            </span>
          </div>

        </div>
      </div>

      {/* Mosca Status Callout */}
      <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-3 z-10 ${
        isUrgent ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
      }`}>
        {isUrgent ? (
          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <span className="font-mono font-bold text-xs block text-white">
            {isUrgent ? 'Critical HNDL Action Required' : 'Mosca Timeline Verified Resilient'}
          </span>
          <p className="font-sans text-[11px] text-slate-300">
            {isUrgent 
              ? `Because your security requirement (${x}y) + migration duration (${y}y) = ${x + y} years exceeds the estimated quantum horizon (${z}y), adversaries can harvest ciphertext now and decrypt it in ${z} years—exposing confidential payloads for ${exposureYears} years.`
              : `Your total cryptographic transition schedule (X + Y = ${x + y} years) will complete comfortably before quantum computers achieve cryptanalytic scale (${z} years).`}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-xs font-mono z-10">
        <span className="text-slate-400">
          Target Secrecy: <strong className="text-white">{x} Years</strong>
        </span>
        {onNavigate && (
          <button
            onClick={() => onNavigate('simulators')}
            className="text-indigo-400 hover:text-indigo-300 hover:underline font-bold flex items-center gap-1.5 transition"
          >
            <span>Simulate Mosca Horizon</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
