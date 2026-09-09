import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  ShieldAlert, 
  ChevronDown,
  ChevronUp
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
    CRITICAL: 'bg-rose-50 text-rose-700 border-rose-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    LOW_TO_MEDIUM: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    VERY_LOW: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    QUANTUM_RESISTANT: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-6xl mx-auto">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <span>Cryptographic Knowledge Base & Quantum Threat Catalog</span>
        </h1>
        <p className="text-xs text-slate-500">
          Curated knowledge repository containing mathematical quantum attack models, Shor/Grover vulnerability classifications, and NIST PQC replacement standards.
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search algorithms by name, quantum attack (Shor/Grover), usage, or NIST standard..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
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
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block">{details.category}</span>
                    <h3 className="text-base font-bold text-slate-900">{details.name}</h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border font-mono whitespace-nowrap ${vulnBadgeStyles[vuln] || 'bg-slate-100 text-slate-700'}`}>
                    {vuln.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px] font-mono">
                    <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{details.quantum_attack || 'Quantum Cryptanalysis'}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {details.quantum_impact_description || details.security_status}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-600 flex flex-wrap gap-1 items-center">
                    <span className="text-slate-400 font-mono text-[11px]">Uses:</span>
                    {details.uses?.map((u, uIdx) => (
                      <span key={uIdx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                        {u}
                      </span>
                    ))}
                  </div>

                  {details.common_key_sizes && (
                    <div className="text-slate-500 text-[11px] font-mono">
                      <span className="text-slate-400">Key Sizes: </span>
                      <span className="text-slate-800 font-medium">{details.common_key_sizes.join(', ')} bits</span>
                    </div>
                  )}
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="pt-3 border-t border-slate-100 space-y-3 text-xs animate-fadeIn">
                    
                    {details.recommended_pqc_alternatives && (
                      <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 space-y-1">
                        <span className="text-[11px] font-bold text-purple-800 font-mono block">Recommended PQC Replacement:</span>
                        <div className="text-emerald-700 font-bold text-xs">
                          {typeof details.recommended_pqc_alternatives === 'object'
                            ? Object.entries(details.recommended_pqc_alternatives).map(([k, v]) => (
                                <div key={k}>{k}: {v}</div>
                              ))
                            : details.recommended_pqc_alternatives}
                        </div>
                      </div>
                    )}

                    {details.hybrid_alternatives && (
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 space-y-1">
                        <span className="text-[11px] font-bold text-blue-800 font-mono block">Hybrid Alternative:</span>
                        <div className="text-blue-700 text-xs">
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
                        <span className="text-[11px] text-slate-500 font-medium">Common Detected APIs:</span>
                        <div className="p-2 rounded bg-slate-50 border border-slate-200 font-mono text-[10px] text-slate-700 max-h-20 overflow-y-auto">
                          {details.common_apis.join(', ')}
                        </div>
                      </div>
                    )}

                    {details.performance_considerations && (
                      <div className="text-[11px] text-slate-600">
                        <strong className="text-slate-800">Performance:</strong> {details.performance_considerations}
                      </div>
                    )}
                  </div>
                )}

              </div>

              <button
                onClick={() => setExpandedAlgo(isExpanded ? null : key)}
                className="mt-3 w-full py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-blue-700 border border-slate-200 text-xs font-semibold flex items-center justify-center gap-1 transition"
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
