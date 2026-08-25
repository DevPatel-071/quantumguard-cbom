import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Cpu, 
  Binary, 
  Code2, 
  Layers,
  ChevronDown,
  ChevronUp,
  Filter
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
        details.name.toLowerCase().includes(q) ||
        details.category.toLowerCase().includes(q) ||
        (details.quantum_attack && details.quantum_attack.toLowerCase().includes(q)) ||
        (details.uses && details.uses.some(u => u.toLowerCase().includes(q)))
      );

      const matchCat = selectedCategory === 'ALL' || details.category === selectedCategory;

      return matchSearch && matchCat;
    });
  }, [kbData, searchQuery, selectedCategory]);

  const vulnBadgeStyles = {
    CRITICAL: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    LOW_TO_MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    LOW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    VERY_LOW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    QUANTUM_RESISTANT: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-sky-400" />
          <span>Cryptographic Knowledge Base & Quantum Threat Catalog</span>
        </h1>
        <p className="text-xs text-slate-400">
          Curated knowledge repository containing mathematical quantum attack models, Shor/Grover vulnerability classifications, and NIST PQC replacement standards.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search algorithms by name, quantum attack (Shor/Grover), usage, or NIST standard..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
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
              className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block">{details.category}</span>
                    <h3 className="text-base font-bold text-slate-100">{details.name}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border font-mono whitespace-nowrap ${vulnBadgeStyles[vuln] || 'bg-slate-800 text-slate-300'}`}>
                    {vuln.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px] font-mono">
                    <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{details.quantum_attack || 'Quantum Cryptanalysis'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {details.quantum_impact_description || details.security_status}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-400 flex flex-wrap gap-1 items-center">
                    <span className="text-slate-500 font-mono text-[11px]">Uses:</span>
                    {details.uses?.map((u, uIdx) => (
                      <span key={uIdx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {u}
                      </span>
                    ))}
                  </div>

                  {details.common_key_sizes && (
                    <div className="text-slate-400 text-[11px] font-mono">
                      <span className="text-slate-500">Key Sizes: </span>
                      <span className="text-slate-300">{details.common_key_sizes.join(', ')} bits</span>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-800 space-y-3 text-xs animate-in fade-in duration-200">
                    
                    {details.recommended_pqc_alternatives && (
                      <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-500/20 space-y-1">
                        <span className="text-[11px] font-bold text-purple-400 font-mono block">Recommended PQC Replacement:</span>
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
                      <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-500/20 space-y-1">
                        <span className="text-[11px] font-bold text-sky-400 font-mono block">Hybrid Alternative:</span>
                        <div className="text-sky-300 text-xs">
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
                        <span className="text-[11px] text-slate-500 font-mono">Common Detected APIs:</span>
                        <div className="p-2 rounded bg-slate-950 font-mono text-[10px] text-slate-400 max-h-20 overflow-y-auto">
                          {details.common_apis.join(', ')}
                        </div>
                      </div>
                    )}

                    {details.performance_considerations && (
                      <div className="text-[11px] text-slate-400">
                        <strong className="text-slate-300">Performance:</strong> {details.performance_considerations}
                      </div>
                    )}
                  </div>
                )}

              </div>

              <button
                onClick={() => setExpandedAlgo(isExpanded ? null : key)}
                className="mt-3 w-full py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-sky-400 text-xs font-semibold flex items-center justify-center gap-1 transition"
              >
                <span>{isExpanded ? 'Hide Specifications' : 'View Full Specifications & APIs'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
