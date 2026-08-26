import React from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  Layers, 
  ShieldAlert, 
  BookOpen, 
  FileText,
  Compass,
  Gauge,
  Sliders,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, assetCount = 0, urgentCount = 0, readinessScore = null }) {
  const navSections = [
    {
      title: 'CORE INVENTORY',
      items: [
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
          badge: assetCount > 0 ? `${assetCount}` : null,
          badgeColor: 'bg-slate-900 text-sky-400 border-sky-500/30'
        }
      ]
    },
    {
      title: 'DECISION & READINESS',
      items: [
        {
          id: 'roadmap',
          label: 'Migration Roadmap',
          icon: Compass,
          badge: '4-Phase',
          badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
        },
        {
          id: 'readiness',
          label: 'Quantum Readiness',
          icon: Gauge,
          badge: readinessScore !== null ? `${readinessScore}/100` : null,
          badgeColor: readinessScore >= 75 
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        },
        {
          id: 'simulators',
          label: 'Simulators Lab',
          icon: Sliders,
          badge: 'Lab',
          badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
        }
      ]
    },
    {
      title: 'STANDARDS & REPORTS',
      items: [
        {
          id: 'recommendations',
          label: 'PQC & Hybrid Specs',
          icon: ShieldAlert,
          badge: 'NIST',
          badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        },
        {
          id: 'knowledge-base',
          label: 'Crypto Knowledge Base',
          icon: BookOpen,
          badge: '30+',
          badgeColor: 'bg-slate-900 text-slate-300 border-slate-700'
        },
        {
          id: 'reports',
          label: 'Audit & Migration Reports',
          icon: FileText,
          badge: null
        }
      ]
    }
  ];

  return (
    <aside className="w-64 sm:w-[270px] flex-shrink-0 bg-[#0A0E1A] border-r border-slate-800/80 flex flex-col justify-between select-none z-20 h-[calc(100vh-4rem)]">
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              {section.title}
            </div>

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-200 group text-left ${
                      isActive
                        ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30 shadow-sm shadow-sky-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-sky-400' : 'text-slate-400 group-hover:text-slate-300'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge ? (
                      <span className={`flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                        item.badgeColor || 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {item.badge}
                      </span>
                    ) : (
                      isActive && (
                        <ChevronRight className="w-3.5 h-3.5 text-sky-400/60 flex-shrink-0" />
                      )
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info Pill */}
      <div className="p-3 border-t border-slate-800/80 bg-[#080B14]/60">
        <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-200 font-mono">FIPS 203/204/205</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase font-mono">
              ACTIVE
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-snug">
            ML-KEM, ML-DSA & SLH-DSA post-quantum readiness engine.
          </p>
        </div>
      </div>
    </aside>
  );
}
