import React, { useState, useMemo } from 'react';
import { 
  Network, 
  Search, 
  ChevronRight,
  ShieldAlert,
  Layers,
  FileCode,
  Package,
  Cpu,
  Radio,
  Zap,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

export default function DependencyIntelligence({ cbomReport, onSelectAsset }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [viewMode, setViewMode] = useState('GRAPH'); // 'GRAPH' or 'LIST'

  if (!cbomReport) {
    return (
      <div className="p-12 text-center text-slate-400 command-card max-w-xl mx-auto my-12">
        <Network className="w-12 h-12 text-cyan-500/50 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-bold text-white mb-2">No Active Dependency Graph</h3>
        <p className="text-xs text-slate-400 mb-4">Execute a scan in Scan Studio to generate multi-tier cryptographic dependency call chains.</p>
      </div>
    );
  }

  const depGraph = cbomReport.dependency_graph;
  const rawNodes = depGraph?.nodes || [];
  const rawEdges = depGraph?.edges || [];

  // Categorize nodes by Tier for layout
  const tiers = {
    APPLICATION: { title: '1. Application Entry', color: '#38BDF8', icon: Layers },
    FILE: { title: '2. Source Modules', color: '#818CF8', icon: FileCode },
    LIBRARY: { title: '3. Packages & Libs', color: '#A855F7', icon: Package },
    CAPABILITY: { title: '4. Crypto Primitive', color: '#F59E0B', icon: Cpu },
    ALGORITHM: { title: '5. Quantum Risk Target', color: '#EF4444', icon: ShieldAlert }
  };

  // Find active node
  const activeNode = rawNodes.find(n => n.id === selectedNodeId) || rawNodes[0] || null;

  // Determine connected edges & nodes for impact propagation
  const connectedContext = useMemo(() => {
    if (!activeNode) return { connectedNodeIds: new Set(), upstreamEdges: [], downstreamEdges: [] };
    
    const connectedNodeIds = new Set([activeNode.id]);
    const downstreamEdges = [];
    const upstreamEdges = [];

    // Find direct outgoing (downstream)
    rawEdges.forEach(e => {
      if (e.source === activeNode.id) {
        downstreamEdges.push(e);
        connectedNodeIds.add(e.target);
      }
      if (e.target === activeNode.id) {
        upstreamEdges.push(e);
        connectedNodeIds.add(e.source);
      }
    });

    return { connectedNodeIds, upstreamEdges, downstreamEdges };
  }, [activeNode, rawEdges]);

  // Group nodes by tier for the visual diagram
  const nodesByTier = useMemo(() => {
    const grouped = { APPLICATION: [], FILE: [], LIBRARY: [], CAPABILITY: [], ALGORITHM: [] };
    rawNodes.forEach(node => {
      const type = node.node_type || 'LIBRARY';
      if (grouped[type]) {
        grouped[type].push(node);
      } else {
        grouped.LIBRARY.push(node);
      }
    });
    return grouped;
  }, [rawNodes]);

  // Filtered nodes for the list / search
  const filteredNodes = useMemo(() => {
    return rawNodes.filter((n) => {
      const matchesType = selectedType === 'ALL' || n.node_type === selectedType;
      const matchesSearch = !searchQuery || 
        n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.details && n.details.toLowerCase().includes(searchQuery.toLowerCase())) ||
        n.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [rawNodes, selectedType, searchQuery]);

  const getNodeColor = (type, isVuln) => {
    if (isVuln && type === 'ALGORITHM') return '#EF4444';
    switch (type) {
      case 'APPLICATION': return '#38BDF8';
      case 'FILE': return '#818CF8';
      case 'LIBRARY': return '#A855F7';
      case 'CAPABILITY': return '#F59E0B';
      case 'ALGORITHM': return '#10B981';
      default: return '#64748B';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto command-grid">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              MULTI-TIER CALL GRAPH
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              AST CALL TRACE VERIFIED
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Network className="w-6 h-6 text-cyan-400" />
            <span>Dependency Intelligence & Call Graph</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Interactive end-to-end cryptographic dependency trace: <span className="text-cyan-300 font-mono">App &rarr; File &rarr; Package &rarr; Capability &rarr; Algorithm &rarr; Quantum Risk</span>
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('GRAPH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'GRAPH'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-cyan-glow'
                : 'bg-[#0D1730] text-slate-400 border border-[#1E2D4A] hover:text-white'
            }`}
          >
            Visual Graph
          </button>
          <button
            onClick={() => setViewMode('LIST')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
              viewMode === 'LIST'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-cyan-glow'
                : 'bg-[#0D1730] text-slate-400 border border-[#1E2D4A] hover:text-white'
            }`}
          >
            Node Matrix
          </button>
        </div>
      </div>

      {/* Top KPI Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="command-card p-4">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Total Graph Nodes</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{rawNodes.length}</div>
          <div className="text-[10px] font-mono text-cyan-400 mt-0.5">{rawEdges.length} Active Edges</div>
        </div>

        <div className="command-card p-4">
          <div className="text-[10px] font-mono text-cyan-400 uppercase">Direct Dependencies</div>
          <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">{depGraph?.direct_dependencies_count || 0}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">Explicitly Declared</div>
        </div>

        <div className="command-card p-4">
          <div className="text-[10px] font-mono text-indigo-400 uppercase">Transitive Calls</div>
          <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">{depGraph?.transitive_dependencies_count || 0}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">Deep Execution Trace</div>
        </div>

        <div className="command-card p-4 border-rose-500/30">
          <div className="text-[10px] font-mono text-rose-400 uppercase">Vulnerable Packages</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{depGraph?.vulnerable_packages_count || 0}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5">Require PQC Lib Bump</div>
        </div>
      </div>

      {/* Main Interactive Visual Graph View */}
      {viewMode === 'GRAPH' ? (
        <div className="space-y-6">
          
          {/* Visual 5-Tier Canvas Deck */}
          <div className="command-card p-6 overflow-x-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#1E2D4A] min-w-[900px]">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>INTERACTIVE CALL TRACE (CLICK ANY NODE TO INSPECT UPSTREAM & DOWNSTREAM IMPACT)</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Selected: <strong className="text-white">{activeNode ? activeNode.label : 'None'}</strong>
              </div>
            </div>

            {/* 5 Column Flow Columns */}
            <div className="grid grid-cols-5 gap-4 min-w-[900px]">
              {Object.entries(tiers).map(([tierKey, tierMeta]) => {
                const TierIcon = tierMeta.icon;
                const tierNodes = nodesByTier[tierKey] || [];

                return (
                  <div key={tierKey} className="space-y-3">
                    {/* Tier Column Header */}
                    <div className="p-2 rounded-lg bg-[#050A14] border border-[#1E2D4A] flex items-center justify-between">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <TierIcon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: tierMeta.color }} />
                        <span className="text-[10px] font-mono font-bold text-slate-300 truncate">{tierMeta.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 ml-1">({tierNodes.length})</span>
                    </div>

                    {/* Nodes in this Tier */}
                    <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
                      {tierNodes.length === 0 ? (
                        <div className="p-3 text-center text-[10px] font-mono text-slate-400 border border-dashed border-[#1E2D4A] rounded-lg">
                          No {tierKey.toLowerCase()} nodes
                        </div>
                      ) : (
                        tierNodes.map((node) => {
                          const isSelected = activeNode?.id === node.id;
                          const isConnected = connectedContext.connectedNodeIds.has(node.id);
                          const isHovered = hoveredNodeId === node.id;

                          return (
                            <div
                              key={node.id}
                              onClick={() => setSelectedNodeId(node.id)}
                              onMouseEnter={() => setHoveredNodeId(node.id)}
                              onMouseLeave={() => setHoveredNodeId(null)}
                              className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer font-mono text-xs ${
                                isSelected
                                  ? 'bg-[#0D1730] border-cyan-400 ring-2 ring-cyan-400/30 shadow-cyan-glow'
                                  : isConnected
                                  ? 'bg-[#080E1E] border-cyan-500/50 text-white'
                                  : 'bg-[#050A14]/80 border-[#1E2D4A] text-slate-300 hover:border-slate-500 hover:bg-[#080E1E]'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <span className="font-bold text-white text-[11px] truncate" title={node.label}>
                                  {node.label}
                                </span>
                                {node.quantum_vulnerable ? (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex-shrink-0">
                                    Shor
                                  </span>
                                ) : (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex-shrink-0">
                                    Safe
                                  </span>
                                )}
                              </div>

                              <p className="text-[10px] text-slate-400 truncate" title={node.details}>
                                {node.details}
                              </p>

                              {isConnected && !isSelected && (
                                <div className="mt-1.5 flex items-center gap-1 text-[9px] text-cyan-400 font-sans">
                                  <ArrowRight className="w-2.5 h-2.5" />
                                  <span>In Call Chain</span>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Node Intelligence & Impact Propagation Panel */}
          {activeNode && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Left 2 Cols: Detailed Node Info */}
              <div className="md:col-span-2 command-card p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1E2D4A]">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block">Node Intelligence Inspector</span>
                    <h3 className="text-lg font-bold text-white font-mono mt-0.5">{activeNode.label}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    activeNode.quantum_vulnerable ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {activeNode.node_type} &bull; {activeNode.quantum_vulnerable ? 'SHOR VULNERABLE' : 'QUANTUM RESISTANT'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A]">
                    <span className="text-[10px] text-slate-400 block mb-1">AST CONTEXT & DETAILS</span>
                    <p className="text-slate-200 text-[11px] leading-relaxed break-words">{activeNode.details}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A]">
                    <span className="text-[10px] text-slate-400 block mb-1">DEPENDENCY DEPTH</span>
                    <div className="text-lg font-bold text-white">Level {activeNode.depth || 1}</div>
                    <span className="text-[10px] text-slate-400">Hierarchy distance from entrypoint</span>
                  </div>
                </div>

                {/* Connected Relationships */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-300 font-semibold">Active Call Connections ({connectedContext.upstreamEdges.length + connectedContext.downstreamEdges.length})</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                    {connectedContext.upstreamEdges.map((e, idx) => (
                      <div key={idx} className="p-2 rounded bg-[#050A14] border border-[#1E2D4A] flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">&larr; Inbound</span>
                        <span className="text-cyan-300 font-bold truncate max-w-[120px]">{e.source}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#0D1730] text-slate-400">{e.relationship}</span>
                      </div>
                    ))}
                    {connectedContext.downstreamEdges.map((e, idx) => (
                      <div key={idx} className="p-2 rounded bg-[#050A14] border border-[#1E2D4A] flex items-center justify-between text-[11px] font-mono">
                        <span className="text-cyan-400">Outbound &rarr;</span>
                        <span className="text-white font-bold truncate max-w-[120px]">{e.target}</span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#0D1730] text-slate-400">{e.relationship}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right 1 Col: Impact Propagation Rationale */}
              <div className="command-card p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Impact Propagation</h4>
                </div>

                {activeNode.quantum_vulnerable ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                      <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-400">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Shor Vulnerability Leakage</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                        Any vulnerability in this primitive cascades upstream to all referencing modules. Upgrading this single target directly eliminates quantum risk across <strong>{connectedContext.upstreamEdges.length || 1}</strong> callers.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-xs font-mono space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase">Recommended PQC Remediation</div>
                      <div className="text-emerald-400 font-bold">NIST FIPS 203 / 204 Hybrid Bindings</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    <div className="font-bold mb-1">Quantum Resilient Primitive</div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      This dependency utilizes symmetric encryption (AES-256) or SHA-384+ hashing, maintaining high security margin against Grover quantum attacks.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      ) : (
        /* Matrix / Table List View */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl command-card">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
              {['ALL', 'APPLICATION', 'FILE', 'LIBRARY', 'CAPABILITY', 'ALGORITHM'].map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    selectedType === t
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-[#0D1730]'
                  }`}
                >
                  {t} ({t === 'ALL' ? rawNodes.length : rawNodes.filter(n => n.node_type === t).length})
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => { setSelectedNodeId(node.id); setViewMode('GRAPH'); }}
                className="p-4 rounded-xl command-card hover:border-cyan-500/50 cursor-pointer transition flex items-center justify-between gap-4 font-mono text-xs"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: `${getNodeColor(node.node_type, node.quantum_vulnerable)}20`, color: getNodeColor(node.node_type, node.quantum_vulnerable) }}>
                      {node.node_type}
                    </span>
                    <span className="text-white font-bold truncate">{node.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{node.details}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[9px] px-2 py-0.5 rounded border ${
                    node.quantum_vulnerable ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {node.quantum_vulnerable ? 'SHOR' : 'SAFE'}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
