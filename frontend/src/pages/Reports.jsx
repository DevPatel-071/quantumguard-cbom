import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ExternalLink,
  Printer,
  Sparkles,
  Binary
} from 'lucide-react';
import { downloadCBOMJson, downloadCBOMCsv, downloadHtmlReport } from '../services/api';

export default function Reports({ cbomReport }) {
  const [downloading, setDownloading] = useState(false);

  if (!cbomReport) {
    return (
      <div className="p-8 text-center text-slate-400">
        No active audit report available. Please execute a cryptographic discovery scan first.
      </div>
    );
  }

  const s = cbomReport.scan_summary;
  const criticalAssets = cbomReport.assets.filter(a => a.risk_level === 'CRITICAL');
  const highAssets = cbomReport.assets.filter(a => a.risk_level === 'HIGH');

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <FileText className="w-6 h-6 text-emerald-400" />
            <span>Executive Audit & Compliance Reporting</span>
          </h1>
          <p className="text-xs text-slate-400">
            Generate and export standardized machine-readable CBOM inventories and executive post-quantum audit reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => downloadCBOMJson(cbomReport)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CycloneDX JSON</span>
          </button>
          <button
            onClick={() => downloadCBOMCsv(cbomReport)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Export</span>
          </button>
          <button
            onClick={() => downloadHtmlReport(cbomReport)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-sky-600 hover:from-emerald-400 hover:to-sky-500 text-white shadow-md shadow-emerald-500/20 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download HTML Report</span>
          </button>
        </div>
      </div>

      {/* Executive Summary Card */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-200">
            Executive Summary & Posture Rating
          </span>
          <span className="text-xs font-mono text-slate-400">
            Audit Target: <strong>{s.target_name}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 font-mono">Overall Quantum Readiness</span>
            <div className={`text-2xl font-black ${s.critical_risk_count > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {s.critical_risk_count > 0 ? 'NEEDS REMEDIATION' : 'SECURE'}
            </div>
            <p className="text-[11px] text-slate-400">Avg Risk: {s.average_risk_score}/100</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 font-mono">Shor Vulnerable Assets</span>
            <div className="text-2xl font-black text-rose-400">{s.quantum_vulnerable_count}</div>
            <p className="text-[11px] text-slate-400">Broken by quantum computers</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 font-mono">Mosca Urgency Status</span>
            <div className={`text-2xl font-black ${s.mosca_urgent_count > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {s.mosca_urgent_count > 0 ? `${s.mosca_urgent_count} URGENT` : 'SAFE'}
            </div>
            <p className="text-[11px] text-slate-400">X + Y &gt; Z condition</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-500 font-mono">PQC-Ready Assets</span>
            <div className="text-2xl font-black text-emerald-400">{s.pqc_ready_count}</div>
            <p className="text-[11px] text-slate-400">FIPS 203/204 compliant</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            <strong>Audit Assessment:</strong> The target system <em>{s.target_name}</em> contains {s.crypto_assets_count} cryptographic assets. 
            Static AST and manifest analysis revealed {s.critical_risk_count} critical-risk assets and {s.high_risk_count} high-risk assets requiring prioritized post-quantum transition.
          </p>
          <p>
            <strong>Recommended Immediate Action:</strong> Replace classical key establishment (ECDH/RSA) with Hybrid X25519 + ML-KEM-768 (FIPS 203) to eliminate Harvest-Now-Decrypt-Later risks. Schedule digital signature migration to ML-DSA-65 (FIPS 204) for long-lived credentials.
          </p>
        </div>
      </div>

      {/* Critical Assets Remediation Table */}
      {criticalAssets.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-rose-500/30 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
            <ShieldAlert className="w-4 h-4" />
            <span>Critical Risk Findings & Remediation Playbook ({criticalAssets.length})</span>
          </div>

          <div className="space-y-3">
            {criticalAssets.slice(0, 6).map((asset) => (
              <div
                key={asset.asset_id}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sky-400 text-xs">
                      #{asset.migration_priority} {asset.asset_id}
                    </span>
                    <span className="font-bold text-slate-200 text-xs">
                      {asset.algorithm} ({asset.key_size ? `${asset.key_size}-bit` : ''})
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      Score: {asset.risk_score}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Location: <span className="text-indigo-300">{asset.file}:{asset.line_number || 1}</span> &bull; Usage: {asset.usage}
                  </div>
                  <p className="text-[11px] text-slate-300">
                    <strong>Evidence:</strong> {asset.evidence}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 md:max-w-xs space-y-1 flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase font-mono text-emerald-400 block">
                    Remediation Target:
                  </span>
                  <p className="font-semibold">{asset.recommended_pqc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance & Standards Roadmap Checklist */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <Binary className="w-4 h-4 text-purple-400" />
          <span>Post-Quantum Regulatory & Standards Compliance Alignment</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="font-bold text-sky-400 font-mono block">NIST FIPS 203 / 204 / 205</span>
            <p className="text-slate-300 leading-relaxed">
              Standardized in August 2024. Replaces RSA and ECC with Module-Lattice and Stateless Hash algorithms.
            </p>
            <div className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full Engine Alignment</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="font-bold text-purple-400 font-mono block">NSA CNSA 2.0 Timeline</span>
            <p className="text-slate-300 leading-relaxed">
              Mandates PQC deployment by 2030 for firmware and by 2033 for networking/web services.
            </p>
            <div className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Timeline Validated</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <span className="font-bold text-emerald-400 font-mono block">CycloneDX 1.6 CBOM</span>
            <p className="text-slate-300 leading-relaxed">
              Standardized Cryptography Bill of Materials schema for software supply chain transparency.
            </p>
            <div className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Schema Exportable</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
