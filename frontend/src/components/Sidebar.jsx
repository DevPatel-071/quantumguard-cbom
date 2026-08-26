import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  Layers, 
  ShieldAlert, 
  Activity, 
  BookOpen, 
  FileText,
  Clock,
  Compass,
  Gauge,
  Sliders,
  DollarSign
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, assetCount = 0, urgentCount = 0, readinessScore = null }) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'scan',
      label: 'Discovery Scanner',
      icon: Scan,
      badge: null
    },
    {
      id: 'cbom',
      label: 'CBOM Inventory',
      icon: Layers,
      badge: assetCount > 0 ? `${assetCount}` : null
    },
    {
      id: 'roadmap',
      label: 'Migration Roadmap',
      icon: Compass,
      badge: '4-Phase',
      badgeColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
    },
    {
      id: 'readiness',
      label: 'Quantum Readiness',
      icon: Gauge,
      badge: readinessScore !== null ? `${readinessScore}/100` : null,
      badgeColor: readinessScore >= 75 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    {
      id: 'simulators',
      label: 'Simulators & Lab',
      icon: Sliders,
      badge: 'Latency / HNDL / Cost'
    },
    {
      id: 'recommendations',
      label: 'PQC & Hybrid Specs',
      icon: ShieldAlert,
      badge: 'FIPS 203/204'
    },
    {
      id: 'knowledge-base',
      label: 'Crypto Knowledge Base',
      icon: BookOpen,
      badge: '30+ Alg'
    },
    {
      id: 'reports',
      label: 'Audit & Migration Reports',
      icon: FileText,
      badge: null
    }
  ];

  return (
    <aside className="w-64 bg-slate-950/80 border-r border-slate-800/80 flex flex-col justify-between p-3.5 select-none z-20 backdrop-blur-md">
      <div className="space-y-6">
        <div className="px-3 pt-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            Navigation & Decision Core
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30 shadow-sm shadow-sky-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                    item.badgeColor || 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-200">NIST PQC Finalized</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          FIPS 203 (ML-KEM), FIPS 204 (ML-DSA), and FIPS 205 (SLH-DSA) active standards engine.
        </p>
      </div>
    </aside>
  );
}
