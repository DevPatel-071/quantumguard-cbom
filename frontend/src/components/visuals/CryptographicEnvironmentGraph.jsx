import React, { useState, useRef, useMemo } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  ShieldAlert, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Filter, 
  Search, 
  Info, 
  ChevronRight, 
  ExternalLink,
  Sparkles,
  Zap,
  Activity,
  Maximize2
} from 'lucide-react';

export default function CryptographicEnvironmentGraph({ cbomReport, onSelectAsset, onNavigate }) {
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedRiskFilter, setSelectedRiskFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'PQC'
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedImpactIds, setHighlightedImpactIds] = useState(new Set());
  const svgRef = useRef(null);

  if (!cbomReport || !cbomReport.assets) {
    return null;
  }

  const assets = cbomReport.assets || [];
  const s = cbomReport.scan_summary || {};
  const appName = cbomReport.metadata?.application || "Core Banking Switch";

  // Build dynamic topology graph from real CBOM assets
  const graphData = useMemo(() => {
    const nodes = [];
    const edges = [];

    // Root QUANTECT Hub Node
    nodes.push({
      id: 'quantect-hub',
      label: 'QUANTECT SURVEILLANCE',
      type: 'HUB',
      category: 'HUB',
      color: '#00F0FF',
      x: 500,
      y: 40,
      sublabel: 'Active Governance Root'
    });

    // Top Layer: Applications & Services
    const appNodes = [
      { id: 'app-main', label: appName.toUpperCase(), type: 'APPLICATION', color: '#818CF8', x: 260, y: 130, sublabel: 'Enterprise Core Target' },
      { id: 'app-api', label: 'PAYMENT SWITCH & API GATEWAY', type: 'SERVICE', color: '#38BDF8', x: 500, y: 130, sublabel: 'TLS 1.3 / REST Endpoints' },
      { id: 'app-vault', label: 'KEY VAULT & SECRETS STORE', type: 'DATABASE', color: '#C084FC', x: 740, y: 130, sublabel: 'PKI Root & HSM' }
    ];

    appNodes.forEach(an => {
      nodes.push(an);
      edges.push({ from: 'quantect-hub', to: an.id, color: an.color, animated: true });
    });

    // Intermediate Layer: Crypto Capabilities / Libraries
    const libraries = Array.from(new Set(assets.map(a => a.library || 'Native Cryptography')));
    const libraryPositions = [
      { x: 180, y: 240 },
      { x: 380, y: 240 },
      { x: 620, y: 240 },
      { x: 820, y: 240 }
    ];

    libraries.slice(0, 4).forEach((lib, idx) => {
      const libId = `lib-${idx}`;
      const pos = libraryPositions[idx] || { x: 200 + idx * 180, y: 240 };
      const libAssets = assets.filter(a => (a.library || 'Native Cryptography') === lib);

      nodes.push({
        id: libId,
        label: lib.toUpperCase(),
        type: 'LIBRARY',
        color: '#6366F1',
        x: pos.x,
        y: pos.y,
        sublabel: `${libAssets.length} Discovered Routines`,
        assetCount: libAssets.length
      });

      // Connect App to Library
      const parentAppId = idx < 2 ? 'app-main' : idx === 2 ? 'app-api' : 'app-vault';
      edges.push({ from: parentAppId, to: libId, color: '#6366F1' });

      // Leaf Layer: Distinct Cryptographic Algorithms
      const uniqueAlgos = Array.from(new Set(libAssets.map(a => a.algorithm)));
      uniqueAlgos.slice(0, 3).forEach((algo, aIdx) => {
        const matchingAsset = libAssets.find(a => a.algorithm === algo);
        const algoId = `algo-${idx}-${aIdx}`;
        const algoX = pos.x + (aIdx - 1) * 65;
        const algoY = 360 + (aIdx % 2) * 40;

        const isShor = matchingAsset?.quantum_vulnerability === 'CRITICAL' || matchingAsset?.quantum_vulnerability === 'HIGH';
        const isPQC = matchingAsset?.quantum_vulnerability === 'QUANTUM_RESISTANT' || algo.includes('ML-');

        let nodeColor = '#F59E0B'; // Medium
        if (isShor) nodeColor = '#EF4444'; // Critical Red
        else if (isPQC) nodeColor = '#10B981'; // Green

        nodes.push({
          id: algoId,
          label: algo,
          type: 'ALGORITHM',
          color: nodeColor,
          x: algoX,
          y: algoY,
          sublabel: matchingAsset?.usage || 'Cryptographic Primitive',
          riskScore: matchingAsset?.risk_score || 75,
          vulnerability: matchingAsset?.quantum_vulnerability || 'HIGH',
          assetId: matchingAsset?.asset_id,
          rawAsset: matchingAsset,
          targetPqc: matchingAsset?.recommended_pqc || 'ML-KEM-768'
        });

        edges.push({
          from: libId,
          to: algoId,
          color: nodeColor,
          alert: isShor
        });
      });
    });

    // Convergence Layer: Quantum Risk Engine
    const riskEngineId = 'risk-engine-core';
    nodes.push({
      id: riskEngineId,
      label: 'QUANTUM RISK ENGINE',
      type: 'ENGINE',
      color: s.critical_risk_count > 0 ? '#EF4444' : '#F59E0B',
      x: 500,
      y: 490,
      sublabel: `Avg Risk: ${s.average_risk_score || 78}/100`
    });

    // Connect leaf algorithms to Risk Engine
    nodes.filter(n => n.type === 'ALGORITHM').forEach(an => {
      edges.push({
        from: an.id,
        to: riskEngineId,
        color: an.color,
        dashed: true
      });
    });

    // Bottom Action Layers: FMEA & Recommendations
    nodes.push({
      id: 'fmea-action-node',
      label: 'FMEA FAILURE RISK',
      type: 'ACTION',
      color: '#F97316',
      x: 320,
      y: 590,
      sublabel: `Max RPN: ${cbomReport.fmea_summary?.max_rpn || 392}`
    });

    nodes.push({
      id: 'pqc-action-node',
      label: 'NIST PQC ROADMAP',
      type: 'ACTION',
      color: '#10B981',
      x: 680,
      y: 590,
      sublabel: 'FIPS 203/204 Transitions'
    });

    edges.push({ from: riskEngineId, to: 'fmea-action-node', color: '#F97316' });
    edges.push({ from: riskEngineId, to: 'pqc-action-node', color: '#10B981' });

    return { nodes, edges };
  }, [assets, appName, s, cbomReport]);

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.max(0.7, Math.min(1.6, prev + delta)));
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);

    // Compute impact propagation: find all upstream/downstream connected node IDs
    const impacted = new Set([node.id]);
    graphData.edges.forEach(e => {
      if (e.from === node.id) impacted.add(e.to);
      if (e.to === node.id) impacted.add(e.from);
    });
    setHighlightedImpactIds(impacted);
  };

  const filteredNodes = graphData.nodes.filter(n => {
    if (selectedRiskFilter === 'CRITICAL') {
      return n.color === '#EF4444' || n.type === 'HUB' || n.type === 'ENGINE';
    }
    if (selectedRiskFilter === 'HIGH') {
      return n.color === '#F97316' || n.color === '#EF4444' || n.type === 'HUB';
    }
    if (selectedRiskFilter === 'PQC') {
      return n.color === '#10B981' || n.type === 'HUB';
    }
    if (searchTerm) {
      return n.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
             (n.sublabel && n.sublabel.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return true;
  });

  return (
    <div className="p-6 rounded-2xl command-card border-cyan-500/30 space-y-5 relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Title, Search, and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A] z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/80 border border-cyan-700/60 px-2 py-0.5 rounded">
              SIGNATURE NETWORK TOPOLOGY
            </span>
            <span className="text-[10px] font-mono text-purple-400 border border-purple-800/40 bg-purple-950/50 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE CRYPTOGRAPHIC ENVIRONMENT
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-cyan-400" />
            <span>Cryptographic Environment</span>
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Visual map of cryptographic assets, dependency hierarchies, algorithm exposure, and impact propagation.
          </p>
        </div>

        {/* Controls: Search, Risk Filters, Zoom */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white text-[11px] focus:border-cyan-400 focus:outline-none w-36 sm:w-44"
            />
          </div>

          {/* Risk Filters */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#050A14] border border-[#1E2D4A]">
            {['ALL', 'CRITICAL', 'HIGH', 'PQC'].map((flt) => (
              <button
                key={flt}
                onClick={() => setSelectedRiskFilter(flt)}
                className={`px-2.5 py-1 rounded-md text-[10px] transition font-bold ${
                  selectedRiskFilter === flt
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {flt === 'ALL' ? 'ALL' : flt === 'CRITICAL' ? '🔴 CRIT' : flt === 'HIGH' ? '🟠 HIGH' : '🟢 PQC'}
              </button>
            ))}
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#050A14] border border-[#1E2D4A]">
            <button
              onClick={() => handleZoom(-0.15)}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] px-1 text-slate-300">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => handleZoom(0.15)}
              className="p-1 rounded text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[520px] bg-[#040814] rounded-2xl border border-[#1E2D4A] overflow-hidden flex items-center justify-center shadow-inner">
        <svg
          ref={svgRef}
          viewBox="0 0 1000 680"
          className="w-full h-full transition-transform duration-200 cursor-grab active:cursor-grabbing"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            <filter id="envGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Edges */}
          {graphData.edges.map((edge, idx) => {
            const fromNode = graphData.nodes.find(n => n.id === edge.from);
            const toNode = graphData.nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const isImpacted = highlightedImpactIds.has(fromNode.id) && highlightedImpactIds.has(toNode.id);

            return (
              <line
                key={`edge-${idx}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke={isImpacted ? '#00F0FF' : (edge.color || '#1E2D4A')}
                strokeWidth={isImpacted ? 3 : edge.alert ? 2 : 1.5}
                strokeDasharray={edge.dashed ? "4 4" : "none"}
                strokeOpacity={isImpacted ? 1.0 : 0.55}
                className={edge.animated || isImpacted ? "animate-pulse" : ""}
              />
            );
          })}

          {/* Render Nodes */}
          {filteredNodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isImpacted = highlightedImpactIds.has(node.id);
            const isHub = node.type === 'HUB';
            const isEngine = node.type === 'ENGINE';
            const isCritical = node.color === '#EF4444';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => handleNodeClick(node)}
                className="cursor-pointer group"
              >
                {/* Warning Pulse for Critical Nodes */}
                {isCritical && (
                  <circle r={isHub ? 32 : 24} fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
                )}

                {/* Outer Node Halo */}
                <circle
                  r={isHub ? 26 : isEngine ? 22 : 18}
                  fill="#070D1E"
                  stroke={isSelected || isImpacted ? '#00F0FF' : node.color}
                  strokeWidth={isSelected || isImpacted ? 3 : 2}
                  filter={isSelected || isImpacted ? "url(#envGlow)" : "none"}
                  className="transition-all duration-300 group-hover:fill-[#0D1832]"
                />

                {/* Inner Core Dot */}
                <circle
                  r={isHub ? 9 : 6}
                  fill={node.color}
                />

                {/* Node Label Text */}
                <text
                  y={isHub ? 40 : 32}
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize={isHub ? "11px" : "9px"}
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="select-none pointer-events-none drop-shadow"
                >
                  {node.label}
                </text>
                <text
                  y={isHub ? 52 : 43}
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

      {/* Interactive Node Detail Inspector Banner */}
      {selectedNode ? (
        <div className="p-4 rounded-xl bg-[#070D1E] border border-cyan-500/40 text-xs font-mono grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-2 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedNode.color }} />
              <strong className="text-white text-sm">{selectedNode.label}</strong>
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded uppercase">
                {selectedNode.type}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans">
              {selectedNode.sublabel} {selectedNode.riskScore ? `&bull; Quantum Risk Score: ${selectedNode.riskScore}/100` : ''}
            </p>
            {highlightedImpactIds.size > 1 && (
              <div className="text-[10px] text-cyan-300 font-bold">
                ⚡ Impact Propagation: {highlightedImpactIds.size} connected nodes highlighted
              </div>
            )}
          </div>

          <div className="space-y-1 text-slate-300 border-l border-[#1E2D4A] pl-3">
            <span className="text-[10px] text-slate-400 uppercase">Remediation Target</span>
            <div className="text-xs font-bold text-emerald-400">
              {selectedNode.targetPqc || 'NIST FIPS 203 (ML-KEM)'}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            {selectedNode.rawAsset && onSelectAsset && (
              <button
                onClick={() => onSelectAsset(selectedNode.rawAsset)}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 flex items-center gap-1.5 transition font-bold"
              >
                <span>Inspect Asset</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => {
                setSelectedNode(null);
                setHighlightedImpactIds(new Set());
              }}
              className="px-3 py-1.5 rounded-lg bg-[#050A14] hover:bg-[#1E2D4A] text-slate-400 hover:text-white border border-[#1E2D4A] transition"
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        /* Default Guidance Footer */
        <div className="p-3 rounded-xl bg-[#070D1E] border border-[#1E2D4A] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>Click any node (e.g. RSA-2048, OpenSSL) to trigger downstream impact propagation and inspect affected assets.</span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('dependencies')}
              className="text-cyan-400 hover:underline font-bold flex items-center gap-1 self-start sm:self-auto flex-shrink-0"
            >
              <span>Dependency Intelligence</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
