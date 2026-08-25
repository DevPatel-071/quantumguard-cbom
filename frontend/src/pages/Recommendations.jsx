import React from 'react';
import { 
  Compass, 
  Layers, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Binary, 
  Sparkles,
  Zap,
  Info,
  Scale
} from 'lucide-react';

export default function Recommendations() {
  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
          <Compass className="w-6 h-6 text-purple-400" />
          <span>Post-Quantum & Hybrid Cryptography Roadmap</span>
        </h1>
        <p className="text-xs text-slate-400">
          NIST FIPS 203 / 204 / 205 standards roadmap, transitional hybrid composite deployment patterns, and algorithm trade-off matrices.
        </p>
      </div>

      {/* 3-Stage Migration Concept Pathway */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>3-Stage Post-Quantum Transition Framework</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-rose-500/30 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                PHASE 1: CURRENT
              </span>
              <span className="text-xs font-mono text-slate-500">Vulnerable</span>
            </div>
            <h3 className="font-bold text-sm text-slate-100">Classical Cryptography</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              RSA (2048/4096), ECC (P-256/P-384), ECDSA, ECDH, Diffie-Hellman, Ed25519.
            </p>
            <div className="p-2.5 rounded bg-rose-500/10 text-[11px] text-rose-300 border border-rose-500/20">
              <strong>Vulnerability:</strong> Broken in polynomial time by Shor's algorithm. Active Harvest-Now-Decrypt-Later risk for past session keys.
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                PHASE 2: TRANSITION
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">Hybrid Defense</span>
            </div>
            <h3 className="font-bold text-sm text-slate-100">Hybrid Classical + PQC</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              X25519 + ML-KEM-768 (KEX) & Composite Dual Signatures (ECDSA P-256 + ML-DSA-65).
            </p>
            <div className="p-2.5 rounded bg-amber-500/10 text-[11px] text-amber-300 border border-amber-500/20">
              <strong>Advantage:</strong> Complies with legacy certifications (FIPS 140-3) while immunizing communications against future quantum decryption.
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                PHASE 3: TARGET
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">Post-Quantum Pure</span>
            </div>
            <h3 className="font-bold text-sm text-slate-100">Pure NIST PQC Standard</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ML-KEM (FIPS 203), ML-DSA (FIPS 204), SLH-DSA (FIPS 205), AES-256-GCM.
            </p>
            <div className="p-2.5 rounded bg-emerald-500/10 text-[11px] text-emerald-300 border border-emerald-500/20">
              <strong>Status:</strong> Officially standardized by NIST (Aug 2024). Full quantum-resistance against all known classical and quantum cryptanalysis.
            </div>
          </div>

        </div>
      </div>

      {/* NIST Standard Algorithms Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ML-KEM */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-sky-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30">
              NIST FIPS 203
            </span>
            <span className="text-xs font-mono text-slate-400">Module-Lattice KEM</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-100">ML-KEM (CRYSTALS-Kyber)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Primary NIST standard for Post-Quantum Key Encapsulation (KEX).
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Security Levels:</span>
              <span className="font-mono text-slate-200">ML-KEM-512 / 768 / 1024</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Ciphertext Size:</span>
              <span className="font-mono text-slate-200">1,088 bytes (Level 3)</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Public Key Size:</span>
              <span className="font-mono text-slate-200">1,184 bytes</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Performance:</span>
              <span className="font-mono text-emerald-400 font-bold">&lt; 50 &mu;s keygen/encap</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong>Ideal For:</strong> TLS 1.3 Key Exchange, OpenSSH sessions, VPN tunnel establishment, and public-key encryption wrappers.
          </p>
        </div>

        {/* ML-DSA */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30">
              NIST FIPS 204
            </span>
            <span className="text-xs font-mono text-slate-400">Module-Lattice DSA</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-100">ML-DSA (CRYSTALS-Dilithium)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Primary NIST standard for General-Purpose Digital Signatures.
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Security Levels:</span>
              <span className="font-mono text-slate-200">ML-DSA-44 / 65 / 87</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Signature Size:</span>
              <span className="font-mono text-slate-200">2,420 - 3,309 bytes</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Public Key Size:</span>
              <span className="font-mono text-slate-200">1,312 - 1,952 bytes</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Performance:</span>
              <span className="font-mono text-emerald-400 font-bold">Extremely fast verification</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong>Ideal For:</strong> PKI X.509 Certificates, Code Signing, JWT token authentication, and document signing.
          </p>
        </div>

        {/* SLH-DSA */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              NIST FIPS 205
            </span>
            <span className="text-xs font-mono text-slate-400">Stateless Hash-Based</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-100">SLH-DSA (SPHINCS+)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Ultra-conservative signature standard based strictly on hash functions.
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Security Assumption:</span>
              <span className="font-mono text-slate-200">SHA-2 / SHAKE only</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Signature Size:</span>
              <span className="font-mono text-slate-200">7.8 KB - 49 KB</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Public Key Size:</span>
              <span className="font-mono text-slate-200">32 - 64 bytes (Tiny)</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1">
              <span className="text-slate-500">Lattice Hardness:</span>
              <span className="font-mono text-purple-400 font-bold">Zero lattice risk</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong>Ideal For:</strong> Root CA certificates, firmware updates, secure boot ROMs, and long-term archival signing.
          </p>
        </div>

      </div>

      {/* Migration Comparison Matrix */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
          <Scale className="w-4 h-4 text-sky-400" />
          <span>Classical vs Post-Quantum Migration Matrix</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3">Current Classical</th>
                <th className="p-3">Cryptographic Use</th>
                <th className="p-3">Quantum Vulnerability</th>
                <th className="p-3">Transitional Hybrid</th>
                <th className="p-3">Target NIST PQC Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              <tr>
                <td className="p-3 font-bold text-rose-400">RSA-2048 / RSA-4096</td>
                <td className="p-3 text-slate-300">Digital Signatures & Certs</td>
                <td className="p-3 text-rose-300">Shor's Factorization</td>
                <td className="p-3 text-sky-300">Dual RSA + ML-DSA-65</td>
                <td className="p-3 font-bold text-emerald-400">ML-DSA-65 (FIPS 204)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-rose-400">ECDSA (P-256 / secp256k1)</td>
                <td className="p-3 text-slate-300">Identity & Token Signatures</td>
                <td className="p-3 text-rose-300">Shor's Discrete Log (ECDLP)</td>
                <td className="p-3 text-sky-300">Dual ECDSA + ML-DSA-44</td>
                <td className="p-3 font-bold text-emerald-400">ML-DSA-65 (FIPS 204)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-rose-400">ECDH / X25519 / DH</td>
                <td className="p-3 text-slate-300">Key Agreement & Session KEX</td>
                <td className="p-3 text-rose-300">Shor's Algorithm (HNDL Risk)</td>
                <td className="p-3 text-sky-300">X25519 + ML-KEM-768</td>
                <td className="p-3 font-bold text-emerald-400">ML-KEM-768 (FIPS 203)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-400">AES-128</td>
                <td className="p-3 text-slate-300">Symmetric Bulk Encryption</td>
                <td className="p-3 text-amber-300">Grover (Halved to 64 bits)</td>
                <td className="p-3 text-sky-300">AES-256-GCM + ML-KEM wrap</td>
                <td className="p-3 font-bold text-emerald-400">AES-256-GCM (Quantum Safe)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-rose-500">3DES / DES</td>
                <td className="p-3 text-slate-300">Legacy Storage Encryption</td>
                <td className="p-3 text-rose-400">Classically broken & Grover</td>
                <td className="p-3 text-sky-300">Immediate Direct Upgrade</td>
                <td className="p-3 font-bold text-emerald-400">AES-256-GCM</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-rose-500">MD5 / SHA-1</td>
                <td className="p-3 text-slate-300">Hashing & Signatures</td>
                <td className="p-3 text-rose-400">Collisions & Quantum BHT</td>
                <td className="p-3 text-sky-300">Immediate Direct Upgrade</td>
                <td className="p-3 font-bold text-emerald-400">SHA-256 / SHA-384 / SHA-512</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
