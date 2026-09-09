import React from 'react';
import { 
  LayoutDashboard, 
  ScanSearch, 
  Layers, 
  Network,
  ShieldAlert, 
  ShieldCheck,
  BookOpen, 
  FileText,
  Compass,
  Gauge,
  Sliders,
  Activity,
  ChevronLeft,
  ChevronRight
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
          label: 'Scan Studio',
          shortLabel: 'Scanner',
          icon: ScanSearch,
          badge: null
        },
        {
          id: 'cbom',
          label: 'CBOM Inventory',
          shortLabel: 'CBOM',
          icon: Layers,
          badge: assetCount > 0 ? `${assetCount}` : null,
          badgeColor: 'bg-slate-100 text-slate-700 border-slate-300'
        },
        {
          id: 'dependencies',
          label: 'Dependency Intelligence',
          shortLabel: 'Dependencies',
          icon: Network,
          badge: 'Graph',
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
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
          badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
        },
        {
          id: 'readiness',
          label: 'Quantum Risk & Mosca',
          shortLabel: 'Risk & Mosca',
          icon: Gauge,
          badge: readinessScore !== null ? `${readinessScore}/100` : null,
          badgeColor: readinessScore >= 75 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
            : 'bg-amber-50 text-amber-700 border-amber-200'
        },
        {
          id: 'knowledge-base',
          label: 'Crypto Knowledge Base',
          shortLabel: 'Knowledge Base',
          icon: BookOpen,
          badge: '30+',
          badgeColor: 'bg-slate-100 text-slate-600 border-slate-200'
        }
      ]
    },
    {
      title: 'PLAN',
      items: [
        {
          id: 'recommendations',
          label: 'PQC Recommendations',
          shortLabel: 'PQC Specs',
          icon: ShieldCheck,
          badge: 'NIST',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        },
        {
          id: 'roadmap',
          label: 'Migration Roadmap',
          shortLabel: 'Roadmap',
          icon: Compass,
          badge: '4-Phase',
          badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
        }
      ]
    },
    {
      title: 'MONITOR',
      items: [
        {
          id: 'monitoring',
          label: 'Continuous Monitoring',
          shortLabel: 'Monitoring',
          icon: Activity,
          badge: 'Live',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        }
      ]
    },
    {
      title: 'REPORT & LAB',
      items: [
        {
          id: 'reports',
          label: 'Audit Reports',
          shortLabel: 'Reports',
          icon: FileText,
          badge: 'HTML/JSON'
        },
        {
          id: 'simulators',
          label: 'Simulation Lab',
          shortLabel: 'Simulators',
          icon: Sliders,
          badge: 'Interactive',
          badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
        }
      ]
    }
  ];

  return (
    <aside className={`flex-shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between select-none z-20 h-[calc(100vh-4rem)] transition-all duration-200 shadow-xs ${
      collapsed ? 'w-20' : 'w-64 sm:w-[260px]'
    }`}>
      
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!collapsed ? (
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                {section.title}
              </div>
            ) : (
              <div className="w-full h-px bg-slate-200 my-2" />
            )}

            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    title={collapsed ? `${item.label} (${section.title})` : undefined}
                    onClick={() => onSelectTab(item.id)}
                    className={`w-full flex items-center ${collapsed ? 'justify-center py-2.5' : 'justify-between px-3 py-2'} rounded-lg text-xs transition-colors duration-150 group text-left relative ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/80 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
                    }`}
                  >
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5 min-w-0 flex-1 pr-2'}`}>
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                      }`} />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </div>

                    {!collapsed && item.badge && (
                      <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold font-mono border ${
                        item.badgeColor || 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {collapsed && isActive && (
                      <span className="absolute right-1 w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer & Collapse Toggle */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/80">
        {!collapsed && (
          <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1 mb-2 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-800">QUANTECT Core</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase font-mono">
                FIPS 203/204
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Prepare Today, Secure Tomorrow.
            </p>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200 transition shadow-xs"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4 text-blue-600" /> : (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-500" />
              <span className="text-[11px]">Collapse Navigation</span>
            </>
          )}
        </button>
      </div>

    </aside>
  );
}
