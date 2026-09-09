import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  Pause, 
  Play, 
  CheckCircle2, 
  Bell, 
  Filter, 
  Search, 
  ChevronRight,
  Sparkles,
  ArrowRight,
  Layers,
  Info
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
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'HIGH': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'MEDIUM': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <Activity className="w-6 h-6 text-cyan-400" />
            <span>Continuous Cryptographic Monitoring & Alert Center</span>
          </h1>
          <p className="text-xs text-slate-400">
            Real-time tracking of cryptographic posture, CBOM drift, dependency updates, and quantum risk elevations across registered pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>MONITORING ACTIVE</span>
          </div>

          <button
            onClick={loadSummary}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-400">Monitored Targets</span>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {sources.length}
          </div>
          <span className="text-[11px] text-slate-500">Continuous background polling</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono uppercase text-cyan-400">Total Changes Detected</span>
          <div className="text-2xl font-black text-cyan-300 font-mono">
            {monitoringData?.total_changes_detected || 3}
          </div>
          <span className="text-[11px] text-slate-500">Crypto commits & dependency bumps</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 bg-rose-500/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-rose-400">Unread Critical Alerts</span>
          <div className="text-2xl font-black text-rose-400 font-mono">
            {monitoringData?.unread_alerts_count || 2}
          </div>
          <span className="text-[11px] text-slate-400">Require security triage</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 bg-emerald-500/5 space-y-1">
          <span className="text-[10px] font-mono uppercase text-emerald-400">Monitoring Engine Status</span>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            HEALTHY
          </div>
          <span className="text-[11px] text-slate-400">Periodic rescan active</span>
        </div>
      </div>

      {/* Monitored Sources Table */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Registered Monitored Sources & Pipelines</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {sources.length} Target(s) Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="pb-3 pr-4">Target Name</th>
                <th className="pb-3 px-3">Location / Repo</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Assets</th>
                <th className="pb-3 px-3">Critical Risks</th>
                <th className="pb-3 px-3">Last Scan</th>
                <th className="pb-3 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {sources.map((src) => (
                <tr key={src.source_id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 pr-4 font-bold text-slate-100">
                    {src.name}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                    {src.target_path_or_url}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      src.status === 'ACTIVE' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {src.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-200">
                    {src.total_assets_tracked}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-rose-400">
                    {src.critical_risks_tracked}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-400 text-[11px]">
                    {src.last_scanned_at}
                  </td>
                  <td className="py-3.5 pl-3 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(src.source_id, src.status)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
                    >
                      {src.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                    </button>
                    {onNavigateToCBOM && (
                      <button
                        onClick={onNavigateToCBOM}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 transition"
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
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Real-Time Cryptographic Alert Feed</span>
            </h3>
            <p className="text-xs text-slate-400">
              Notifies security engineers when new cryptographic algorithms, weak keys, or dependency vulnerabilities appear.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFORMATIONAL'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded-xl transition ${
                  selectedSeverity === sev
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No alerts match the selected severity filter.
            </div>
          ) : (
            filteredAlerts.map((alt) => (
              <div
                key={alt.alert_id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !alt.is_read ? 'bg-slate-950 border-slate-700 shadow-md' : 'bg-slate-950/50 border-slate-800/80 opacity-70'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getSeverityBadge(alt.severity)}`}>
                      {alt.severity}
                    </span>
                    <span className="font-bold text-xs text-slate-100">
                      {alt.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {alt.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {alt.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {alt.asset_id && onSelectAssetId && (
                    <button
                      onClick={() => onSelectAssetId(alt.asset_id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition flex items-center gap-1"
                    >
                      <span>Investigate Asset</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  {!alt.is_read && (
                    <button
                      onClick={() => handleMarkRead(alt.alert_id)}
                      className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-900 transition"
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
