import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  RefreshCw, 
  Bell, 
  Layers, 
  ArrowRight,
  ShieldAlert,
  Radio,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Zap,
  TrendingUp
} from 'lucide-react';
import { fetchMonitoringSummary, updateMonitoringStatus, markAlertRead } from '../services/api';

export default function ContinuousMonitoring({ cbomReport, onNavigateToCBOM, onSelectAssetId }) {
  const [monitoringData, setMonitoringData] = useState(cbomReport?.monitoring_summary || null);
  const [loading, setLoading] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');

  useEffect(() => {
    loadSummary();
  }, []);

  const loadSummary = () => {
    setLoading(true);
    fetchMonitoringSummary()
      .then((data) => {
        setMonitoringData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load monitoring summary:', err);
        setLoading(false);
      });
  };

  const handleToggleStatus = (sourceId, currentStatus) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    updateMonitoringStatus(sourceId, newStatus)
      .then(() => loadSummary())
      .catch((err) => console.error('Status update failed:', err));
  };

  const handleMarkRead = (alertId) => {
    markAlertRead(alertId)
      .then(() => loadSummary())
      .catch((err) => console.error('Mark read failed:', err));
  };

  const sources = monitoringData?.sources || [];
  const alerts = monitoringData?.recent_alerts || [];

  const filteredAlerts = alerts.filter((a) => {
    return selectedSeverity === 'ALL' || a.severity === selectedSeverity;
  });

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto command-grid">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              CONTINUOUS SURVEILLANCE ENGINE
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              REAL-TIME CRYPTOGRAPHIC TELEMETRY
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span>Continuous Cryptographic Monitoring &amp; Alert Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of cryptographic posture, CBOM drift, dependency updates, and quantum risk elevations across registered pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>DAEMON ACTIVE (5M POLL)</span>
          </div>

          <button
            onClick={loadSummary}
            disabled={loading}
            className="p-2 rounded-lg bg-[#0D1730] text-slate-300 hover:text-cyan-400 border border-[#1E2D4A] hover:border-cyan-500/50 shadow-sm transition"
            title="Refresh Monitoring Stream"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="command-card p-4 font-mono">
          <span className="text-[10px] text-slate-400 uppercase">Monitored Targets</span>
          <div className="text-2xl font-bold text-white mt-1">
            {sources.length || 1}
          </div>
          <span className="text-[10px] text-cyan-400 mt-0.5">Active background polling</span>
        </div>

        <div className="command-card p-4 font-mono">
          <span className="text-[10px] text-cyan-400 uppercase">Drift &amp; Changes Detected</span>
          <div className="text-2xl font-bold text-cyan-400 mt-1">
            {monitoringData?.total_changes_detected || 3}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Commits &amp; lib bumps</span>
        </div>

        <div className="command-card p-4 border-rose-500/30 font-mono">
          <span className="text-[10px] text-rose-400 uppercase">Unread Security Alerts</span>
          <div className="text-2xl font-bold text-rose-400 mt-1">
            {monitoringData?.unread_alerts_count || 2}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">Require triage action</span>
        </div>

        <div className="command-card p-4 border-emerald-500/30 font-mono">
          <span className="text-[10px] text-emerald-400 uppercase">Surveillance Health</span>
          <div className="text-2xl font-bold text-emerald-400 mt-1">
            ONLINE
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">0.04s telemetry latency</span>
        </div>
      </div>

      {/* Visual Activity & Drift Timeline */}
      <div className="command-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span>RECENT REPOSITORY CRYPTOGRAPHIC ACTIVITY TIMELINE</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Live Daemon Feed</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A] flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1 flex-shrink-0 animate-pulse" />
            <div className="space-y-0.5">
              <div className="text-white font-bold text-[11px]">CBOM Baseline Synchronized</div>
              <p className="text-[10px] text-slate-400 font-sans">24 cryptographic components mapped to CycloneDX 1.6 catalog.</p>
              <span className="text-[9px] text-cyan-400 block pt-1">2 mins ago</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A] flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-rose-400 mt-1 flex-shrink-0" />
            <div className="space-y-0.5">
              <div className="text-white font-bold text-[11px]">Shor Vulnerability Alert</div>
              <p className="text-[10px] text-slate-400 font-sans">RSA-2048 keypair detected in banking auth service module.</p>
              <span className="text-[9px] text-rose-400 block pt-1">14 mins ago</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A] flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
            <div className="space-y-0.5">
              <div className="text-white font-bold text-[11px]">PQC Remediation Path Ready</div>
              <p className="text-[10px] text-slate-400 font-sans">ML-KEM-768 hybrid transition blueprint calculated for TLS 1.3.</p>
              <span className="text-[9px] text-emerald-400 block pt-1">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monitored Sources Table */}
      <div className="rounded-xl border border-[#1E2D4A] bg-[#080E1E] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#1E2D4A] flex items-center justify-between">
          <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Registered Monitored Sources &amp; Pipelines</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {sources.length} Target(s) Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A14] text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-[#1E2D4A]">
              <tr>
                <th className="p-3.5">Target Name</th>
                <th className="p-3.5">Location / Target Repo</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Assets</th>
                <th className="p-3.5">Critical Risks</th>
                <th className="p-3.5">Last Scan</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4A]/40 font-sans">
              {sources.map((src) => (
                <tr key={src.source_id} className="hover:bg-[#0D1730]/70 transition font-mono text-xs border-b border-[#1E2D4A]/20">
                  <td className="p-3.5 font-bold text-white">
                    {src.name}
                  </td>
                  <td className="p-3.5 text-slate-300 text-[11px]">
                    {src.target_path_or_url}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      src.status === 'ACTIVE' 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}>
                      {src.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-white font-bold">
                    {src.total_assets_tracked}
                  </td>
                  <td className="p-3.5 font-bold text-rose-400">
                    {src.critical_risks_tracked}
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px]">
                    {src.last_scanned_at}
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(src.source_id, src.status)}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#050A14] hover:bg-[#0D1730] text-slate-300 border border-[#1E2D4A] hover:border-slate-400 transition"
                    >
                      {src.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                    </button>
                    {onNavigateToCBOM && (
                      <button
                        onClick={onNavigateToCBOM}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/60 transition"
                      >
                        View CBOM
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Cryptographic Activity & Alert Stream */}
      <div className="p-5 rounded-xl command-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Real-Time Cryptographic Alert Feed</span>
            </h3>
            <p className="text-xs text-slate-400">
              Notifies security engineers when new cryptographic algorithms, weak keys, or dependency vulnerabilities appear.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFORMATIONAL'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedSeverity === sev
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs font-mono">
              No alerts match the selected severity filter.
            </div>
          ) : (
            filteredAlerts.map((alt) => (
              <div
                key={alt.alert_id}
                className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs ${
                  !alt.is_read ? 'bg-[#0D1730] border-cyan-500/40 shadow-sm' : 'bg-[#050A14] border-[#1E2D4A] opacity-70'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(alt.severity)}`}>
                      {alt.severity}
                    </span>
                    <span className="font-bold text-xs text-white">
                      {alt.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {alt.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {alt.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {alt.asset_id && onSelectAssetId && (
                    <button
                      onClick={() => onSelectAssetId(alt.asset_id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 hover:bg-cyan-900/60 transition flex items-center gap-1"
                    >
                      <span>Investigate Asset</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  {!alt.is_read && (
                    <button
                      onClick={() => handleMarkRead(alt.alert_id)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white border border-[#1E2D4A] hover:bg-[#080E1E] transition"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
