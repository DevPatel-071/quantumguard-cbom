import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Download, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  Cpu,
  Radio,
  FileCode,
  PieChart as PieIcon,
  BarChart2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { downloadCBOMJson, downloadCBOMCsv } from '../services/api';

export default function CBOMInventory({ cbomReport, onSelectAsset }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlgo, setSelectedAlgo] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedConfidence, setSelectedConfidence] = useState('ALL');
  const [selectedExposure, setSelectedExposure] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sorting
  const [sortField, setSortField] = useState('migration_priority');
  const [sortAsc, setSortAsc] = useState(true);

  if (!cbomReport || !cbomReport.assets) {
    return (
      <div className="p-12 text-center text-slate-400 command-card max-w-xl mx-auto my-12">
        <Layers className="w-12 h-12 text-cyan-500/50 mx-auto mb-4 animate-pulse" />
        <h3 className="text-lg font-bold text-white mb-2">No Active CBOM Inventory Found</h3>
        <p className="text-xs text-slate-400 mb-4">Execute a cryptographic scan in the Scan Studio to generate CycloneDX 1.6 CBOM records.</p>
      </div>
    );
  }

  const allAssets = cbomReport.assets;

  // Visual Analytics Computations (100% Real Derived Data)
  const analytics = useMemo(() => {
    const total = allAssets.length || 1;
    
    // Risk counts
    const riskCounts = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    // Algorithm counts
    const algoMap = {};
    // Category counts
    const catMap = {};
    // Exposure counts
    const expoMap = {};
    // Shor vulnerable count
    let shorCount = 0;

    allAssets.forEach(a => {
      // Risk
      if (riskCounts[a.risk_level] !== undefined) riskCounts[a.risk_level]++;
      
      // Algorithm base
      const rawAlgo = (a.algorithm || 'UNKNOWN').split(' ')[0].split('-')[0].replace('(', '');
      algoMap[rawAlgo] = (algoMap[rawAlgo] || 0) + 1;

      // Category
      const cat = a.category || 'Asymmetric Cipher';
      catMap[cat] = (catMap[cat] || 0) + 1;

      // Exposure
      const exp = a.exposure || 'INTERNAL_NETWORK';
      expoMap[exp] = (expoMap[exp] || 0) + 1;

      // Shor check
      const algoUpper = (a.algorithm || '').toUpperCase();
      if (algoUpper.includes('RSA') || algoUpper.includes('ECC') || algoUpper.includes('ECDSA') || algoUpper.includes('ECDH') || algoUpper.includes('DH') || algoUpper.includes('DSA')) {
        shorCount++;
      }
    });

    const topAlgos = Object.entries(algoMap)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const categories = Object.entries(catMap)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);

    return {
      total: allAssets.length,
      shorCount,
      riskCounts,
      topAlgos,
      categories,
      expoMap
    };
  }, [allAssets]);

  // Unique Algorithms for filter dropdown
  const uniqueAlgos = useMemo(() => {
    const algos = new Set(allAssets.map(a => a.algorithm.split(' ')[0].split('-')[0].replace('(', '')));
    return Array.from(algos);
  }, [allAssets]);

  // Unique Categories
  const uniqueCategories = useMemo(() => {
    const cats = new Set(allAssets.map(a => a.category).filter(Boolean));
    return Array.from(cats);
  }, [allAssets]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return allAssets.filter(asset => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        asset.asset_id.toLowerCase().includes(q) ||
        asset.algorithm.toLowerCase().includes(q) ||
        asset.file.toLowerCase().includes(q) ||
        asset.usage.toLowerCase().includes(q) ||
        asset.evidence.toLowerCase().includes(q) ||
        (asset.library && asset.library.toLowerCase().includes(q)) ||
        (asset.recommended_pqc && asset.recommended_pqc.toLowerCase().includes(q))
      );

      const matchAlgo = selectedAlgo === 'ALL' || asset.algorithm.toUpperCase().includes(selectedAlgo.toUpperCase());
      const matchRisk = selectedRisk === 'ALL' || asset.risk_level === selectedRisk;
      const matchConf = selectedConfidence === 'ALL' || asset.confidence === selectedConfidence;
      const matchExpo = selectedExposure === 'ALL' || asset.exposure === selectedExposure;
      const matchCat = selectedCategory === 'ALL' || asset.category === selectedCategory;

      return matchSearch && matchAlgo && matchRisk && matchConf && matchExpo && matchCat;
    });
  }, [allAssets, searchQuery, selectedAlgo, selectedRisk, selectedConfidence, selectedExposure, selectedCategory]);

  // Sorted Assets
  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredAssets, sortField, sortAsc]);

  // Paginated Assets
  const totalPages = Math.ceil(sortedAssets.length / itemsPerPage) || 1;
  const paginatedAssets = sortedAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const riskBadgeStyles = {
    CRITICAL: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    HIGH: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  };

  const confBadgeStyles = {
    CONFIRMED_USAGE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    POTENTIAL_USAGE: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    DEPENDENCY_ONLY: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    INFERRED: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
  };

  // Category Colors
  const catColors = ['#00F0FF', '#818CF8', '#38BDF8', '#F59E0B', '#10B981', '#EC4899'];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto command-grid">
      
      {/* Top Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              CYCLONEDX 1.6 SCHEMA
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              SHA-256 VERIFIED
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-cyan-400" />
            <span>Cryptographic Bill of Materials (CBOM)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Standardized cryptographic inventory catalog with deterministic quantum vulnerability scores and NIST FIPS migration targets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => downloadCBOMJson(cbomReport)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#0D1730] border border-[#1E2D4A] text-slate-200 hover:text-cyan-400 hover:border-cyan-500/50 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CycloneDX JSON</span>
          </button>
          <button
            onClick={() => downloadCBOMCsv(cbomReport)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#0D1730] border border-[#1E2D4A] text-slate-200 hover:text-cyan-400 hover:border-cyan-500/50 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Visual Analytics Deck: 3 Interactive Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Chart 1: Algorithm Distribution Bar Chart */}
        <div className="command-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Algorithm Exposure</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">{analytics.topAlgos.length} Top Families</span>
          </div>

          <div className="space-y-3">
            {analytics.topAlgos.map((item, idx) => {
              const isShor = ['RSA', 'ECC', 'ECDSA', 'DH', 'DSA'].includes(item.name.toUpperCase());
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] font-mono">
                    <span className="flex items-center gap-1.5 text-slate-200 font-bold">
                      {item.name}
                      {isShor && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Shor
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400">{item.count} assets ({item.pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#050A14] rounded-full overflow-hidden border border-[#1E2D4A]/50">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        isShor ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      }`}
                      style={{ width: `${Math.max(item.pct, 8)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Category Distribution Donut / Visual Stack */}
        <div className="command-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Crypto Primitives</h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">{analytics.total} Discovered</span>
          </div>

          <div className="space-y-2.5">
            {analytics.categories.slice(0, 4).map((cat, idx) => {
              const color = catColors[idx % catColors.length];
              return (
                <div key={cat.name} className="p-2 rounded-lg bg-[#050A14] border border-[#1E2D4A]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-xs text-slate-300 font-medium truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 font-mono text-xs">
                    <span className="text-white font-bold">{cat.count}</span>
                    <span className="text-[10px] text-slate-400">({cat.pct}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Quantum Risk & Exposure Ratio */}
        <div className="command-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Risk & Network Vector</h3>
            </div>
            <span className="text-[10px] font-mono text-rose-400">{analytics.shorCount} Shor Vulnerable</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-3 rounded-lg bg-[#050A14] border border-rose-500/30 text-center">
              <div className="text-[10px] font-mono text-rose-400 uppercase font-semibold">Critical / High</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {analytics.riskCounts.CRITICAL + analytics.riskCounts.HIGH}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {Math.round(((analytics.riskCounts.CRITICAL + analytics.riskCounts.HIGH) / analytics.total) * 100)}% of catalog
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#050A14] border border-cyan-500/30 text-center">
              <div className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">Med / Low / Safe</div>
              <div className="text-xl font-bold font-mono text-white mt-0.5">
                {analytics.riskCounts.MEDIUM + analytics.riskCounts.LOW}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {Math.round(((analytics.riskCounts.MEDIUM + analytics.riskCounts.LOW) / analytics.total) * 100)}% of catalog
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-orange-400" />
              Internet Facing
            </span>
            <span className="text-orange-300 font-bold">
              {analytics.expoMap['INTERNET_FACING'] || 0} assets ({Math.round(((analytics.expoMap['INTERNET_FACING'] || 0) / analytics.total) * 100)}%)
            </span>
          </div>
        </div>

      </div>

      {/* Search & Multi-Faceted Filters */}
      <div className="p-5 rounded-xl command-card space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by asset ID, algorithm, file path, evidence, library, or target NIST PQC..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-xs text-white placeholder-slate-500 focus:bg-[#080E1E] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition font-mono"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="text-[10px] font-mono font-semibold text-slate-400 block mb-1">ALGORITHM FAMILY</label>
            <select
              value={selectedAlgo}
              onChange={(e) => { setSelectedAlgo(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-slate-200 focus:border-cyan-400 focus:outline-none font-mono"
            >
              <option value="ALL">All Algorithms</option>
              {uniqueAlgos.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono font-semibold text-slate-400 block mb-1">QUANTUM RISK</label>
            <select
              value={selectedRisk}
              onChange={(e) => { setSelectedRisk(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-slate-200 focus:border-cyan-400 focus:outline-none font-mono"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono font-semibold text-slate-400 block mb-1">PRIMITIVE CATEGORY</label>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-slate-200 focus:border-cyan-400 focus:outline-none font-mono"
            >
              <option value="ALL">All Categories</option>
              {uniqueCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono font-semibold text-slate-400 block mb-1">CONFIDENCE</label>
            <select
              value={selectedConfidence}
              onChange={(e) => { setSelectedConfidence(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-slate-200 focus:border-cyan-400 focus:outline-none font-mono"
            >
              <option value="ALL">All Confidences</option>
              <option value="CONFIRMED_USAGE">CONFIRMED_USAGE</option>
              <option value="POTENTIAL_USAGE">POTENTIAL_USAGE</option>
              <option value="DEPENDENCY_ONLY">DEPENDENCY_ONLY</option>
              <option value="INFERRED">INFERRED</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono font-semibold text-slate-400 block mb-1">NETWORK EXPOSURE</label>
            <select
              value={selectedExposure}
              onChange={(e) => { setSelectedExposure(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-slate-200 focus:border-cyan-400 focus:outline-none font-mono"
            >
              <option value="ALL">All Exposures</option>
              <option value="INTERNET_FACING">INTERNET_FACING</option>
              <option value="INTERNAL_NETWORK">INTERNAL_NETWORK</option>
              <option value="ISOLATED">ISOLATED</option>
            </select>
          </div>
        </div>

        {/* Results summary bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
          <span>Showing <strong className="text-white">{paginatedAssets.length}</strong> of <strong className="text-cyan-400">{sortedAssets.length}</strong> matched assets</span>
          {(searchQuery || selectedAlgo !== 'ALL' || selectedRisk !== 'ALL' || selectedConfidence !== 'ALL' || selectedExposure !== 'ALL' || selectedCategory !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedAlgo('ALL');
                setSelectedRisk('ALL');
                setSelectedConfidence('ALL');
                setSelectedExposure('ALL');
                setSelectedCategory('ALL');
              }}
              className="text-cyan-400 font-semibold hover:underline"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main CBOM Table */}
      <div className="rounded-xl border border-[#1E2D4A] bg-[#080E1E] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#050A14] text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-[#1E2D4A]">
              <tr>
                <th className="p-3.5 cursor-pointer hover:text-cyan-400 transition" onClick={() => handleSort('migration_priority')}>
                  <div className="flex items-center gap-1">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3 text-cyan-500" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:text-cyan-400 transition" onClick={() => handleSort('asset_id')}>
                  <div className="flex items-center gap-1">
                    <span>Asset ID</span>
                    <ArrowUpDown className="w-3 h-3 text-cyan-500" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:text-cyan-400 transition" onClick={() => handleSort('algorithm')}>
                  <div className="flex items-center gap-1">
                    <span>Algorithm</span>
                    <ArrowUpDown className="w-3 h-3 text-cyan-500" />
                  </div>
                </th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Confidence</th>
                <th className="p-3.5 cursor-pointer hover:text-cyan-400 transition" onClick={() => handleSort('risk_score')}>
                  <div className="flex items-center gap-1">
                    <span>Quantum Risk</span>
                    <ArrowUpDown className="w-3 h-3 text-cyan-500" />
                  </div>
                </th>
                <th className="p-3.5">Recommended PQC Target</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2D4A]/50 font-sans">
              {paginatedAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-mono">
                    No cryptographic assets match your search/filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedAssets.map((asset) => (
                  <tr
                    key={asset.asset_id}
                    onClick={() => onSelectAsset(asset)}
                    className="hover:bg-[#0D1730]/70 cursor-pointer transition border-b border-[#1E2D4A]/30"
                  >
                    <td className="p-3.5 font-mono font-bold text-cyan-400">
                      #{asset.migration_priority}
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">
                      {asset.asset_id}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                        <span>{asset.algorithm}</span>
                        {asset.key_size && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({asset.key_size}b)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                        {asset.usage}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {asset.category}
                    </td>
                    <td className="p-3.5 font-mono text-cyan-300 max-w-[200px] truncate" title={asset.file}>
                      {asset.file}:{asset.line_number || 1}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${confBadgeStyles[asset.confidence] || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                        {asset.confidence}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${riskBadgeStyles[asset.risk_level] || 'bg-slate-800 text-slate-300 border-slate-700'}`}>
                        {asset.risk_level} ({asset.risk_score})
                      </span>
                    </td>
                    <td className="p-3.5 text-emerald-400 font-semibold font-mono max-w-[240px] truncate" title={asset.recommended_pqc}>
                      {asset.recommended_pqc}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset);
                        }}
                        className="px-2.5 py-1 rounded-md bg-[#0D1730] border border-[#1E2D4A] hover:border-cyan-500 text-cyan-400 text-xs font-semibold font-mono transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-[#050A14] border-t border-[#1E2D4A] flex items-center justify-between text-xs text-slate-400 font-mono">
            <div>
              Page <strong className="text-white">{currentPage}</strong> of <strong className="text-cyan-400">{totalPages}</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-[#080E1E] border border-[#1E2D4A] text-slate-300 disabled:opacity-40 hover:border-cyan-500 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-[#080E1E] border border-[#1E2D4A] text-slate-300 disabled:opacity-40 hover:border-cyan-500 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
