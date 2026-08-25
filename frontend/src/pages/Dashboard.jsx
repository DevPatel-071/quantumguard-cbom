import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Cpu, 
  ArrowUpRight, 
  Activity,
  Download,
  Sliders,
  ExternalLink,
  ChevronRight,
  Zap,
  BarChart3,
  PieChart
} from 'lucide-react';
import { downloadCBOMJson, downloadCBOMCsv } from '../services/api';

export default function Dashboard({ cbomReport, onNavigate, onSelectAsset }) {
  if (!cbomReport) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400">
          <Layers className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-200">No Scan Active</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Start by selecting a pre-loaded sample repository or uploading your codebase in the Scan Studio.
        </p>
        <button
          onClick={() => onNavigate('scan')}
          className="px-5 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/20 transition"
        >
          Launch Scan Studio
        </button>
      </div>
    );
  }

  const s = cbomReport.scan_summary;
  const topPriorities = (cbomReport.assets || []).slice(0, 5);

  const riskBadgeStyles = {
    CRITICAL: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    LOW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Welcome & Meta Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
              Executive Cryptographic & PQC Risk Posture
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
              {s.target_name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Scan ID: {s.scan_id} &bull; Timestamp: {new Date(s.scan_timestamp).toLocaleString()} &bull; Files: {s.files_scanned}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => downloadCBOMJson(cbomReport)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CycloneDX JSON</span>
          </button>
          <button
            onClick={() => downloadCBOMCsv(cbomReport)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Export</span>
          </button>
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-md shadow-sky-500/20 transition"
          >
            <span>Full Audit Report</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mosca Urgent Alert Banner */}
      {s.mosca_urgent_count > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-slate-900 border border-amber-500/40 shadow-lg shadow-amber-500/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex-shrink-0">
              <Clock className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-amber-300 text-sm">
                  Active Mosca Migration Urgency Alert (X + Y &gt; Z)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {s.mosca_urgent_count} ASSETS AT RISK
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                Information lifetime combined with estimated migration duration exceeds the quantum threat horizon. Adversaries can harvest encrypted handshakes today for future quantum decryption.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('mosca')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition whitespace-nowrap"
          >
            <Sliders className="w-4 h-4" />
            <span>Simulate in Mosca Lab</span>
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>TOTAL ASSETS</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100">
            {s.crypto_assets_count}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Across {s.libraries_detected} crypto libraries
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SHOR VULNERABLE</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400">
            {s.quantum_vulnerable_count}
          </div>
          <div className="text-[11px] text-rose-300/70 font-mono">
            RSA, ECC, ECDH, DH, Ed25519
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>CRITICAL RISK</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-500">
            {s.critical_risk_count}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Risk score &ge; 75 / 100
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>HIGH RISK</span>
            <AlertTriangle className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-extrabold text-orange-400">
            {s.high_risk_count}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Risk score 50 - 74.9
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>MOSCA URGENT</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {s.mosca_urgent_count}
          </div>
          <div className="text-[11px] text-amber-300/70 font-mono">
            Condition X+Y &gt; Z
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>PQC READY</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">
            {s.pqc_ready_count}
          </div>
          <div className="text-[11px] text-emerald-300/70 font-mono">
            ML-KEM / ML-DSA / Hybrid
          </div>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Algorithm Distribution Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              <span>Algorithm Breakdown</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {Object.keys(s.algorithm_counts || {}).length} Types
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(s.algorithm_counts || {}).map(([algo, count]) => {
              const pct = Math.round((count / (s.crypto_assets_count || 1)) * 100);
              const isVulnerable = ['RSA', 'ECC', 'ECDSA', 'ECDH', 'ED25519', 'DIFFIE', '3DES', 'MD5', 'SHA1'].includes(algo);
              return (
                <div key={algo} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className={`font-bold ${isVulnerable ? 'text-rose-300' : 'text-emerald-300'}`}>
                      {algo}
                    </span>
                    <span className="text-slate-400">{count} assets ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isVulnerable
                          ? 'bg-gradient-to-r from-rose-500 to-orange-500'
                          : 'bg-gradient-to-r from-emerald-500 to-sky-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Distribution Card */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <PieChart className="w-4 h-4 text-purple-400" />
              <span>Risk Tier Distribution</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Avg: {s.average_risk_score}/100
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-1">
              <span className="text-[11px] text-rose-400 font-bold block">CRITICAL RISK</span>
              <div className="text-2xl font-extrabold text-rose-400">{s.risk_distribution?.CRITICAL || 0}</div>
              <span className="text-[10px] text-slate-400">Immediate action</span>
            </div>
            <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-1">
              <span className="text-[11px] text-orange-400 font-bold block">HIGH RISK</span>
              <div className="text-2xl font-extrabold text-orange-400">{s.risk_distribution?.HIGH || 0}</div>
              <span className="text-[10px] text-slate-400">Priority roadmap</span>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <span className="text-[11px] text-amber-400 font-bold block">MEDIUM RISK</span>
              <div className="text-2xl font-extrabold text-amber-400">{s.risk_distribution?.MEDIUM || 0}</div>
              <span className="text-[10px] text-slate-400">Monitor & plan</span>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <span className="text-[11px] text-emerald-400 font-bold block">LOW RISK</span>
              <div className="text-2xl font-extrabold text-emerald-400">{s.risk_distribution?.LOW || 0}</div>
              <span className="text-[10px] text-slate-400">Post-quantum safe</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400 leading-relaxed border-t border-slate-800">
            <strong>Risk Formula:</strong> Multi-factor calculation weighing Shor/Grover quantum threat, Mosca timeline urgency, exposure, and business criticality.
          </div>
        </div>

        {/* Evidence Confidence Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Evidence Confidence</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Precision Model</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-bold text-slate-200 block">Confirmed Usage</span>
                  <span className="text-[11px] text-slate-400">Direct AST API invocation</span>
                </div>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {s.confidence_distribution?.CONFIRMED_USAGE || 0}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                <div>
                  <span className="font-bold text-slate-200 block">Potential Usage</span>
                  <span className="text-[11px] text-slate-400">Imports / Container pkgs</span>
                </div>
              </div>
              <span className="font-mono font-bold text-sky-400 text-sm">
                {s.confidence_distribution?.POTENTIAL_USAGE || 0}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <div>
                  <span className="font-bold text-slate-200 block">Dependency Only</span>
                  <span className="text-[11px] text-slate-400">Manifest only (no code call)</span>
                </div>
              </div>
              <span className="font-mono font-bold text-purple-400 text-sm">
                {s.confidence_distribution?.DEPENDENCY_ONLY || 0}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Top 5 Priority Assets Quick Table */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Top Migration Priorities (Ranked Order)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Deterministic priority backlog ranked by combined risk score, Mosca urgency, and business criticality.
            </p>
          </div>

          <button
            onClick={() => onNavigate('cbom')}
            className="flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition"
          >
            <span>View Complete CBOM ({cbomReport.assets.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Algorithm</th>
                <th className="p-3">File Location</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Risk Level</th>
                <th className="p-3">Target PQC Alternative</th>
                <th className="p-3 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {topPriorities.map((asset) => (
                <tr 
                  key={asset.asset_id}
                  onClick={() => onSelectAsset(asset)}
                  className="hover:bg-slate-800/40 cursor-pointer transition"
                >
                  <td className="p-3 font-mono font-bold text-sky-400">
                    #{asset.migration_priority}
                  </td>
                  <td className="p-3">
                    <div className="font-bold text-slate-200">{asset.algorithm}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {asset.key_size ? `${asset.key_size} bit` : ''} {asset.usage}
                    </div>
                  </td>
                  <td className="p-3 font-mono text-indigo-300">
                    {asset.file}:{asset.line_number || 1}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {asset.confidence}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskBadgeStyles[asset.risk_level]}`}>
                      {asset.risk_level} ({asset.risk_score})
                    </span>
                  </td>
                  <td className="p-3 text-emerald-400 font-medium">
                    {asset.recommended_pqc}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAsset(asset);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold transition"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
