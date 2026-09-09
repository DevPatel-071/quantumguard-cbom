import React from 'react';
import { Database, Lock, RefreshCw, Bell, Shield } from 'lucide-react';

export default function Navbar({ activeScan, onNewScanClick, onOpenMonitoring }) {
  const unreadAlerts = activeScan?.monitoring_summary?.unread_alerts_count || 0;

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-xs">
      
      {/* Brand: QUANTECT with Q Emblem */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 p-0.5 shadow-md shadow-blue-500/15 flex-shrink-0">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-5 h-5 fill-none">
              <circle cx="50" cy="50" r="34" stroke="#38BDF8" strokeWidth="12" strokeLinecap="round" />
              <path d="M54 54 L74 74" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
              <circle cx="50" cy="50" r="9" fill="#38BDF8" />
            </svg>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-lg tracking-tight font-sans text-slate-900">
              QUAN<span className="text-blue-600">TECT</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              SIH 2026 EDITION
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium hidden md:block">
            Prepare Today, Secure Tomorrow.
          </p>
        </div>
      </div>

      {/* Center Status Beacon */}
      <div className="hidden lg:flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-xs text-slate-700 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-500 font-medium">Target:</span>
          <span className="font-semibold text-slate-900 truncate max-w-[150px]">
            {activeScan?.scan_summary?.target_name || 'Banking Switch API'}
          </span>
        </div>

        {activeScan && (
          <>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Database className="w-3.5 h-3.5 text-blue-600" />
              <span>{activeScan.scan_summary.crypto_assets_count} Assets</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 font-medium">
              <span className="text-rose-600 font-bold">{activeScan.scan_summary.critical_risk_count}</span>
              <span className="text-slate-600">Critical Shor</span>
            </div>
          </>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {onOpenMonitoring && (
          <button
            onClick={onOpenMonitoring}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-blue-600 transition relative shadow-xs"
            title="Continuous Monitoring & Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold font-mono flex items-center justify-center shadow-sm">
                {unreadAlerts}
              </span>
            )}
          </button>
        )}

        <button
          onClick={onNewScanClick}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow transition-all duration-150"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Scan</span>
        </button>
      </div>

    </header>
  );
}
