import React, { useState } from 'react';
import { 
  Compass, 
  Layers, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Scale,
  Zap,
  Lock,
  FileKey,
  KeyRound,
  Sliders,
  Check
} from 'lucide-react';

export default function Recommendations() {
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, KEM, DSA, SYMMETRIC

  const migrationPairs = [
    {
      type: 'KEM',
      current: 'RSA-2048 / ECDH P-256',
      currentType: 'Classical Asymmetric KEX',
      currentVuln: 'Shor Vulnerable (0 bits quantum security)',
      target: 'ML-KEM-768 (FIPS 203)',
      hybrid: 'X25519 + ML-KEM-768',
      useCase: 'TLS 1.3, VPN, API Key Exchange',
      securityLevel: 'NIST Level 3 (AES-192 equivalent)',
      ciphertextSize: '1,088 bytes',
      latency: '< 40 µs (Blazing)',
      complexity: 'Medium (Ciphertext expand)',
      riskReduction: 95
    },
    {
      type: 'DSA',
      current: 'RSA-2048 / ECDSA P-256',
      currentType: 'Classical Digital Signatures',
      currentVuln: 'Shor ECDLP Factorization',
      target: 'ML-DSA-65 (FIPS 204)',
      hybrid: 'ECDSA P-256 + ML-DSA-65 Dual Certs',
      useCase: 'PKI X.509, Code Signing, JWTs',
      securityLevel: 'NIST Level 3 (AES-192 equivalent)',
      ciphertextSize: '3,309 bytes (Sig)',
      latency: '< 60 µs (Fast Verify)',
      complexity: 'Medium (Header expansion)',
      riskReduction: 92
    },
    {
      type: 'DSA',
      current: 'RSA-4096 (Root CA / Firmware)',
      currentType: 'Archival & Secure Boot Signatures',
      currentVuln: 'Shor Factorization (Catastrophic)',
      target: 'SLH-DSA-SHA2-128s (FIPS 205)',
      hybrid: 'Composite RSA + SPHINCS+',
      useCase: 'Root Trust Anchors, Firmware, Archival',
      securityLevel: 'NIST Level 1 (Conservative Hash-Only)',
      ciphertextSize: '7.8 KB (Sig)',
      latency: '~ 1.2 ms (Heavy)',
      complexity: 'Low math / High bandwidth',
      riskReduction: 99
    },
    {
      type: 'SYMMETRIC',
      current: 'AES-128 / 3DES / Blowfish',
      currentType: 'Legacy Bulk Symmetric',
      currentVuln: 'Grover halving (64 bits effective)',
      target: 'AES-256-GCM + SHA-384',
      hybrid: 'Direct Upgrade to 256-bit Key',
      useCase: 'Database Storage, Payload Encryption',
      securityLevel: '128 bits post-quantum security',
      ciphertextSize: '0 byte overhead',
      latency: 'Hardware AES-NI Accelerated',
      complexity: 'Low (Key re-generation)',
      riskReduction: 100
    }
  ];

  const filteredPairs = activeTab === 'ALL' ? migrationPairs : migrationPairs.filter(m => m.type === activeTab);

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto command-grid">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded">
              NIST STANDARDS ROADMAP
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              FIPS 203 / 204 / 205 VERIFIED
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-indigo-400" />
            <span>Post-Quantum Cryptography (PQC) Recommendations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official NIST FIPS standards alignment, transitional hybrid composite deployment patterns, and trade-off comparison metrics.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-xs font-mono">
          {['ALL', 'KEM', 'DSA', 'SYMMETRIC'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md transition ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Stage Migration Concept Pathway */}
      <div className="command-card p-6 space-y-5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>3-STAGE POST-QUANTUM TRANSITION PATHWAY</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-[#050A14] border border-rose-500/30 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                PHASE 1: CURRENT
              </span>
              <span className="text-[10px] font-mono text-rose-400 font-bold">Vulnerable</span>
            </div>
            <h3 className="font-bold text-sm text-white font-mono">Classical Cryptography</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              RSA (2048/4096), ECC (P-256/P-384), ECDSA, ECDH, Diffie-Hellman, Ed25519.
            </p>
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-[11px] text-rose-300 border border-rose-500/20 font-mono">
              <strong>Vulnerability:</strong> Broken in polynomial time by Shor's algorithm. Active Harvest-Now-Decrypt-Later risk for past session keys.
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-[#050A14] border border-amber-500/30 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PHASE 2: TRANSITION
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">Hybrid Defense</span>
            </div>
            <h3 className="font-bold text-sm text-white font-mono">Hybrid Classical + PQC</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              X25519 + ML-KEM-768 (KEX) & Composite Dual Signatures (ECDSA P-256 + ML-DSA-65).
            </p>
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-[11px] text-amber-300 border border-amber-500/20 font-mono">
              <strong>Advantage:</strong> Complies with legacy certifications (FIPS 140-3) while immunizing communications against future quantum decryption.
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-[#050A14] border border-emerald-500/30 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                PHASE 3: TARGET
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">Pure PQC Target</span>
            </div>
            <h3 className="font-bold text-sm text-white font-mono">Pure NIST PQC Standard</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              ML-KEM (FIPS 203), ML-DSA (FIPS 204), SLH-DSA (FIPS 205), AES-256-GCM.
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-[11px] text-emerald-300 border border-emerald-500/20 font-mono">
              <strong>Status:</strong> Officially standardized by NIST (Aug 2024). Full quantum-resistance against all known classical and quantum cryptanalysis.
            </div>
          </div>

        </div>
      </div>

      {/* Visual Algorithm Migration Comparison Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <span>Direct Visual Algorithm Migration Trade-offs</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">{filteredPairs.length} Recommendation Profiles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredPairs.map((pair, idx) => (
            <div key={idx} className="command-card p-5 space-y-4 font-mono text-xs">
              
              {/* Header: Current -> Target */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1E2D4A]">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-rose-400 uppercase font-semibold">Legacy Target</span>
                  <div className="text-sm font-bold text-white">{pair.current}</div>
                  <span className="text-[10px] text-slate-400 font-sans block">{pair.useCase}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                <div className="space-y-0.5 text-right">
                  <span className="text-[10px] text-emerald-400 uppercase font-semibold">NIST FIPS Standard</span>
                  <div className="text-sm font-bold text-emerald-400">{pair.target}</div>
                  <span className="text-[10px] text-cyan-300 font-sans block">{pair.securityLevel}</span>
                </div>
              </div>

              {/* Hybrid Recommendation Callout */}
              <div className="p-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] flex items-center justify-between">
                <span className="text-slate-400">Transitional Hybrid:</span>
                <span className="text-cyan-300 font-bold">{pair.hybrid}</span>
              </div>

              {/* Comparative Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-[#050A14] border border-[#1E2D4A]/50 space-y-0.5">
                  <span className="text-[10px] text-slate-400">Ciphertext / Sig Size</span>
                  <div className="text-slate-200 font-bold">{pair.ciphertextSize}</div>
                </div>
                <div className="p-2 rounded bg-[#050A14] border border-[#1E2D4A]/50 space-y-0.5">
                  <span className="text-[10px] text-slate-400">Latency Overhead</span>
                  <div className="text-emerald-400 font-bold">{pair.latency}</div>
                </div>
              </div>

              {/* Risk Reduction Visual Progress */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-400">Quantum Risk Reduction</span>
                  <span className="text-emerald-400 font-bold">-{pair.riskReduction}% Residual Exposure</span>
                </div>
                <div className="h-1.5 w-full bg-[#050A14] rounded-full overflow-hidden border border-[#1E2D4A]">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" style={{ width: `${pair.riskReduction}%` }} />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 3 NIST Standards Deep-Dive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ML-KEM */}
        <div className="command-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              NIST FIPS 203
            </span>
            <span className="text-xs font-mono text-slate-400">Module-Lattice KEM</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white font-mono">ML-KEM (CRYSTALS-Kyber)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Primary NIST standard for Post-Quantum Key Encapsulation (KEX).
            </p>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="flex justify-between border-b border-[#1E2D4A] pb-1">
              <span className="text-slate-400">Security Levels:</span>
              <span className="text-white font-bold">ML-KEM-512 / 768 / 1024</span>
            </div>
            <div className="flex justify-between border-b border-[#1E2D4A] pb-1">
              <span className="text-slate-400">Ciphertext Size:</span>
              <span className="text-white font-bold">1,088 bytes (Level 3)</span>
            </div>
            <div className="flex justify-between border-b border-[#1E2D4A] pb-1">
              <span className="text-slate-400">Performance:</span>
              <span className="text-emerald-400 font-bold">&lt; 50 &mu;s keygen/encap</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            <strong>Ideal For:</strong> TLS 1.3 Key Exchange, OpenSSH sessions, VPN tunnel establishment, and public-key encryption wrappers.
          </p>
        </div>

        {/* ML-DSA */}
        <div className="command-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              NIST FIPS 204
            </span>
            <span className="text-xs font-mono text-slate-400">Module-Lattice DSA</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white font-mono">ML-DSA (CRYSTALS-Dilithium)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Primary NIST standard for General-Purpose Digital Signatures.
            </p>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="flex justify-between border-b border-[#1E2D4A] pb-1">
              <span className="text-slate-400">Security Levels:</span>
              <span className="text-white font-bold">ML-DSA-44 / 65 / 87</span>
            </div>
            <div className="flex justify-between border-b border-[#1E2D4A] pb-1">
              <span className="text-slate-400">Signature Size:</span>
              <span className="text-white font-bold">2,420 - 3,309 bytes</span>
            </div>
            <div className="flex justify-between border-b border-[#1E2D4A] pb-1">
              <span className="text-slate-400">Performance:</span>
              <span className="text-emerald-400 font-bold">Extremely fast verification</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            <strong>Ideal For:</strong> PKI X.509 Certificates, Code Signing, JWT token authentication, and document signing.
          </p>
        </div>

        {/* SLH-DSA */}
        <div className="command-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
              NIST FIPS 205
            </span>
            <span className="text-xs font-mono text-slate-400">Stateless Hash-Based</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white font-mono">SLH-DSA (SPHINCS+)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Ultra-conservative signature standard based strictly on hash functions.
            </p>
          </div>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="flex justify-between border-b border-[#1E2D4A] pb-1">
              <span className="text-slate-400">Security Assumption:</span>
              <span className="text-white font-bold">SHA-2 / SHAKE only</span>
            </div>
            <div className="flex justify-between border-b border-[#1E2D4A] pb-1">
              <span className="text-slate-400">Signature Size:</span>
              <span className="text-white font-bold">7.8 KB - 49 KB</span>
            </div>
            <div className="flex justify-between border-b border-[#1E2D4A] pb-1">
              <span className="text-slate-400">Lattice Hardness:</span>
              <span className="text-indigo-400 font-bold">Zero lattice risk</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            <strong>Ideal For:</strong> Root CA certificates, firmware updates, secure boot ROMs, and long-term archival signing.
          </p>
        </div>

      </div>

    </div>
  );
}
