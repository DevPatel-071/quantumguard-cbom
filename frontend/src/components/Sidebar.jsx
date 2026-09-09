import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Scan, 
  Layers, 
  Network,
  ShieldAlert, 
  ShieldCheck,
  AlertTriangle,
  BookOpen, 
  FileText,
  Compass,
  Gauge,
  Sliders,
  Activity,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  onSelectTab, 
  assetCount = 0, 
  readinessScore = null,
  collapsed,
  onToggleCollapse
}) {
  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Executive Command Center',
          shortLabel: 'Dashboard',
          icon: LayoutDashboard,
          badge: null
        }
      ]
    },
    {
      title: 'DISCOVER',
      items: [
        {
          id: 'scan',
          label: 'Discovery Scanner',
          shortLabel: 'Scanner',
          icon: Scan,
          badge: null
        },
        {
          id: 'cbom',
          label: 'CBOM Inventory',
          shortLabel: 'CBOM',
          icon: Layers,
          badge: assetCount > 0 ? `${assetCount}` : null,
          badgeColor: 'bg-slate-900 text-cyan-400 border-cyan-500/30'
        },
        {
          id: 'dependencies',
          label: 'Dependency Intelligence',
          shortLabel: 'Dependencies',
          icon: Network,
          badge: 'Graph',
          badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
        }
      ]
    },
    {
      title: 'ANALYZE',
      items: [
        {
          id: 'fmea',
          label: 'Quantum FMEA Analysis',
          shortLabel: 'FMEA',
          icon: ShieldAlert,
          badge: 'RPN',
          badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        },
        {
          id: 'readiness',
          label: 'Quantum Readiness',
          shortLabel: 'Readiness',
          icon: Gauge,
          badge: readinessScore !== null ? `${readinessScore}/100` : null,
          badgeColor: readinessScore >= 75 
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        },
        {
          id: 'knowledge-base',
          label: 'Crypto Knowledge Base',
          shortLabel: 'Knowledge Base',
          icon: BookOpen,
          badge: '30+',
          badgeColor: 'bg-slate-900 text-slate-300 border-slate-700'
        }
      ]
    },
    {
      title: 'PLAN & MIGRATE',
      items: [
        {
          id: 'roadmap',
          label: 'Migration Roadmap',
          shortLabel: 'Roadmap',
          icon: Compass,
          badge: '4-Phase',
          badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
        },
        {
          id: 'recommendations',
          label: 'PQC & Hybrid Specs',
          shortLabel: 'PQC Specs',
          icon: ShieldCheck,
          badge: 'NIST',
          badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        },
        {
          id: 'simulators',
          label: 'Simulators Lab',
          shortLabel: 'Simulators',
          icon: Sliders,
          badge: 'Lab',
          badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
        }
      ]
    },
    {
      title: 'MONITOR & AUDIT',
      items: [
        {
          id: 'monitoring',
          label: 'Continuous Monitoring',
          shortLabel: 'Monitoring',
          icon: Activity,
          badge: 'Active',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
        },
        {
          id: 'reports',
          label: 'Audit & Migration Reports',
          shortLabel: 'Reports',
          icon: FileText,
          badge: 'HTML/JSON'
        }
      ]
    }
  ];

  return (
    <aside className={`flex-shrink-0 bg-[#070B14] border-r border-slate-800/80 flex flex-col justify-between select-none z-20 h-[calc(100vh-4rem)] transition-all duration-300 ${
      collapsed ? 'w-20' : 'w-64 sm:w-[270px]'
    }`}>
      
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto px-2.5 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            {!collapsed ? (
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                {section.title}
              </div>
            ) : (
              <div className="w-full h-px bg-slate-800 my-2" />
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    title={collapsed ? `${item.label} (${section.title})` : undefined}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center ${collapsed ? 'justify-center py-3' : 'justify-between px-3 py-2.5'} rounded-xl text-xs transition-all duration-200 group text-left relative ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 font-medium'
                    }`}
                  >
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5 min-w-0 flex-1 pr-2'}`}>
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                      }`} />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!collapsed && item.badge && (
                      <span className={`flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono border ${
                        item.badgeColor || 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {collapsed && isActive && (
                      <span className="absolute right-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer & Collapse Toggle */}
      <div className="p-3 border-t border-slate-800/80 bg-[#050810]">
        {!collapsed && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/80 space-y-1.5 mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-200 font-mono">QUANTECT FIPS</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase font-mono">
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-snug">
              Prepare Today, Secure Tomorrow. NIST FIPS 203 / 204 / 205.
            </p>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-slate-800 transition"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4 text-cyan-400" /> : (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
              <span className="text-[11px]">Collapse Navigation</span>
            </>
          )}
        </button>
      </div>

    </aside>
  );
}
