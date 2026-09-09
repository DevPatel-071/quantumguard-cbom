import React, { useState, useRef } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Radio, 
  Layers, 
  Bell, 
  Cpu, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Zap, 
  TrendingUp, 
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';

export default function LiveCryptographicEcosystem({ visualData, onSelectAssetId, onRefresh }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'VULNERABLE' | 'PQC'
  const svgRef = useRef(null);

  if (!visualData || !visualData.ecosystemData) {
    return (
      <div className="p-8 text-center text-slate-400 command-card">
        <Activity className="w-10 h-10 text-cyan-500/50 mx-auto mb-3 animate-pulse" />
        <h4 className="text-base font-bold text-white mb-1">No Monitoring Telemetry Available</h4>
        <p className="text-xs text-slate-400">Perform a cryptographic scan to activate live continuous monitoring surveillance.</p>
      </div>
    );
  }

  const { ecosystemData } = visualData;
  const { nodes, edges, activityStream, activeSources, totalMonitoredAssets, analytics } = ecosystemData;

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.max(0.7, Math.min(1.5, prev + delta)));
  };

  const filteredNodes = nodes.filter(node => {
    if (filterType === 'VULNERABLE') return node.color === '#EF4444' || node.type === 'CORE' || node.type === 'APPLICATION' || node.type === 'ENGINE';
    if (filterType === 'PQC') return node.color === '#10B981' || node.type === 'CORE' || node.type === 'APPLICATION' || node.type === 'ENGINE';
    return true;
  });

  const getSeverityStyle = (sev) => {
    switch (sev) {
      case 'CRITICAL': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH': return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MEDIUM': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Visual Header & Real-Time Status Bar */}
      <div className="command-card p-6 border-cyan-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-950/20 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/80 border border-cyan-700/60 px-2 py-0.5 rounded">
                SIGNATURE VISUALIZATION 4
              </span>
              <span className="text-[10px] font-mono text-emerald-400 border border-emerald-800/40 bg-emerald-950/50 px-2 py-0.5 rounded flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                LIVE TOPOLOGY SURVEILLANCE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Activity className="w-6 h-6 text-cyan-400" />
              <span>Live Cryptographic Ecosystem</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              Interactive topological visualization of live enterprise cryptographic nodes, dependency graphs, and real-time threat dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-lg bg-[#070D1E] border border-emerald-500/40 text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Monitored Assets</div>
              <div className="text-lg font-bold font-mono text-cyan-400">
                {totalMonitoredAssets} Nodes
              </div>
            </div>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2.5 rounded-lg bg-[#070D1E] hover:bg-[#1E2D4A] border border-[#1E2D4A] text-slate-300 hover:text-cyan-400 transition"
                title="Resynchronize Telemetry Stream"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Telemetry Stats */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#1E2D4A]/60 font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A]">
            <span className="text-[10px] text-slate-400 uppercase">Average Quantum Risk</span>
            <div className="text-sm font-bold text-amber-400 mt-0.5">{analytics.riskScore} / 100</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-rose-500/30">
            <span className="text-[10px] text-rose-400 uppercase">Critical Threat Nodes</span>
            <div className="text-sm font-bold text-rose-400 mt-0.5">{analytics.criticalCount} Nodes</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-emerald-500/30">
            <span className="text-[10px] text-emerald-400 uppercase">PQC Resilient Nodes</span>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">{analytics.pqcReadyCount} Nodes</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A]">
            <span className="text-[10px] text-slate-400 uppercase">Surveillance Interval</span>
            <div className="text-sm font-bold text-white mt-0.5">5m Automated Poll</div>
          </div>
        </div>
      </div>

      {/* Main Interactive SVG Network Topology Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SVG Network Graph Canvas (2 Columns) */}
        <div className="lg:col-span-2 command-card p-5 space-y-3 relative flex flex-col justify-between min-h-[560px]">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <Radio className="w-4 h-4 text-cyan-400" />
              <span>CRYPTOGRAPHIC TOPOLOGY MAP</span>
            </div>

            {/* Controls Bar: Zoom & Filters */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#050A14] border border-[#1E2D4A] text-xs font-mono">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-2 py-1 rounded text-[10px] transition ${filterType === 'ALL' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setFilterType('VULNERABLE')}
                  className={`px-2 py-1 rounded text-[10px] transition ${filterType === 'VULNERABLE' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400'}`}
                >
                  🔴 VULN
                </button>
                <button
                  onClick={() => setFilterType('PQC')}
                  className={`px-2 py-1 rounded text-[10px] transition ${filterType === 'PQC' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}
                >
                  🟢 PQC
                </button>
              </div>

              <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#050A14] border border-[#1E2D4A] text-xs">
                <button
                  onClick={() => handleZoom(-0.1)}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-slate-400 px-1">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => handleZoom(0.1)}
                  className="p-1 rounded text-slate-400 hover:text-white transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive SVG Diagram */}
          <div className="relative w-full h-[460px] overflow-hidden rounded-xl bg-[#040814] border border-[#1E2D4A] flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 800 700"
              className="w-full h-full transition-transform duration-200 cursor-grab active:cursor-grabbing"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                {/* Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
                {/* Arrowhead markers */}
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#00F0FF" />
                </marker>
              </defs>

              {/* Render Edges */}
              {edges.map((edge, idx) => {
                const fromNode = nodes.find(n => n.id === edge.from);
                const toNode = nodes.find(n => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                const isEdgeAlert = edge.alert;

                return (
                  <line
                    key={`edge-${idx}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={edge.color || '#1E2D4A'}
                    strokeWidth={isEdgeAlert ? 2 : 1.5}
                    strokeDasharray={edge.dashed ? "4 4" : "none"}
                    strokeOpacity={0.6}
                    className={edge.animated ? "animate-pulse" : ""}
                  />
                );
              })}

              {/* Render Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isCore = node.type === 'CORE';
                const isEngine = node.type === 'ENGINE';
                const isAlert = node.type === 'ALERT';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer transition-all duration-300 group"
                  >
                    {/* Pulsing ring for alerts / focal nodes */}
                    {(node.color === '#EF4444' || isAlert) && (
                      <circle
                        r={isCore ? 28 : 22}
                        fill="none"
                        stroke={node.color}
                        strokeWidth="1.5"
                        opacity="0.4"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer node circle */}
                    <circle
                      r={isCore ? 24 : isEngine ? 20 : 16}
                      fill="#070D1E"
                      stroke={node.color}
                      strokeWidth={isSelected ? 3 : 2}
                      filter={isSelected ? "url(#glow)" : "none"}
                    />

                    {/* Inner color dot */}
                    <circle
                      r={isCore ? 8 : 5}
                      fill={node.color}
                    />

                    {/* Node Text Labels */}
                    <text
                      y={isCore ? 38 : 30}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={isCore ? "11px" : "9px"}
                      fontWeight="bold"
                      fontFamily="monospace"
                      className="select-none pointer-events-none drop-shadow"
                    >
                      {node.label}
                    </text>
                    <text
                      y={isCore ? 50 : 41}
                      textAnchor="middle"
                      fill="#94A3B8"
                      fontSize="8px"
                      fontFamily="monospace"
                      className="select-none pointer-events-none"
                    >
                      {node.sublabel}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Node Inspector Callout */}
          {selectedNode && (
            <div className="p-3.5 rounded-xl bg-[#070D1E] border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedNode.color }} />
                  <strong className="text-white">{selectedNode.label}</strong>
                  <span className="text-slate-400">&bull; {selectedNode.type}</span>
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  {selectedNode.sublabel} {selectedNode.riskScore && `| Risk: ${selectedNode.riskScore}/100`}
                </div>
              </div>

              {selectedNode.assetId && onSelectAssetId && (
                <button
                  onClick={() => onSelectAssetId(selectedNode.assetId)}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 flex items-center gap-1.5 transition self-start sm:self-auto"
                >
                  <span>Inspect CBOM Asset</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Live Monitoring Activity Stream Timeline (1 Column) */}
        <div className="command-card p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E2D4A]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>MONITORING ACTIVITY TIMELINE</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {activityStream.length} Events
              </span>
            </div>

            <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {activityStream.map((evt, idx) => {
                const sevStyle = getSeverityStyle(evt.severity);

                return (
                  <div
                    key={evt.id || idx}
                    className="p-3 rounded-xl bg-[#070D1E] border border-[#1E2D4A] hover:border-cyan-500/40 transition text-xs font-mono space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase ${sevStyle}`}>
                        {evt.severity}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString() : 'Just now'}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-white leading-tight">
                      {evt.title}
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      {evt.message}
                    </p>

                    <div className="text-[10px] text-slate-400 pt-1 border-t border-white/5 flex items-center justify-between">
                      <span>Target: <strong className="text-cyan-300 font-mono">{evt.affectedAsset}</strong></span>
                      <span className="text-slate-500">{evt.alertType}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-center text-[10px] font-mono text-emerald-400">
            ✓ Continuous Surveillance Daemon Active &amp; Polling
          </div>
        </div>

      </div>

    </div>
  );
}
