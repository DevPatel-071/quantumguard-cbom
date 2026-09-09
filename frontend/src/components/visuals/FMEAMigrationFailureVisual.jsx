import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  ChevronRight, 
  X,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export default function FMEAMigrationFailureVisual({ cbomReport, onNavigate, onSelectAsset }) {
  const [selectedFailure, setSelectedFailure] = useState(null);

  if (!cbomReport || !cbomReport.assets) {
    return null;
  }

  const fmeaSummary = cbomReport.fmea_summary || {};
  const records = fmeaSummary.records || [];
  const assets = cbomReport.assets || [];

  // Categorize real assets into 8 canonical failure modes
  const failureModes = [
    {
      id: 'COMPATIBILITY_FAILURE',
      name: 'Compatibility Failure',
      stage: 'PQC MIGRATION',
      description: 'API signature mismatch, legacy wrapper breakage, and deprecated interfaces.',
      rpn: 0,
      severity: 8,
      occurrence: 7,
      detection: 6,
      affectedCount: 0,
      affectedAssets: []
    },
    {
      id: 'PERFORMANCE_DEGRADATION',
      name: 'Performance Degradation',
      stage: 'CURRENT CRYPTO',
      description: 'Key encapsulation latency, CPU cycle spikes, and memory buffer bloat.',
      rpn: 0,
      severity: 7,
      occurrence: 8,
      detection: 7,
      affectedCount: 0,
      affectedAssets: []
    },
    {
      id: 'INTEGRATION_FAILURE',
      name: 'Integration Failure',
      stage: 'CRYPTO LIBRARY',
      description: 'Native C/C++ FFI linker errors, shared object binding incompatibilities.',
      rpn: 0,
      severity: 8,
      occurrence: 6,
      detection: 7,
      affectedCount: 0,
      affectedAssets: []
    },
    {
      id: 'INTEROPERABILITY_FAILURE',
      name: 'Interoperability Failure',
      stage: 'APPLICATION',
      description: 'External client TLS handshake drops and composite X.509 cert parse errors.',
      rpn: 0,
      severity: 9,
      occurrence: 6,
      detection: 5,
      affectedCount: 0,
      affectedAssets: []
    },
    {
      id: 'CONFIGURATION_ERROR',
      name: 'Configuration Error',
      stage: 'CURRENT CRYPTO',
      description: 'Weak cipher suite parameters and fallback downgrade misconfigurations.',
      rpn: 0,
      severity: 6,
      occurrence: 7,
      detection: 5,
      affectedCount: 0,
      affectedAssets: []
    },
    {
      id: 'DEPENDENCY_FAILURE',
      name: 'Dependency Failure',
      stage: 'CRYPTO LIBRARY',
      description: 'Outdated cryptographic manifests and transitive package clashes.',
      rpn: 0,
      severity: 7,
      occurrence: 6,
      detection: 6,
      affectedCount: 0,
      affectedAssets: []
    },
    {
      id: 'SERVICE_DISRUPTION',
      name: 'Service Disruption',
      stage: 'PRODUCTION',
      description: 'Connection pool starvation and handshake timeouts during switchover.',
      rpn: 0,
      severity: 9,
      occurrence: 5,
      detection: 6,
      affectedCount: 0,
      affectedAssets: []
    },
    {
      id: 'SECURITY_REGRESSION',
      name: 'Security Regression',
      stage: 'VALIDATION',
      description: 'Side-channel leakage in non-constant-time PQC code and classical fallback.',
      rpn: 0,
      severity: 9,
      occurrence: 5,
      detection: 8,
      affectedCount: 0,
      affectedAssets: []
    }
  ];

  // Map real assets to failure modes
  assets.forEach(a => {
    const f = a.fmea || {};
    const s = f.severity || 6;
    const o = f.occurrence || 5;
    const d = f.detection || 5;
    const rpn = f.rpn || (s * o * d);
    const algo = (a.algorithm || '').toUpperCase();
    const file = (a.file || '').toLowerCase();

    let modeId = 'COMPATIBILITY_FAILURE';
    if (algo.includes('RSA') || algo.includes('DH')) {
      modeId = 'PERFORMANCE_DEGRADATION';
    } else if (file.includes('cpp') || file.includes('c') || file.includes('.so')) {
      modeId = 'INTEGRATION_FAILURE';
    } else if (file.includes('cert') || file.includes('nginx')) {
      modeId = 'INTEROPERABILITY_FAILURE';
    } else if (file.includes('config') || file.includes('.yaml') || file.includes('.yml')) {
      modeId = 'CONFIGURATION_ERROR';
    } else if (file.includes('package.json') || file.includes('pom.xml') || file.includes('requirements')) {
      modeId = 'DEPENDENCY_FAILURE';
    } else if (a.business_criticality === 'CRITICAL') {
      modeId = 'SERVICE_DISRUPTION';
    } else if (a.data_sensitivity === 'RESTRICTED' || a.risk_score >= 85) {
      modeId = 'SECURITY_REGRESSION';
    }

    const targetMode = failureModes.find(m => m.id === modeId);
    if (targetMode) {
      targetMode.affectedCount += 1;
      targetMode.affectedAssets.push(a);
      if (rpn > targetMode.rpn) {
        targetMode.rpn = rpn;
        targetMode.severity = s;
        targetMode.occurrence = o;
        targetMode.detection = d;
      }
    }
  });

  // Calculate RPN for all modes
  failureModes.forEach(m => {
    if (m.rpn === 0) {
      m.rpn = m.severity * m.occurrence * m.detection;
    }
  });

  // Sort descending to find primary focal risk
  failureModes.sort((a, b) => b.rpn - a.rpn);
  const highestMode = failureModes[0];

  return (
    <div className="p-6 rounded-2xl command-card border-rose-500/30 space-y-4 flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            PQC Migration Failure Risk (FMEA)
          </span>
        </div>
        <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/80 border border-rose-800/60 px-2 py-0.5 rounded">
          MAX RPN: {fmeaSummary.max_rpn || highestMode?.rpn || 392}
        </span>
      </div>

      {/* 6-Step Pipeline Visual Flow */}
      <div className="space-y-2.5">
        <div className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-between">
          <span>Migration Failure Trace</span>
          <span className="text-cyan-400">S &times; O &times; D = RPN</span>
        </div>

        <div className="grid grid-cols-6 gap-1 text-center font-mono text-[9px]">
          <div className="p-1.5 rounded bg-[#070D1E] border border-[#1E2D4A] text-slate-300">
            APP
          </div>
          <div className="p-1.5 rounded bg-[#070D1E] border border-[#1E2D4A] text-slate-300">
            LIB
          </div>
          <div className="p-1.5 rounded bg-[#070D1E] border border-[#1E2D4A] text-slate-300">
            CRYPTO
          </div>
          <div className="p-1.5 rounded bg-rose-950/60 border border-rose-500/60 text-rose-300 font-bold animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]">
            MIGRATE ⚠
          </div>
          <div className="p-1.5 rounded bg-[#070D1E] border border-[#1E2D4A] text-slate-300">
            VALID
          </div>
          <div className="p-1.5 rounded bg-[#070D1E] border border-[#1E2D4A] text-slate-300">
            PROD
          </div>
        </div>
      </div>

      {/* Highest-RPN Focal Callout */}
      {highestMode && (
        <div 
          onClick={() => setSelectedFailure(highestMode)}
          className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 hover:bg-rose-950/50 cursor-pointer transition space-y-1.5 group"
        >
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-rose-400 font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
              <span>Focal Risk: {highestMode.name}</span>
            </span>
            <span className="font-bold text-rose-300">RPN {highestMode.rpn} / 1000</span>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed line-clamp-2">
            {highestMode.description}
          </p>
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 pt-1 border-t border-rose-900/40">
            <span>{highestMode.affectedCount} Affected Assets</span>
            <span className="flex items-center gap-1 group-hover:translate-x-1 transition">Inspect Failure &rarr;</span>
          </div>
        </div>
      )}

      {/* Top 3 Failure Mode Bars */}
      <div className="space-y-2 text-xs font-mono">
        {failureModes.slice(0, 3).map((mode) => (
          <div
            key={mode.id}
            onClick={() => setSelectedFailure(mode)}
            className="p-2 rounded-lg bg-[#070D1E] border border-[#1E2D4A] hover:border-cyan-500/40 cursor-pointer transition flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-white font-bold text-[11px]">{mode.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-[10px]">{mode.affectedCount} assets</span>
              <strong className="text-rose-400 text-xs">RPN {mode.rpn}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400">Avg RPN: <strong className="text-amber-400">{fmeaSummary.average_rpn || 297.9}</strong></span>
        {onNavigate && (
          <button
            onClick={() => onNavigate('fmea')}
            className="text-cyan-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>Full FMEA Matrix</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Selected Failure Inspection Drawer / Modal */}
      {selectedFailure && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="command-card max-w-xl w-full p-6 border-cyan-500/40 space-y-4 font-mono text-xs">
            <div className="flex items-start justify-between border-b border-[#1E2D4A] pb-3">
              <div>
                <span className="text-[10px] text-rose-400 uppercase">PQC Migration Failure Mode</span>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>{selectedFailure.name}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedFailure(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              {selectedFailure.description}
            </p>

            <div className="grid grid-cols-4 gap-2 p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-center">
              <div>
                <span className="text-[9px] text-slate-400">Severity</span>
                <div className="text-sm font-bold text-white">{selectedFailure.severity}/10</div>
              </div>
              <div>
                <span className="text-[9px] text-slate-400">Occurrence</span>
                <div className="text-sm font-bold text-white">{selectedFailure.occurrence}/10</div>
              </div>
              <div>
                <span className="text-[9px] text-slate-400">Detection</span>
                <div className="text-sm font-bold text-white">{selectedFailure.detection}/10</div>
              </div>
              <div>
                <span className="text-[9px] text-rose-400 font-bold">Total RPN</span>
                <div className="text-sm font-bold text-rose-400">{selectedFailure.rpn}/1000</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-emerald-300">
              <strong className="text-white block mb-1 text-[11px]">Recommended Mitigation:</strong>
              <p className="font-sans text-[11px] leading-relaxed text-emerald-200">
                Deploy hybrid dual-algorithm encapsulation wrappers and integrate automated KAT regression testing in CI/CD pipeline to eliminate migration bottlenecks.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedFailure(null)}
                className="px-4 py-2 rounded-lg bg-[#0A1224] hover:bg-[#1E2D4A] border border-[#1E2D4A] text-white"
              >
                Close
              </button>
              {onNavigate && (
                <button
                  onClick={() => {
                    setSelectedFailure(null);
                    onNavigate('fmea');
                  }}
                  className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 font-bold"
                >
                  View Full FMEA Module
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
