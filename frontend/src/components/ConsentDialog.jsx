import React, { useState } from 'react';
import { Shield, ShieldAlert, Eye, Lock, RefreshCw, CheckCircle2, ArrowRight, X, Info } from 'lucide-react';

export default function ConsentDialog({ isOpen, targetName, onConfirm, onCancel }) {
  const [selectedMode, setSelectedMode] = useState('SINGLE_SCAN'); // 'SINGLE_SCAN' | 'CONTINUOUS_MONITORING'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0C1220] border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl shadow-cyan-950/30 animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Before You Scan</h2>
              <p className="text-xs text-slate-400 font-mono">
                Cryptographic Discovery & Scope Authorization
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Data Access & Security Disclosure */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3 text-xs">
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target: <strong className="text-cyan-300">{targetName}</strong></span>
          </div>

          <p className="text-slate-300 leading-relaxed">
            QUANTECT will inspect source code syntax, dependency manifests, cryptographic imports, and public X.509 certificates to build a standardized Cryptographic Bill of Materials (CBOM).
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 font-mono">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Zero Credential Retention</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>AST Pattern Analysis</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>CycloneDX 1.6 Schema</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Quantum Risk Quantification</span>
            </div>
          </div>
        </div>

        {/* Mode Selection Options */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono block">
            Select Monitoring Mode:
          </label>

          {/* Option 1: Single Scan */}
          <div
            onClick={() => setSelectedMode('SINGLE_SCAN')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3 ${
              selectedMode === 'SINGLE_SCAN'
                ? 'bg-cyan-950/20 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <input
              type="radio"
              name="scanMode"
              checked={selectedMode === 'SINGLE_SCAN'}
              onChange={() => setSelectedMode('SINGLE_SCAN')}
              className="mt-1 accent-cyan-400"
            />
            <div className="space-y-1">
              <div className="font-bold text-xs text-slate-100 flex items-center gap-2">
                <span>Option 1: Single Scan</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  Ad-hoc Execution
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Analyze the selected target once. Generates complete CBOM, FMEA, and Roadmap reports. No continuous background tracking is enabled.
              </p>
            </div>
          </div>

          {/* Option 2: Continuous Monitoring */}
          <div
            onClick={() => setSelectedMode('CONTINUOUS_MONITORING')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3 ${
              selectedMode === 'CONTINUOUS_MONITORING'
                ? 'bg-indigo-950/20 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <input
              type="radio"
              name="scanMode"
              checked={selectedMode === 'CONTINUOUS_MONITORING'}
              onChange={() => setSelectedMode('CONTINUOUS_MONITORING')}
              className="mt-1 accent-indigo-400"
            />
            <div className="space-y-1">
              <div className="font-bold text-xs text-slate-100 flex items-center gap-2">
                <span>Option 2: Continuous Monitoring</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Recommended for CI/CD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Registers the source in QUANTECT Continuous Monitoring. Dispatches real-time alerts on new cryptographic assets, dependency updates, and risk elevations.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
          <span>You can change or disable this monitoring preference at any time.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
          >
            Cancel
          </button>
          
          <button
            onClick={() => onConfirm(selectedMode === 'CONTINUOUS_MONITORING')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-white shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
          >
            <span>{selectedMode === 'CONTINUOUS_MONITORING' ? 'Authorize & Enable Continuous Scan' : 'Run Single Scan'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
