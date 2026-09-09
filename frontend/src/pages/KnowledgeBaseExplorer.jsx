import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  ShieldAlert, 
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
  Lock,
  Sparkles,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { fetchKnowledgeBase } from '../services/api';

export default function KnowledgeBaseExplorer() {
  const [kbData, setKbData] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedAlgo, setExpandedAlgo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledgeBase()
      .then((data) => {
        setKbData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = [
    'ALL',
    'Asymmetric Cryptography',
    'Symmetric Cryptography',
    'Cryptographic Hash Function',
    'Cryptographic Protocol',
    'Post-Quantum Cryptography (NIST Standard)'
  ];

  const filteredAlgos = useMemo(() => {
    return Object.entries(kbData).filter(([key, details]) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        key.toLowerCase().includes(q) ||
        details.name?.toLowerCase().includes(q) ||
        details.category?.toLowerCase().includes(q) ||
        (details.quantum_attack && details.quantum_attack.toLowerCase().includes(q)) ||
        (details.uses && details.uses.some(u => u.toLowerCase().includes(q)))
      );

      const matchCat = selectedCategory === 'ALL' || details.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [kbData, searchQuery, selectedCategory]);

  const vulnBadgeStyles = {
    CRITICAL: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    HIGH: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    MEDIUM: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    LOW_TO_MEDIUM: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
    LOW: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    VERY_LOW: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    QUANTUM_RESISTANT: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto command-grid">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              CRYPTOGRAPHIC THREAT REPOSITORY
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              NIST STANDARDS &amp; ATTACK MATHEMATICS
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <span>Cryptographic Knowledge Base &amp; Threat Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Curated knowledge repository containing mathematical quantum attack models, Shor/Grover vulnerability classifications, and NIST PQC replacement standards.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="p-5 rounded-xl command-card space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search algorithms by name, quantum attack (Shor/Grover), usage, or NIST standard..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none font-mono"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold shadow-cyan-glow'
                  : 'bg-[#050A14] text-slate-400 hover:text-white border border-[#1E2D4A]'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Algorithm Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlgos.map(([key, details]) => {
          const isExpanded = expandedAlgo === key;
          const vuln = details.quantum_vulnerability || 'MEDIUM';

          return (
            <div
              key={key}
              className="p-5 rounded-xl command-card hover:border-cyan-500/40 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3 font-mono text-xs">
                
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase tracking-wider block">{details.category}</span>
                    <h3 className="text-base font-bold text-white font-mono mt-0.5">{details.name}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${vulnBadgeStyles[vuln] || 'bg-slate-800 text-slate-300'}`}>
                    {vuln.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A] space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
                    <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{details.quantum_attack || 'Quantum Cryptanalysis Vector'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {details.quantum_impact_description || details.security_status}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-slate-400 flex flex-wrap gap-1 items-center">
                    <span className="text-slate-500 text-[10px] uppercase">Uses:</span>
                    {details.uses?.map((u, uIdx) => (
                      <span key={uIdx} className="px-2 py-0.5 rounded bg-[#050A14] border border-[#1E2D4A] text-slate-300 text-[10px]">
                        {u}
                      </span>
                    ))}
                  </div>

                  {details.common_key_sizes && (
                    <div className="text-slate-400 text-[11px]">
                      <span className="text-slate-500">Key Sizes: </span>
                      <span className="text-white font-bold">{details.common_key_sizes.join(', ')} bits</span>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-[#1E2D4A] space-y-3 animate-fadeIn">
                    
                    {details.recommended_pqc_alternatives && (
                      <div className="p-3 rounded-lg bg-[#050A14] border border-cyan-500/30 space-y-1">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase block">Recommended PQC Replacement:</span>
                        <div className="text-emerald-400 font-bold text-xs">
                          {typeof details.recommended_pqc_alternatives === 'object'
                            ? Object.entries(details.recommended_pqc_alternatives).map(([k, v]) => (
                                <div key={k}>{k}: {v}</div>
                              ))
                            : details.recommended_pqc_alternatives}
                        </div>
                      </div>
                    )}

                    {details.hybrid_alternatives && (
                      <div className="p-3 rounded-lg bg-[#050A14] border border-indigo-500/30 space-y-1">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase block">Transitional Hybrid:</span>
                        <div className="text-cyan-300 text-xs">
                          {typeof details.hybrid_alternatives === 'object'
                            ? Object.entries(details.hybrid_alternatives).map(([k, v]) => (
                                <div key={k}>{k}: {v}</div>
                              ))
                            : details.hybrid_alternatives}
                        </div>
                      </div>
                    )}

                    {details.common_apis && (
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase">Common Detected AST Calls:</span>
                        <div className="p-2 rounded bg-[#050A14] border border-[#1E2D4A] text-[10px] text-slate-300 max-h-20 overflow-y-auto font-mono">
                          {details.common_apis.join(', ')}
                        </div>
                      </div>
                    )}

                    {details.performance_considerations && (
                      <div className="text-[11px] text-slate-300 font-sans">
                        <strong className="text-white font-mono">Performance:</strong> {details.performance_considerations}
                      </div>
                    )}
                  </div>
                )}

              </div>

              <button
                onClick={() => setExpandedAlgo(isExpanded ? null : key)}
                className="mt-3 w-full py-2 rounded-lg bg-[#050A14] hover:bg-[#0D1730] text-cyan-400 border border-[#1E2D4A] hover:border-cyan-500/50 text-xs font-mono font-bold flex items-center justify-center gap-1 transition"
              >
                <span>{isExpanded ? 'Hide Specifications' : 'View Full Specifications & AST Bindings'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
