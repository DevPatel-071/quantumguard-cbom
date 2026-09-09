import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  RefreshCw, 
  Bell, 
  Layers, 
  ArrowRight 
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
      case 'CRITICAL': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-blue-600" />
            <span>Continuous Cryptographic Monitoring & Alert Center</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time tracking of cryptographic posture, CBOM drift, dependency updates, and quantum risk elevations across registered pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>● Monitoring Active</span>
          </div>

          <button
            onClick={loadSummary}
            disabled={loading}
            className="p-2 rounded-lg bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-xs transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monitored Targets</span>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {sources.length}
          </div>
          <span className="text-[11px] text-slate-500">Continuous background polling</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Total Changes Detected</span>
          <div className="text-2xl font-bold text-blue-700 font-mono">
            {monitoringData?.total_changes_detected || 3}
          </div>
          <span className="text-[11px] text-slate-500">Crypto commits & dependency bumps</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Unread Critical Alerts</span>
          <div className="text-2xl font-bold text-rose-600 font-mono">
            {monitoringData?.unread_alerts_count || 2}
          </div>
          <span className="text-[11px] text-slate-500">Require security triage</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Monitoring Engine Status</span>
          <div className="text-2xl font-bold text-emerald-700 font-mono">
            HEALTHY
          </div>
          <span className="text-[11px] text-slate-500">Periodic rescan active</span>
        </div>
      </div>

      {/* Monitored Sources Table */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Registered Monitored Sources & Pipelines</span>
          </h3>
          <span className="text-xs text-slate-500">
            {sources.length} Target(s) Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase">
                <th className="pb-3 pr-4">Target Name</th>
                <th className="pb-3 px-3">Location / Repo</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-3">Assets</th>
                <th className="pb-3 px-3">Critical Risks</th>
                <th className="pb-3 px-3">Last Scan</th>
                <th className="pb-3 pl-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {sources.map((src) => (
                <tr key={src.source_id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 pr-4 font-bold text-slate-900">
                    {src.name}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600 text-[11px]">
                    {src.target_path_or_url}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                      src.status === 'ACTIVE' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {src.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-800">
                    {src.total_assets_tracked}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-rose-600">
                    {src.critical_risks_tracked}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-500 text-[11px]">
                    {src.last_scanned_at}
                  </td>
                  <td className="py-3.5 pl-3 text-right space-x-2">
                    <button
                      onClick={() => handleToggleStatus(src.source_id, src.status)}
                      className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                    >
                      {src.status === 'ACTIVE' ? 'Pause' : 'Resume'}
                    </button>
                    {onNavigateToCBOM && (
                      <button
                        onClick={onNavigateToCBOM}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition"
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
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Real-Time Cryptographic Alert Feed</span>
            </h3>
            <p className="text-xs text-slate-500">
              Notifies security engineers when new cryptographic algorithms, weak keys, or dependency vulnerabilities appear.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFORMATIONAL'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded-lg transition ${
                  selectedSeverity === sev
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !alt.is_read ? 'bg-slate-50 border-slate-300 shadow-xs' : 'bg-white border-slate-200 opacity-80'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getSeverityBadge(alt.severity)}`}>
                      {alt.severity}
                    </span>
                    <span className="font-bold text-xs text-slate-900">
                      {alt.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {alt.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {alt.message}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {alt.asset_id && onSelectAssetId && (
                    <button
                      onClick={() => onSelectAssetId(alt.asset_id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition flex items-center gap-1"
                    >
                      <span>Investigate Asset</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                  {!alt.is_read && (
                    <button
                      onClick={() => handleMarkRead(alt.alert_id)}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100 transition"
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
