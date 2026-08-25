import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  Layers, 
  Sliders, 
  Compass, 
  BookOpen, 
  FileText,
  ShieldAlert,
  Binary
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, assetCount, urgentCount }) {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan Studio', icon: Scan },
    { 
      id: 'cbom', 
      label: 'CBOM Inventory', 
      icon: Layers, 
      badge: assetCount > 0 ? assetCount : null,
      badgeColor: 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
    },
    { 
      id: 'mosca', 
      label: 'Mosca Lab (X+Y>Z)', 
      icon: Sliders,
      badge: urgentCount > 0 ? `${urgentCount} Urgent` : null,
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
    },
    { id: 'recommendations', label: 'PQC & Hybrid Roadmap', icon: Compass },
    { id: 'knowledge-base', label: 'Crypto Knowledge Base', icon: BookOpen },
    { id: 'reports', label: 'Audit & Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-[#0F172A]/70 backdrop-blur-md flex flex-col justify-between p-4 flex-shrink-0">
      <div className="space-y-6">
        <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-mono">
          Navigation & Analytics
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/10 text-sky-300 border border-sky-500/40 shadow-sm shadow-sky-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom PQC Compliance Info Box */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center gap-2 text-purple-400 font-bold">
          <Binary className="w-3.5 h-3.5" />
          <span>NIST PQC Ready</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Standardized algorithms: ML-KEM (FIPS 203), ML-DSA (FIPS 204), SLH-DSA (FIPS 205).
        </p>
        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 flex justify-between items-center font-mono">
          <span>Q-CBOM v1.0</span>
          <span className="text-emerald-400">ENGINE LIVE</span>
        </div>
      </div>
    </aside>
  );
}
