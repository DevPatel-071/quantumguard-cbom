import React from 'react';
import { Shield, Sparkles, RefreshCw, Layers, Database, Lock, Cpu, Activity, Bell } from 'lucide-react';

export default function Navbar({ activeScan, onNewScanClick, onOpenMonitoring }) {
  const unreadAlerts = activeScan?.monitoring_summary?.unread_alerts_count || 0;

  return (
    <header className="h-16 border-b border-slate-800/90 bg-[#070B14]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      
      {/* Brand: QUANTECT with Q Emblem */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex-shrink-0">
          <div className="w-full h-full bg-[#070B14] rounded-[10px] flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-6 h-6 fill-none">
              <circle cx="50" cy="50" r="34" stroke="#00E5FF" strokeWidth="12" strokeLinecap="round" />
              <path d="M54 54 L74 74" stroke="#38BDF8" strokeWidth="12" strokeLinecap="round" />
              <circle cx="50" cy="50" r="9" fill="#00E5FF" />
            </svg>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg tracking-tight font-sans text-white">
              QUAN<span className="bg-gradient-to-r from-cyan-400 to-sky-300 bg-clip-text text-transparent">TECT</span>
            </span>
            <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-mono">
              SIH 2026 EDITION
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono hidden md:block">
            Prepare Today, Secure Tomorrow.
          </p>
        </div>
      </div>

      {/* Center Status Beacon */}
      <div className="hidden lg:flex items-center gap-4 bg-slate-900/70 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400">Target:</span>
          <span className="font-semibold text-slate-200 truncate max-w-[140px]">
            {activeScan?.scan_summary?.target_name || 'Banking Switch API'}
          </span>
        </div>

        {activeScan && (
          <>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activeScan.scan_summary.crypto_assets_count} Assets</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-rose-400 font-bold">{activeScan.scan_summary.critical_risk_count}</span>
              <span className="text-slate-400">Critical Shor</span>
            </div>
          </>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {onOpenMonitoring && (
          <button
            onClick={onOpenMonitoring}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-300 transition relative"
            title="Continuous Monitoring & Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold font-mono flex items-center justify-center animate-pulse">
                {unreadAlerts}
              </span>
            )}
          </button>
        )}

        <button
          onClick={onNewScanClick}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition-all duration-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Scan</span>
        </button>
      </div>

    </header>
  );
}
