import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert, HardDrive, Radio, Cpu, Lock } from 'lucide-react';

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
    <div className="p-6 sm:p-7 rounded-2xl command-card border-indigo-500/30 space-y-6 relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E2D4A] pb-4 z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-500/40 shadow-indigo-glow flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              Mosca Theorem &amp; HNDL Threat Horizon
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Harvest-Now-Decrypt-Later (SNDL) Vulnerability &amp; Cryptanalytic Timeline Modeling
            </p>
          </div>
        </div>

        <div className="flex-shrink-0">
          <span className={`text-xs font-mono px-3 py-1 rounded-full font-bold border inline-flex items-center gap-2 ${
            isUrgent ? 'bg-rose-950/90 text-rose-300 border-rose-700/60 shadow-rose-glow' : 'bg-emerald-950/90 text-emerald-300 border-emerald-700/60'
          }`}>
            {isUrgent ? (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                <span>⚠ {urgentCount} HNDL Urgent Assets</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>✓ Safe Cryptographic Timeline</span>
              </>
            )}
          </span>
        </div>
      </div>

      {/* Mosca Mathematical Parameter Ribbon */}
      <div className="p-4 rounded-xl bg-[#040814] border border-[#1E2D4A] space-y-3 z-10 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-[#1E2D4A]/60 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Mosca Theorem Inequality:</span>
            <span className="font-bold text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">
              X + Y {isUrgent ? '>' : '≤'} Z
            </span>
          </div>
          <span className={`text-[11px] font-bold ${isUrgent ? 'text-rose-400' : 'text-emerald-400'}`}>
            {isUrgent ? `Condition Triggered: Critical Exposure Window of ${exposureYears} Years` : 'Condition Met: Secure Migration Buffer'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A] flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Data Secrecy (X)</span>
              <span className="font-bold text-white text-sm">{x} Years</span>
            </div>
            <span className="text-[10px] text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
              Payload Shelf Life
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A] flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Migration Time (Y)</span>
              <span className="font-bold text-white text-sm">{y} Years</span>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
              Transition Duration
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A] flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Quantum Horizon (Z)</span>
              <span className="font-bold text-white text-sm">{z} Years</span>
            </div>
            <span className="text-[10px] text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/30">
              CRQC Arrival Est.
            </span>
          </div>
        </div>
      </div>

      {/* 4-Step Process Pipeline Flow */}
      <div className="space-y-3 z-10">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="uppercase font-bold tracking-wider text-slate-300">
            Harvest-Now-Decrypt-Later Exploit Vector Flow
          </span>
          <span className="text-indigo-400 text-[11px]">4-Stage Threat Pipeline</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Step 1: TODAY */}
          <div className="p-4 rounded-xl bg-[#070D1E] border border-cyan-500/30 flex flex-col justify-between space-y-3 relative group hover:border-cyan-500/60 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">
                1. TODAY
              </span>
              <div className="p-1.5 rounded-lg bg-cyan-950/60 text-cyan-400">
                <Lock className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white font-mono">Active Ciphertext</h4>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Confidential enterprise data is encrypted using classical asymmetric algorithms (RSA-2048, ECC) and transmitted across public networks.
              </p>
            </div>

            <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Timeline:</span>
              <strong className="text-cyan-300">Year 0 (Current)</strong>
            </div>
          </div>

          {/* Step 2: HARVEST */}
          <div className="p-4 rounded-xl bg-[#070D1E] border border-rose-500/30 flex flex-col justify-between space-y-3 relative group hover:border-rose-500/60 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40">
                2. HARVEST
              </span>
              <div className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400">
                <Radio className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white font-mono">Adversary Interception</h4>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Adversaries passively intercept and archive encrypted network packets into persistent data vaults, awaiting quantum cryptanalysis.
              </p>
            </div>

            <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Timeline:</span>
              <strong className="text-rose-300">Years 0 &ndash; {x}</strong>
            </div>
          </div>

          {/* Step 3: CRQC ARRIVAL */}
          <div className="p-4 rounded-xl bg-[#070D1E] border border-purple-500/30 flex flex-col justify-between space-y-3 relative group hover:border-purple-500/60 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40">
                3. CRQC ARRIVAL
              </span>
              <div className="p-1.5 rounded-lg bg-purple-950/60 text-purple-400">
                <Cpu className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white font-mono">Quantum Break</h4>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                Cryptographically Relevant Quantum Computers reach scale, running Shor's algorithm to solve discrete logs and factor large primes in polynomial time.
              </p>
            </div>

            <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Timeline:</span>
              <strong className="text-purple-300">Year {z} (Estimated)</strong>
            </div>
          </div>

          {/* Step 4: DECRYPT LATER */}
          <div className={`p-4 rounded-xl flex flex-col justify-between space-y-3 relative group transition ${
            isUrgent 
              ? 'bg-rose-950/30 border border-rose-500/50 hover:border-rose-400' 
              : 'bg-[#070D1E] border border-emerald-500/30 hover:border-emerald-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                isUrgent ? 'text-rose-300 bg-rose-950/90 border-rose-500/50' : 'text-emerald-300 bg-emerald-950/90 border-emerald-500/50'
              }`}>
                4. DECRYPT LATER
              </span>
              <div className={`p-1.5 rounded-lg ${isUrgent ? 'bg-rose-950/80 text-rose-400' : 'bg-emerald-950/80 text-emerald-400'}`}>
                <HardDrive className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white font-mono">Retroactive Decryption</h4>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {isUrgent 
                  ? 'Historical encrypted data is broken before secrecy shelf-life expires, leading to retroactive exposure of secrets.' 
                  : 'All assets migrated to PQC before quantum arrival, preventing retroactive decryption.'}
              </p>
            </div>

            <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400">Post-CRQC State:</span>
              <strong className={isUrgent ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {isUrgent ? `⚠ ${exposureYears}y Exposure` : '✓ Protected'}
              </strong>
            </div>
          </div>

        </div>
      </div>

      {/* Explanatory Assessment Callout */}
      <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3.5 z-10 ${
        isUrgent ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
      }`}>
        {isUrgent ? (
          <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        )}
        <div className="space-y-1.5 flex-1">
          <h4 className="font-mono font-bold text-xs text-white">
            {isUrgent ? 'Critical Mosca Theorem Remediation Triggered' : 'Mosca Security Horizon Verified'}
          </h4>
          <p className="font-sans text-xs text-slate-300 leading-relaxed">
            {isUrgent 
              ? `Because your data secrecy requirement (X = ${x} years) + cryptographic migration duration (Y = ${y} years) totals ${x + y} years, which exceeds the estimated arrival of cryptanalytic quantum hardware (Z = ${z} years), intercepted ciphertext is exposed to future quantum decryption with a critical ${exposureYears}-year retroactive exposure window.`
              : `Your organization's complete cryptographic migration duration (X + Y = ${x + y} years) safely finishes ahead of estimated quantum computer arrival (${z} years).`}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-2 border-t border-[#1E2D4A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono z-10">
        <span className="text-slate-400">
          Target Data Secrecy Requirement: <strong className="text-white">{x} Years</strong> &bull; Migration Window: <strong className="text-white">{y} Years</strong>
        </span>

        {onNavigate && (
          <button
            onClick={() => onNavigate('simulators')}
            className="text-indigo-400 hover:text-indigo-300 hover:underline font-bold flex items-center gap-1.5 transition self-end sm:self-auto"
          >
            <span>Simulate Mosca Parameters &amp; Threat Horizon</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
