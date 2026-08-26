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
  Binary
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
      <div className="p-8 text-center text-slate-400">
        No active audit report available. Please execute a cryptographic discovery scan first.
      </div>
    );
  }

  const s = cbomReport.scan_summary;
  const r = cbomReport.readiness_assessment;
  const rm = cbomReport.roadmap_report;
  const c = cbomReport.cost_summary;
  const criticalAssets = cbomReport.assets.filter(a => a.risk_level === 'CRITICAL');

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <FileText className="w-6 h-6 text-emerald-400" />
            <span>Executive Audit & Migration Plan Reporting</span>
          </h1>
          <p className="text-xs text-slate-400">
            Generate and export standardized machine-readable CBOM inventories and comprehensive executive post-quantum migration plans.
          </p>
        </div>

        {/* Primary Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => downloadMigrationPlanHtml(cbomReport)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white shadow-md shadow-indigo-500/20 transition"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Export Migration Plan (HTML / PDF)</span>
          </button>
          <button
            onClick={() => downloadMigrationPlanJson(cbomReport)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Plan JSON</span>
          </button>
        </div>
      </div>

      {/* Migration Decision Plan Hero Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 border border-indigo-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Compass className="w-4 h-4" />
            <span>Executive Post-Quantum Migration Decision Plan</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Ready for CISO & Board Presentation
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The Migration Decision Plan compiles your 0–100 Quantum Readiness Score, 4-phase transition roadmap, financial budget estimates, latency benchmark comparisons, and prioritized asset-level playbooks into a standalone, printable HTML / PDF document.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Readiness Score</span>
            <span className="font-bold text-sky-400 text-sm">{r ? r.overall_score : 70}/100</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Phase 1 Immediate Assets</span>
            <span className="font-bold text-rose-400 text-sm">{rm ? rm.phases[0].asset_count : 12} Assets</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block">Est. Portfolio Budget</span>
            <span className="font-bold text-emerald-400 text-sm">${c ? c.total_estimated_cost_usd.toLocaleString() : '82,980'}</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => downloadMigrationPlanHtml(cbomReport)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-2 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate & Download Executive Migration Plan</span>
          </button>
        </div>
      </div>

      {/* Standardized CBOM & Inventory Exports */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>Standardized Cryptography Bill of Materials (CBOM) Exports</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">CycloneDX 1.6 Schema Compliant</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-xs text-sky-400 block">CycloneDX 1.6 JSON</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Standardized machine-readable CBOM schema including crypto algorithm components, key sizes, and evidence.
            </p>
            <button
              onClick={() => downloadCBOMJson(cbomReport)}
              className="w-full py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-xs text-emerald-400 block">Flat CSV Spreadsheet</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tabular spreadsheet containing all discovered assets, line numbers, quantum risk scores, and PQC recommendations.
            </p>
            <button
              onClick={() => downloadCBOMCsv(cbomReport)}
              className="w-full py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-xs text-purple-400 block">Technical Audit HTML</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Formatted technical audit report with vulnerability findings and NIST/CNSA compliance checklist.
            </p>
            <button
              onClick={() => downloadHtmlReport(cbomReport)}
              className="w-full py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download Audit HTML</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
