import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Cpu, 
  Layers, 
  ArrowRight, 
  Info, 
  Sparkles, 
  X,
  ExternalLink,
  Radio
} from 'lucide-react';

export default function QuantumThreatMap({ cbomReport, onSelectAsset, onNavigate }) {
  const [selectedThreatNode, setSelectedThreatNode] = useState(null);

  if (!cbomReport || !cbomReport.assets) {
    return null;
  }

  const assets = cbomReport.assets || [];
  const s = cbomReport.scan_summary || {};
  const appName = cbomReport.metadata?.application || "Core Banking Switch";

  // Real algorithm groupings
  const shorAssets = assets.filter(a => 
    a.quantum_vulnerability === 'CRITICAL' || 
    a.quantum_vulnerability === 'HIGH' ||
    a.quantum_vulnerability === 'SHOR_BROKEN' ||
    (a.algorithm && (a.algorithm.includes('RSA') || a.algorithm.includes('ECDSA') || a.algorithm.includes('ECDH') || a.algorithm.includes('DH') || a.algorithm.includes('DSA')))
  );

  const pqcAssets = assets.filter(a => 
    a.quantum_vulnerability === 'QUANTUM_RESISTANT' ||
    (a.algorithm && (a.algorithm.includes('ML-') || a.algorithm.includes('SLH-') || a.algorithm.includes('FALCON') || a.algorithm.includes('AES-256')))
  );

  const otherCryptoAssets = assets.filter(a => !shorAssets.includes(a) && !pqcAssets.includes(a));

  const rsaAssets = assets.filter(a => a.algorithm && a.algorithm.includes('RSA'));
  const eccAssets = assets.filter(a => a.algorithm && (a.algorithm.includes('ECDSA') || a.algorithm.includes('ECDH') || a.algorithm.includes('ECC') || a.algorithm.includes('SECP')));
  const symAssets = assets.filter(a => a.algorithm && a.algorithm.includes('AES'));

  const criticalCount = s.critical_risk_count || shorAssets.length;
  const avgRisk = s.average_risk_score || 78.0;

  const threatNodes = [
    {
      id: 'node-threat-crqc',
      label: 'QUANTUM THREAT',
      sublabel: 'Cryptanalytically Relevant Quantum Computer (CRQC)',
      category: 'THREAT_SOURCE',
      color: '#A855F7',
      x: 350,
      y: 40,
      icon: 'quantum',
      details: "Shor's algorithm solves discrete logarithms and integer factorizations in polynomial time O((log N)^3), breaking classical public-key cryptography."
    },
    {
      id: 'node-rsa-ecc',
      label: `RSA / ECC PRIMITIVES (${shorAssets.length})`,
      sublabel: `${rsaAssets.length} RSA &bull; ${eccAssets.length} ECC Instances`,
      category: 'VULNERABLE_PRIMITIVES',
      color: '#EF4444',
      x: 180,
      y: 130,
      count: shorAssets.length,
      assets: shorAssets,
      details: 'Public-key authentication, key exchange, and X.509 PKI certificates exposed to Store Now, Decrypt Later (SNDL).'
    },
    {
      id: 'node-sym-pqc',
      label: `RESILIENT CRYPTO (${pqcAssets.length + otherCryptoAssets.length})`,
      sublabel: `${symAssets.length} AES-256 &bull; Prototype PQC`,
      category: 'RESILIENT_PRIMITIVES',
      color: '#10B981',
      x: 520,
      y: 130,
      count: pqcAssets.length + otherCryptoAssets.length,
      assets: [...pqcAssets, ...otherCryptoAssets],
      details: "Symmetric 256-bit ciphers retain 128-bit security under Grover's quadratic speedup O(sqrt(N)); PQC lattices resist Shor's algorithm."
    },
    {
      id: 'node-shor-vuln',
      label: 'SHOR ATTACK VECTOR',
      sublabel: `${criticalCount} Shor-Vulnerable Endpoints`,
      category: 'VULNERABILITY_VECTOR',
      color: '#EF4444',
      x: 180,
      y: 220,
      count: criticalCount,
      details: 'Direct polynomial-time factorization breaks TLS session handshakes and digital signature verification.'
    },
    {
      id: 'node-risk-engine',
      label: 'QUANTUM RISK ENGINE',
      sublabel: `Portfolio Exposure: ${avgRisk}/100`,
      category: 'ASSESSMENT_ENGINE',
      color: avgRisk > 50 ? '#F59E0B' : '#00F0FF',
      x: 350,
      y: 270,
      details: 'Deterministic risk assessment factoring Shor vulnerability, Mosca HNDL urgency, exposure, and business criticality.'
    },
    {
      id: 'node-pqc-target',
      label: 'PQC / HYBRID BLUEPRINT',
      sublabel: 'NIST FIPS 203 / 204 / 205',
      category: 'REMEDIATION_TARGET',
      color: '#00F0FF',
      x: 350,
      y: 360,
      details: 'Deploying ML-KEM-768 for key encapsulation and ML-DSA-65 / SLH-DSA for quantum-resilient signatures.'
    },
    {
      id: 'node-quantum-ready',
      label: 'POST-QUANTUM RESILIENCE',
      sublabel: 'Zero Mathematical Shor Vulnerability',
      category: 'TARGET_STATE',
      color: '#10B981',
      x: 350,
      y: 440,
      details: 'Complete end-to-end cryptographic agility and compliance with global quantum migration mandates.'
    }
  ];

  return (
    <div className="p-6 rounded-2xl command-card border-cyan-500/30 relative overflow-hidden flex flex-col justify-between">
      {/* Background Radial Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3 z-10">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Quantum Threat Map
          </span>
        </div>
        <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 border border-rose-800/60 px-2 py-0.5 rounded font-bold">
          {shorAssets.length} Shor-Vulnerable
        </span>
      </div>

      {/* Interactive SVG Threat Flow Diagram */}
      <div className="my-3 relative w-full h-[320px] bg-[#040814] rounded-xl border border-[#1E2D4A] overflow-hidden flex items-center justify-center">
        <svg viewBox="0 0 700 500" className="w-full h-full">
          <defs>
            <filter id="threatGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Connectors */}
          {/* Top Threat to Left & Right */}
          <line x1="350" y1="40" x2="180" y2="130" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
          <line x1="350" y1="40" x2="520" y2="130" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.6" />

          {/* Left Vulnerable Path */}
          <line x1="180" y1="130" x2="180" y2="220" stroke="#EF4444" strokeWidth="2.5" />
          <line x1="180" y1="220" x2="350" y2="270" stroke="#EF4444" strokeWidth="2" strokeDasharray="4 4" />

          {/* Right Resilient Path */}
          <line x1="520" y1="130" x2="350" y2="270" stroke="#10B981" strokeWidth="1.5" strokeOpacity="0.6" />

          {/* Center Path Down to PQC & Ready */}
          <line x1="350" y1="270" x2="350" y2="360" stroke="#00F0FF" strokeWidth="2.5" className="animate-pulse" />
          <line x1="350" y1="360" x2="350" y2="440" stroke="#10B981" strokeWidth="2.5" />

          {/* Nodes */}
          {threatNodes.map((node) => {
            const isSelected = selectedThreatNode?.id === node.id;
            const isVulnerable = node.color === '#EF4444';
            const isTarget = node.id === 'node-quantum-ready' || node.id === 'node-pqc-target';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setSelectedThreatNode(node)}
                className="cursor-pointer group"
              >
                {/* Warning Pulse for Vulnerable Nodes */}
                {isVulnerable && (
                  <circle r="22" fill="none" stroke="#EF4444" strokeWidth="1.5" opacity="0.4" className="animate-ping" />
                )}

                {/* Node Pill / Box */}
                <rect
                  x="-110"
                  y="-18"
                  width="220"
                  height="36"
                  rx="18"
                  fill="#070D1E"
                  stroke={node.color}
                  strokeWidth={isSelected ? "2.5" : "1.5"}
                  filter={isSelected ? "url(#threatGlow)" : "none"}
                  className="transition-all duration-300 group-hover:fill-[#0E1A38]"
                />

                {/* Status Indicator Dot */}
                <circle cx="-90" cy="0" r="4.5" fill={node.color} />

                {/* Text Label */}
                <text
                  x="5"
                  y="-2"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="10px"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="select-none pointer-events-none"
                >
                  {node.label}
                </text>
                <text
                  x="5"
                  y="10"
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

      {/* Interactive Node Detail Callout */}
      {selectedThreatNode ? (
        <div className="p-3.5 rounded-xl bg-[#050A14] border border-cyan-500/40 text-xs font-mono space-y-1.5 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedThreatNode.color }} />
              <strong className="text-white">{selectedThreatNode.label}</strong>
            </div>
            <button
              onClick={() => setSelectedThreatNode(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
            {selectedThreatNode.details}
          </p>
          {selectedThreatNode.assets && selectedThreatNode.assets.length > 0 && (
            <div className="pt-1 flex items-center justify-between text-[10px] text-cyan-400 border-t border-white/5">
              <span>{selectedThreatNode.assets.length} Discovered Assets</span>
              {onNavigate && (
                <button
                  onClick={() => onNavigate('cbom')}
                  className="hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Filter CBOM Inventory</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Default Bottom Telemetry Footer */
        <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">
            Target: <strong className="text-cyan-300">{appName}</strong>
          </span>
          <button
            onClick={() => onNavigate && onNavigate('readiness')}
            className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline flex items-center gap-1"
          >
            <span>Explore Threat Matrix</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
