import React, { useState } from 'react';
import { Shield, Eye, CheckCircle2, ArrowRight, X, Info, Sparkles, Radio } from 'lucide-react';

export default function ConsentDialog({ isOpen, targetName, onConfirm, onCancel }) {
  const [selectedMode, setSelectedMode] = useState('SINGLE_SCAN'); // 'SINGLE_SCAN' | 'CONTINUOUS_MONITORING'

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#080E1E] border border-[#1E2D4A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl animate-scaleUp text-slate-200 command-grid relative">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-mono">Authorization &amp; Consent</h2>
              <p className="text-xs text-slate-400 font-sans">
                Cryptographic Discovery &amp; Scope Authorization
              </p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg bg-[#050A14] text-slate-400 hover:text-white border border-[#1E2D4A] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Data Access & Security Disclosure */}
        <div className="p-4 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-3 text-xs font-mono">
          <div className="font-semibold text-white flex items-center gap-2">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target: <strong className="text-cyan-300">{targetName}</strong></span>
          </div>

          <p className="text-slate-300 leading-relaxed font-sans">
            QUANTECT will inspect source code syntax, dependency manifests, cryptographic imports, and public X.509 certificates to build a standardized Cryptographic Bill of Materials (CBOM).
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
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
          <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            Select Monitoring Mode:
          </label>

          {/* Option 1: Single Scan */}
          <div
            onClick={() => setSelectedMode('SINGLE_SCAN')}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 flex items-start gap-3 ${
              selectedMode === 'SINGLE_SCAN'
                ? 'bg-[#0D1730] border-cyan-400 shadow-cyan-glow'
                : 'bg-[#050A14] border-[#1E2D4A] hover:border-slate-500'
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
              <div className="font-bold text-xs text-white flex items-center gap-2 font-mono">
                <span>Option 1: Single Scan</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#050A14] text-slate-400 border border-[#1E2D4A]">
                  Ad-hoc Execution
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Analyze the selected target once. Generates complete CBOM, FMEA, and Roadmap reports. No continuous background tracking is enabled.
              </p>
            </div>
          </div>

          {/* Option 2: Continuous Monitoring */}
          <div
            onClick={() => setSelectedMode('CONTINUOUS_MONITORING')}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 flex items-start gap-3 ${
              selectedMode === 'CONTINUOUS_MONITORING'
                ? 'bg-[#0D1730] border-cyan-400 shadow-cyan-glow'
                : 'bg-[#050A14] border-[#1E2D4A] hover:border-slate-500'
            }`}
          >
            <input
              type="radio"
              name="scanMode"
              checked={selectedMode === 'CONTINUOUS_MONITORING'}
              onChange={() => setSelectedMode('CONTINUOUS_MONITORING')}
              className="mt-1 accent-cyan-400"
            />
            <div className="space-y-1">
              <div className="font-bold text-xs text-white flex items-center gap-2 font-mono">
                <span>Option 2: Continuous Monitoring</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 font-semibold">
                  Recommended for CI/CD
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Registers the source in QUANTECT Continuous Monitoring. Dispatches real-time alerts on new cryptographic assets, dependency updates, and risk elevations.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2.5 pt-2 border-t border-[#1E2D4A]">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-[#050A14] transition"
          >
            Cancel
          </button>
          
          <button
            onClick={() => onConfirm(selectedMode === 'CONTINUOUS_MONITORING')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-glow transition flex items-center justify-center gap-2"
          >
            <span>{selectedMode === 'CONTINUOUS_MONITORING' ? 'Authorize & Enable Continuous Scan' : 'Run Single Scan'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
