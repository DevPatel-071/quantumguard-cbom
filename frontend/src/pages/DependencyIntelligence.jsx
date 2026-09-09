import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  ChevronRight,
  ShieldAlert,
  Layers,
  FileCode,
  Package
} from 'lucide-react';

export default function DependencyIntelligence({ cbomReport, onSelectAsset }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedNode, setSelectedNode] = useState(null);

  if (!cbomReport) {
    return (
      <div className="p-8 text-center text-slate-500">
        No active inventory available. Please execute a cryptographic discovery scan.
      </div>
    );
  }

  const depGraph = cbomReport.dependency_graph;
  const nodes = depGraph?.nodes || [];
  const edges = depGraph?.edges || [];

  // Filter nodes
  const filteredNodes = nodes.filter((n) => {
    const matchesType = selectedType === 'ALL' || n.node_type === selectedType;
    const matchesSearch = 
      n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.details && n.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getNodeBadge = (type) => {
    switch (type) {
      case 'APPLICATION': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'FILE': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'LIBRARY': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'CAPABILITY': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'ALGORITHM': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Network className="w-6 h-6 text-blue-600" />
            <span>Dependency Intelligence & Call Graph</span>
          </h1>
          <p className="text-xs text-slate-500">
            Multi-tier cryptographic dependency mapping: <span className="font-semibold text-blue-700">Application &rarr; File &rarr; Library &rarr; Capability &rarr; Algorithm &rarr; Quantum Risk</span>.
          </p>
        </div>

        {depGraph && (
          <div className="flex items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
              Direct: <strong className="text-blue-700 font-mono">{depGraph.direct_dependencies_count}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
              Vulnerable Pkgs: <strong className="text-rose-600 font-mono">{depGraph.vulnerable_packages_count}</strong>
            </div>
          </div>
        )}
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Packages & Libraries</span>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {depGraph?.total_packages || 0}
          </div>
          <span className="text-[11px] text-slate-500">Manifest & imported modules</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Direct Dependencies</span>
          <div className="text-2xl font-bold text-blue-700 font-mono">
            {depGraph?.direct_dependencies_count || 0}
          </div>
          <span className="text-[11px] text-slate-500">Explicitly declared packages</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Transitive Invocations</span>
          <div className="text-2xl font-bold text-indigo-700 font-mono">
            {depGraph?.transitive_dependencies_count || 0}
          </div>
          <span className="text-[11px] text-slate-500">Deep runtime call trace</span>
        </div>

        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Quantum Vulnerable Packages</span>
          <div className="text-2xl font-bold text-rose-600 font-mono">
            {depGraph?.vulnerable_packages_count || 0}
          </div>
          <span className="text-[11px] text-slate-500">Require PQC library bump</span>
        </div>
      </div>

      {/* Hierarchy Flow Visual Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-slate-700">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">1. Application</span>
          <span>&rarr;</span>
          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">2. Source File</span>
          <span>&rarr;</span>
          <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">3. Library Package</span>
          <span>&rarr;</span>
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-bold">4. Capability</span>
          <span>&rarr;</span>
          <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">5. Algorithm / Key</span>
        </div>
        <div className="text-slate-500 text-[11px]">
          Total Graph Nodes: <strong>{nodes.length}</strong> &bull; Edges: <strong>{edges.length}</strong>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {['ALL', 'APPLICATION', 'FILE', 'LIBRARY', 'CAPABILITY', 'ALGORITHM'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedType === t
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t} ({t === 'ALL' ? nodes.length : nodes.filter(n => n.node_type === t).length})
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search dependencies & nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Content Layout: Nodes Grid + Node Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Nodes List (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          {filteredNodes.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No dependency nodes match the filter or search query.
            </div>
          ) : (
            filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 bg-white ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  } flex items-center justify-between gap-4`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getNodeBadge(node.node_type)}`}>
                        {node.node_type}
                      </span>
                      <span className="font-bold text-sm text-slate-900 truncate">
                        {node.label}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-mono truncate">
                      {node.details}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 font-mono text-xs">
                    {node.quantum_vulnerable ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        VULNERABLE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        SAFE
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Node Detail Inspector (1 col) */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5 h-fit sticky top-20">
          <div className="space-y-1 pb-3 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Node Intelligence Inspector
            </span>
            <h3 className="font-bold text-base text-slate-900">
              {selectedNode ? selectedNode.label : 'Select a Dependency Node'}
            </h3>
            {selectedNode && (
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${getNodeBadge(selectedNode.node_type)}`}>
                {selectedNode.node_type} &bull; Depth {selectedNode.depth}
              </span>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[11px] text-slate-600 font-semibold">Context & Trace:</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {selectedNode.details}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] text-slate-600 font-semibold">Connected Relationships:</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {edges
                    .filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((e, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500 font-sans">{e.source === selectedNode.id ? 'Target &rarr;' : '&larr; Source'}</span>
                        <span className="text-blue-700 font-bold truncate ml-2">
                          {e.source === selectedNode.id ? e.target : e.source}
                        </span>
                        <span className="text-slate-600 uppercase text-[9px] px-1.5 py-0.5 rounded bg-white border border-slate-200 ml-2">
                          {e.relationship}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {selectedNode.quantum_vulnerable && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-rose-700">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Quantum Risk Propagation</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    This component introduces Shor-vulnerable asymmetric dependencies downstream. Upgrade to NIST FIPS 203/204 or hybrid bindings.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs">
              Click any application, file, library, capability, or algorithm node to view relationship traces.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
