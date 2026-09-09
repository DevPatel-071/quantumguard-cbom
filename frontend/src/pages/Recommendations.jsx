import React from 'react';
import { 
  Compass, 
  Layers, 
  Cpu, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Scale
} from 'lucide-react';

export default function Recommendations() {
  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-6xl mx-auto">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Compass className="w-6 h-6 text-purple-600" />
          <span>Post-Quantum & Hybrid Cryptography Roadmap</span>
        </h1>
        <p className="text-xs text-slate-500">
          NIST FIPS 203 / 204 / 205 standards roadmap, transitional hybrid composite deployment patterns, and algorithm trade-off matrices.
        </p>
      </div>

      {/* 3-Stage Migration Concept Pathway */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>3-Stage Post-Quantum Transition Framework</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          
          {/* Step 1 */}
          <div className="p-5 rounded-xl bg-rose-50/50 border border-rose-200 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                PHASE 1: CURRENT
              </span>
              <span className="text-xs font-mono text-rose-600 font-semibold">Vulnerable</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Classical Cryptography</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              RSA (2048/4096), ECC (P-256/P-384), ECDSA, ECDH, Diffie-Hellman, Ed25519.
            </p>
            <div className="p-2.5 rounded-lg bg-rose-100/60 text-[11px] text-rose-800 border border-rose-200">
              <strong>Vulnerability:</strong> Broken in polynomial time by Shor's algorithm. Active Harvest-Now-Decrypt-Later risk for past session keys.
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
                PHASE 2: TRANSITION
              </span>
              <span className="text-xs font-mono text-amber-700 font-bold">Hybrid Defense</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Hybrid Classical + PQC</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              X25519 + ML-KEM-768 (KEX) & Composite Dual Signatures (ECDSA P-256 + ML-DSA-65).
            </p>
            <div className="p-2.5 rounded-lg bg-amber-100/60 text-[11px] text-amber-800 border border-amber-200">
              <strong>Advantage:</strong> Complies with legacy certifications (FIPS 140-3) while immunizing communications against future quantum decryption.
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                PHASE 3: TARGET
              </span>
              <span className="text-xs font-mono text-emerald-700 font-bold">Post-Quantum Pure</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900">Pure NIST PQC Standard</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ML-KEM (FIPS 203), ML-DSA (FIPS 204), SLH-DSA (FIPS 205), AES-256-GCM.
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-100/60 text-[11px] text-emerald-800 border border-emerald-200">
              <strong>Status:</strong> Officially standardized by NIST (Aug 2024). Full quantum-resistance against all known classical and quantum cryptanalysis.
            </div>
          </div>

        </div>
      </div>

      {/* NIST Standard Algorithms Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ML-KEM */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200">
              NIST FIPS 203
            </span>
            <span className="text-xs font-mono text-slate-500">Module-Lattice KEM</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">ML-KEM (CRYSTALS-Kyber)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Primary NIST standard for Post-Quantum Key Encapsulation (KEX).
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Security Levels:</span>
              <span className="font-mono text-slate-800 font-medium">ML-KEM-512 / 768 / 1024</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Ciphertext Size:</span>
              <span className="font-mono text-slate-800 font-medium">1,088 bytes (Level 3)</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Public Key Size:</span>
              <span className="font-mono text-slate-800 font-medium">1,184 bytes</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Performance:</span>
              <span className="font-mono text-emerald-700 font-bold">&lt; 50 &mu;s keygen/encap</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>Ideal For:</strong> TLS 1.3 Key Exchange, OpenSSH sessions, VPN tunnel establishment, and public-key encryption wrappers.
          </p>
        </div>

        {/* ML-DSA */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-50 text-purple-700 border border-purple-200">
              NIST FIPS 204
            </span>
            <span className="text-xs font-mono text-slate-500">Module-Lattice DSA</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">ML-DSA (CRYSTALS-Dilithium)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Primary NIST standard for General-Purpose Digital Signatures.
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Security Levels:</span>
              <span className="font-mono text-slate-800 font-medium">ML-DSA-44 / 65 / 87</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Signature Size:</span>
              <span className="font-mono text-slate-800 font-medium">2,420 - 3,309 bytes</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Public Key Size:</span>
              <span className="font-mono text-slate-800 font-medium">1,312 - 1,952 bytes</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Performance:</span>
              <span className="font-mono text-emerald-700 font-bold">Extremely fast verification</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>Ideal For:</strong> PKI X.509 Certificates, Code Signing, JWT token authentication, and document signing.
          </p>
        </div>

        {/* SLH-DSA */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200">
              NIST FIPS 205
            </span>
            <span className="text-xs font-mono text-slate-500">Stateless Hash-Based</span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900">SLH-DSA (SPHINCS+)</h3>
            <p className="text-xs text-slate-500 mt-1">
              Ultra-conservative signature standard based strictly on hash functions.
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Security Assumption:</span>
              <span className="font-mono text-slate-800 font-medium">SHA-2 / SHAKE only</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Signature Size:</span>
              <span className="font-mono text-slate-800 font-medium">7.8 KB - 49 KB</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Public Key Size:</span>
              <span className="font-mono text-slate-800 font-medium">32 - 64 bytes (Tiny)</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1">
              <span className="text-slate-500">Lattice Hardness:</span>
              <span className="font-mono text-purple-700 font-bold">Zero lattice risk</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            <strong>Ideal For:</strong> Root CA certificates, firmware updates, secure boot ROMs, and long-term archival signing.
          </p>
        </div>

      </div>

      {/* Migration Comparison Matrix */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
          <Scale className="w-4 h-4 text-blue-600" />
          <span>Classical vs Post-Quantum Migration Matrix</span>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3">Current Classical</th>
                <th className="p-3">Cryptographic Use</th>
                <th className="p-3">Quantum Vulnerability</th>
                <th className="p-3">Transitional Hybrid</th>
                <th className="p-3">Target NIST PQC Standard</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              <tr>
                <td className="p-3 font-bold text-rose-700">RSA-2048 / RSA-4096</td>
                <td className="p-3 text-slate-700">Digital Signatures & Certs</td>
                <td className="p-3 text-rose-600">Shor's Factorization</td>
                <td className="p-3 text-blue-700 font-medium">Dual RSA + ML-DSA-65</td>
                <td className="p-3 font-bold text-emerald-700">ML-DSA-65 (FIPS 204)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-rose-700">ECDSA (P-256 / secp256k1)</td>
                <td className="p-3 text-slate-700">Identity & Token Signatures</td>
                <td className="p-3 text-rose-600">Shor's Discrete Log (ECDLP)</td>
                <td className="p-3 text-blue-700 font-medium">Dual ECDSA + ML-DSA-44</td>
                <td className="p-3 font-bold text-emerald-700">ML-DSA-65 (FIPS 204)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-rose-700">ECDH / X25519 / DH</td>
                <td className="p-3 text-slate-700">Key Agreement & Session KEX</td>
                <td className="p-3 text-rose-600">Shor's Algorithm (HNDL Risk)</td>
                <td className="p-3 text-blue-700 font-medium">X25519 + ML-KEM-768</td>
                <td className="p-3 font-bold text-emerald-700">ML-KEM-768 (FIPS 203)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-700">AES-128</td>
                <td className="p-3 text-slate-700">Symmetric Bulk Encryption</td>
                <td className="p-3 text-amber-600">Grover (Halved to 64 bits)</td>
                <td className="p-3 text-blue-700 font-medium">AES-256-GCM + ML-KEM wrap</td>
                <td className="p-3 font-bold text-emerald-700">AES-256-GCM (Quantum Safe)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-rose-700">3DES / DES</td>
                <td className="p-3 text-slate-700">Legacy Storage Encryption</td>
                <td className="p-3 text-rose-600">Classically broken & Grover</td>
                <td className="p-3 text-blue-700 font-medium">Immediate Direct Upgrade</td>
                <td className="p-3 font-bold text-emerald-700">AES-256-GCM</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-rose-700">MD5 / SHA-1</td>
                <td className="p-3 text-slate-700">Hashing & Signatures</td>
                <td className="p-3 text-rose-600">Collisions & Quantum BHT</td>
                <td className="p-3 text-blue-700 font-medium">Immediate Direct Upgrade</td>
                <td className="p-3 font-bold text-emerald-700">SHA-256 / SHA-384 / SHA-512</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
