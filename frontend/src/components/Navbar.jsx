import React from 'react';
import { Database, Lock, RefreshCw, Bell, Shield, Search, Terminal, Activity, Cpu } from 'lucide-react';

export default function Navbar({ activeScan, onNewScanClick, onOpenMonitoring }) {
  const unreadAlerts = activeScan?.monitoring_summary?.unread_alerts_count || 0;
  const targetName = activeScan?.scan_summary?.target_name || 'No Target Ingested';

  return (
    <header className="h-16 border-b border-command-border/80 bg-command-bg/95 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none shadow-2xl">
      
      {/* Brand: QUANTECT with Glowing Q Shield */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-0.5 shadow-cyan-glow flex-shrink-0">
          <div className="w-full h-full bg-[#070C18] rounded-[10px] flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-5 h-5 fill-none">
              <circle cx="50" cy="50" r="34" stroke="#00F0FF" strokeWidth="12" strokeLinecap="round" />
              <path d="M54 54 L74 74" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
              <circle cx="50" cy="50" r="9" fill="#00F0FF" />
            </svg>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg tracking-wider font-mono text-white glow-cyan">
              QUAN<span className="text-command-cyan">TECT</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 font-mono shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              COMMAND CENTER
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono tracking-wide hidden md:block">
            Prepare Today, Secure Tomorrow.
          </p>
        </div>
      </div>

      {/* Center Target & Cryptographic Status Beacon */}
      <div className="hidden lg:flex items-center gap-4 bg-command-surface/90 border border-command-border rounded-xl px-4 py-1.5 text-xs text-slate-300 shadow-command-card">
        <div className="flex items-center gap-2 font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400 text-[11px]">TARGET:</span>
          <span className="font-bold text-white tracking-wide truncate max-w-[160px]">
            {targetName}
          </span>
        </div>

        {activeScan && (
          <>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-slate-300 font-mono text-xs">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span><strong className="text-white">{activeScan.scan_summary.crypto_assets_count}</strong> Assets</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-rose-400 font-bold glow-red">{activeScan.scan_summary.critical_risk_count}</span>
              <span className="text-slate-300">Critical Shor</span>
            </div>
          </>
        )}
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-3">
        {onOpenMonitoring && (
          <button
            onClick={onOpenMonitoring}
            className="p-2 rounded-xl bg-command-surface hover:bg-command-card border border-command-border text-slate-300 hover:text-cyan-400 transition relative shadow-command-card"
            title="Continuous Monitoring & Security Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black font-mono flex items-center justify-center shadow-rose-glow animate-pulse">
                {unreadAlerts}
              </span>
            )}
          </button>
        )}

        <button
          onClick={onNewScanClick}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wide bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-glow hover:shadow-lg transition-all duration-200 border border-cyan-400/30"
        >
          <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
          <span>RUN SCAN</span>
        </button>
      </div>

    </header>
  );
}

