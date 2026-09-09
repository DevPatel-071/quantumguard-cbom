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
  ArrowUpRight
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
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto my-8 space-y-3">
        <FileText className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">No Active Audit Report Available</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Please execute a cryptographic discovery scan in Scan Studio to generate executive reports and CBOM exports.
        </p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <FileText className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Executive Audit &amp; Migration Plan Reporting
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Generate and export standardized machine-readable CBOM inventories and comprehensive executive post-quantum migration plans.
          </p>
        </div>

        {/* Primary Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => downloadMigrationPlanHtml(cbomReport)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Export Migration Plan (HTML / PDF)</span>
          </button>
          <button
            onClick={() => downloadMigrationPlanJson(cbomReport)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Plan JSON</span>
          </button>
        </div>
      </div>

      {/* Migration Decision Plan Hero Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50/80 via-white to-slate-50/90 border border-blue-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
            <Compass className="w-4 h-4" />
            <span>Executive Post-Quantum Migration Decision Plan</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
            CISO &amp; Board Presentation Ready
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          The QUANTECT Migration Decision Plan compiles your 0–100 Quantum Readiness Score, 4-phase transition roadmap, financial budget estimates, latency benchmark comparisons, and prioritized asset-level playbooks into a standalone, executive-ready HTML / PDF document.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Readiness Score</span>
            <span className="font-bold text-blue-600 text-base">{r ? r.overall_score : 70}/100</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Phase 1 Immediate Assets</span>
            <span className="font-bold text-rose-600 text-base">{rm ? rm.phases[0].asset_count : 12} Assets</span>
          </div>
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Est. Portfolio Budget</span>
            <span className="font-bold text-emerald-600 text-base">${c ? c.total_estimated_cost_usd.toLocaleString() : '82,980'}</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => downloadMigrationPlanHtml(cbomReport)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Generate &amp; Download Executive Migration Plan</span>
          </button>
        </div>
      </div>

      {/* Standardized CBOM & Inventory Exports */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Standardized Cryptography Bill of Materials (CBOM) Exports</span>
          </h3>
          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">CycloneDX 1.6 Schema Compliant</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="font-bold text-xs text-blue-700 block">CycloneDX 1.6 JSON</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Standardized machine-readable CBOM schema including crypto algorithm components, key sizes, and evidence.
              </p>
            </div>
            <button
              onClick={() => downloadCBOMJson(cbomReport)}
              className="w-full py-2 rounded-xl text-xs font-bold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-300 shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Download JSON</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="font-bold text-xs text-emerald-700 block">Flat CSV Spreadsheet</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Tabular spreadsheet containing all discovered assets, line numbers, quantum risk scores, and PQC recommendations.
              </p>
            </div>
            <button
              onClick={() => downloadCBOMCsv(cbomReport)}
              className="w-full py-2 rounded-xl text-xs font-bold bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-300 hover:border-emerald-300 shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-1.5">
              <span className="font-bold text-xs text-indigo-700 block">Technical Audit HTML</span>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Formatted technical audit report with vulnerability findings and NIST/CNSA compliance checklist.
              </p>
            </div>
            <button
              onClick={() => downloadHtmlReport(cbomReport)}
              className="w-full py-2 rounded-xl text-xs font-bold bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-300 hover:border-indigo-300 shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-indigo-600" />
              <span>Download Audit HTML</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

