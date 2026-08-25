import React from 'react';
import { Shield, Sparkles, RefreshCw, Layers, Database, Lock, Cpu } from 'lucide-react';

export default function Navbar({ activeScan, onNewScanClick }) {
  return (
    <header className="h-16 border-b border-slate-800 bg-[#0B0F19]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-sky-500/20">
          <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center">
            <Shield className="w-5 h-5 text-sky-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              QuantumGuard CBOM
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
              NIST FIPS 203/204/205
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono hidden sm:block">
            Post-Quantum Cryptographic Discovery & Risk Engine
          </p>
        </div>
      </div>

      {/* Center Status Beacon */}
      <div className="hidden lg:flex items-center gap-4 bg-slate-900/60 border border-slate-800 rounded-full px-4 py-1.5 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400">Target:</span>
          <span className="font-semibold text-slate-200">
            {activeScan?.scan_summary?.target_name || 'No Active Scan'}
          </span>
        </div>
        {activeScan && (
          <>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>{activeScan.scan_summary.crypto_assets_count} Crypto Assets</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-rose-400 font-bold">{activeScan.scan_summary.quantum_vulnerable_count}</span>
              <span className="text-slate-400">Shor Vulnerable</span>
            </div>
          </>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNewScanClick}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/20 transition-all duration-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Scan</span>
        </button>
      </div>
    </header>
  );
}
