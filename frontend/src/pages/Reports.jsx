import React from 'react';
import { 
  FileText, 
  Download, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Printer,
  Sparkles,
  Compass,
  DollarSign,
  Binary,
  ArrowUpRight,
  Eye,
  Check
} from 'lucide-react';
import { 
  downloadCBOMJson, 
  downloadCBOMCsv, 
  downloadHtmlReport,
  downloadMigrationPlanHtml,
  downloadMigrationPlanJson 
} from '../services/api';

export default function Reports({ cbomReport }) {
  if (!cbomReport) {
    return (
      <div className="p-12 text-center command-card max-w-2xl mx-auto my-8 space-y-3">
        <FileText className="w-10 h-10 text-cyan-500/50 mx-auto animate-pulse" />
        <h3 className="text-base font-bold text-white font-mono">No Active Audit Report Available</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Please execute a cryptographic discovery scan in Scan Studio to generate executive reports and CycloneDX 1.6 CBOM exports.
        </p>
      </div>
    );
  }

  const s = cbomReport.scan_summary;
  const r = cbomReport.readiness_assessment;
  const rm = cbomReport.roadmap_report;
  const c = cbomReport.cost_summary;
  const assets = cbomReport.assets || [];
  const criticalAssets = assets.filter(a => a.risk_level === 'CRITICAL');

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto command-grid">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              EXECUTIVE COMPLIANCE &amp; EXPORT ENGINE
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              CYCLONEDX 1.6 &amp; NIST COMPLIANT
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>Executive Audit &amp; Migration Plan Reporting</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate, preview, and export standardized machine-readable CBOM inventories and comprehensive executive post-quantum migration plans.
          </p>
        </div>

        {/* Primary Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => downloadMigrationPlanHtml(cbomReport)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-cyan-glow transition"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Export Migration Plan (HTML / PDF)</span>
          </button>
          <button
            onClick={() => downloadMigrationPlanJson(cbomReport)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold bg-[#0D1730] border border-[#1E2D4A] text-slate-200 hover:border-cyan-500/50 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Plan JSON</span>
          </button>
        </div>
      </div>

      {/* Migration Decision Plan Hero Card */}
      <div className="p-6 rounded-xl command-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold text-sm uppercase">
            <Compass className="w-4 h-4" />
            <span>Executive Post-Quantum Migration Decision Plan</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
            CISO &amp; Board Ready
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl font-sans">
          The QUANTECT Migration Decision Plan compiles your 0–100 Quantum Readiness Score, 4-phase transition roadmap, financial budget estimates, latency benchmark comparisons, and prioritized asset-level playbooks into a standalone, executive-ready document.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
          <div className="p-3.5 rounded-lg bg-[#050A14] border border-[#1E2D4A]">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Readiness Score</span>
            <span className="font-bold text-cyan-400 text-lg">{r ? r.overall_score : 70}/100</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#050A14] border border-rose-500/30">
            <span className="text-[10px] text-rose-400 uppercase tracking-wider font-semibold block">Phase 1 Immediate Assets</span>
            <span className="font-bold text-rose-400 text-lg">{rm ? rm.phases[0]?.asset_count : 12} Assets</span>
          </div>
          <div className="p-3.5 rounded-lg bg-[#050A14] border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold block">Est. Portfolio Budget</span>
            <span className="font-bold text-emerald-400 text-lg">${c ? c.total_estimated_cost_usd?.toLocaleString() : '82,980'}</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => downloadMigrationPlanHtml(cbomReport)}
            className="px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-[#0D1730] hover:bg-cyan-500/20 text-cyan-400 border border-[#1E2D4A] hover:border-cyan-500/50 flex items-center gap-2 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate &amp; Download Executive Migration Plan</span>
          </button>
        </div>
      </div>

      {/* Standardized CBOM & Inventory Exports */}
      <div className="command-card p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
          <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Standardized Cryptography Bill of Materials (CBOM) Exports</span>
          </h3>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-800/60">CycloneDX 1.6 Schema Compliant</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="font-bold text-cyan-400 block">CycloneDX 1.6 JSON</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Standardized machine-readable CBOM schema including crypto algorithm components, key sizes, and evidence.
              </p>
            </div>
            <button
              onClick={() => downloadCBOMJson(cbomReport)}
              className="w-full py-2 rounded-lg text-xs font-bold bg-[#0D1730] hover:bg-cyan-500/20 text-cyan-300 border border-[#1E2D4A] hover:border-cyan-500/50 shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download JSON</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="font-bold text-emerald-400 block">Flat CSV Spreadsheet</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Tabular spreadsheet containing all discovered assets, line numbers, quantum risk scores, and PQC recommendations.
              </p>
            </div>
            <button
              onClick={() => downloadCBOMCsv(cbomReport)}
              className="w-full py-2 rounded-lg text-xs font-bold bg-[#0D1730] hover:bg-emerald-500/20 text-emerald-300 border border-[#1E2D4A] hover:border-emerald-500/50 shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="font-bold text-indigo-400 block">Technical Audit HTML</span>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Formatted technical audit report with vulnerability findings and NIST/CNSA compliance checklist.
              </p>
            </div>
            <button
              onClick={() => downloadHtmlReport(cbomReport)}
              className="w-full py-2 rounded-lg text-xs font-bold bg-[#0D1730] hover:bg-indigo-500/20 text-indigo-300 border border-[#1E2D4A] hover:border-indigo-500/50 shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download Audit HTML</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
