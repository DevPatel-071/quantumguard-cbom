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
  Calculator,
  Activity, 
  ChevronLeft, 
  ChevronRight,
  Cpu,
  Terminal,
  Radio
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
      title: 'COMMAND',
      items: [
        {
          id: 'dashboard',
          label: 'Executive Center',
          icon: LayoutDashboard,
          badge: 'LIVE',
          badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
        }
      ]
    },
    {
      title: 'DISCOVERY',
      items: [
        {
          id: 'scan',
          label: 'Scan Studio',
          icon: ScanSearch,
          badge: null
        },
        {
          id: 'cbom',
          label: 'CBOM Inventory',
          icon: Layers,
          badge: assetCount > 0 ? `${assetCount}` : null,
          badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-500/40'
        },
        {
          id: 'dependencies',
          label: 'Dependency Intelligence',
          icon: Network,
          badge: 'GRAPH',
          badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40'
        }
      ]
    },
    {
      title: 'INTELLIGENCE',
      items: [
        {
          id: 'readiness',
          label: 'Quantum Risk',
          icon: Gauge,
          badge: readinessScore !== null ? `${readinessScore}` : null,
          badgeColor: readinessScore >= 75 
            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
            : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
        },
        {
          id: 'fmea',
          label: 'FMEA Analysis',
          icon: ShieldAlert,
          badge: 'RPN',
          badgeColor: 'bg-rose-950/80 text-rose-300 border-rose-500/40'
        },
        {
          id: 'knowledge-base',
          label: 'Crypto Knowledge Base',
          icon: BookOpen,
          badge: '30+',
          badgeColor: 'bg-slate-900 text-slate-400 border-slate-700'
        }
      ]
    },
    {
      title: 'MIGRATION',
      items: [
        {
          id: 'recommendations',
          label: 'PQC Recommendations',
          icon: ShieldCheck,
          badge: 'NIST',
          badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
        },
        {
          id: 'roadmap',
          label: 'Migration Roadmap',
          icon: Compass,
          badge: '4-PHASE',
          badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-500/40'
        },
        {
          id: 'simulators',
          label: 'Cost Estimator',
          icon: Calculator,
          badge: 'BUDGET',
          badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-500/40'
        }
      ]
    },
    {
      title: 'MONITOR',
      items: [
        {
          id: 'monitoring',
          label: 'Continuous Monitoring',
          icon: Activity,
          badge: 'ACTIVE',
          badgeColor: 'bg-emerald-950/90 text-emerald-300 border-emerald-400/50'
        }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        {
          id: 'reports',
          label: 'Audit Reports',
          icon: FileText,
          badge: '1.6 SPEC',
          badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
        }
      ]
    }
  ];

  return (
    <aside className={`flex-shrink-0 bg-command-bg/95 border-r border-command-border/80 flex flex-col justify-between select-none z-30 h-[calc(100vh-4rem)] transition-all duration-200 shadow-2xl ${
      collapsed ? 'w-20' : 'w-64 sm:w-[260px]'
    }`}>
      
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            {!collapsed ? (
              <div className="px-3 text-[10px] font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-cyan-400/80" />
                <span>{section.title}</span>
              </div>
            ) : (
              <div className="w-full h-px bg-command-border/80 my-2" />
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
                    className={`w-full flex items-center ${collapsed ? 'justify-center py-2.5' : 'justify-between px-3 py-2'} rounded-xl text-xs transition-all duration-150 group text-left relative ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/50 text-cyan-300 font-bold border border-cyan-500/40 shadow-cyan-glow'
                        : 'text-slate-400 hover:text-white hover:bg-command-card/80 border border-transparent font-medium'
                    }`}
                  >
                    <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5 min-w-0 flex-1 pr-2'}`}>
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-all ${
                        isActive ? 'text-command-cyan glow-cyan' : 'text-slate-400 group-hover:text-cyan-300'
                      }`} />
                      {!collapsed && (
                        <span className="truncate font-sans">{item.label}</span>
                      )}
                    </div>

                    {!collapsed && item.badge && (
                      <span className={`flex-shrink-0 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                        item.badgeColor || 'bg-slate-900 text-slate-400 border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {collapsed && isActive && (
                      <span className="absolute right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-cyan-glow animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Status & Collapse Toggle */}
      <div className="p-3 border-t border-command-border/80 bg-command-surface/90">
        {!collapsed && (
          <div className="p-2.5 rounded-xl bg-command-card/80 border border-command-border space-y-1 mb-2 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-emerald-glow animate-pulse" />
                <span className="font-bold text-white">ENGINE ONLINE</span>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 uppercase">
                FIPS 203/204
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono tracking-wide leading-tight">
              Prepare Today, Secure Tomorrow.
            </p>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-cyan-300 hover:bg-command-card border border-command-border transition-all shadow-xs"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4 text-cyan-400" /> : (
            <>
              <ChevronLeft className="w-4 h-4 text-slate-400" />
              <span className="text-[11px] font-medium">Collapse Navigation</span>
            </>
          )}
        </button>
      </div>

    </aside>
  );
}
