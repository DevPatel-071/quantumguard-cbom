import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  Filter, 
  Download, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ExternalLink,
  Code
} from 'lucide-react';
import { downloadCBOMJson, downloadCBOMCsv } from '../services/api';

export default function CBOMInventory({ cbomReport, onSelectAsset }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlgo, setSelectedAlgo] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedConfidence, setSelectedConfidence] = useState('ALL');
  const [selectedExposure, setSelectedExposure] = useState('ALL');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // Sorting
  const [sortField, setSortField] = useState('migration_priority');
  const [sortAsc, setSortAsc] = useState(true);

  if (!cbomReport || !cbomReport.assets) {
    return (
      <div className="p-8 text-center text-slate-400">
        No active CBOM inventory found. Please run a scan first.
      </div>
    );
  }

  const allAssets = cbomReport.assets;

  // Unique Algorithms for filter dropdown
  const uniqueAlgos = useMemo(() => {
    const algos = new Set(allAssets.map(a => a.algorithm.split(' ')[0].split('-')[0].replace('(', '')));
    return Array.from(algos);
  }, [allAssets]);

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return allAssets.filter(asset => {
      // Search text
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

      // Algorithm filter
      const matchAlgo = selectedAlgo === 'ALL' || asset.algorithm.toUpperCase().includes(selectedAlgo.toUpperCase());

      // Risk filter
      const matchRisk = selectedRisk === 'ALL' || asset.risk_level === selectedRisk;

      // Confidence filter
      const matchConf = selectedConfidence === 'ALL' || asset.confidence === selectedConfidence;

      // Exposure filter
      const matchExpo = selectedExposure === 'ALL' || asset.exposure === selectedExposure;

      return matchSearch && matchAlgo && matchRisk && matchConf && matchExpo;
    });
  }, [allAssets, searchQuery, selectedAlgo, selectedRisk, selectedConfidence, selectedExposure]);

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
    CRITICAL: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    HIGH: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    MEDIUM: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    LOW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
  };

  const confBadgeStyles = {
    CONFIRMED_USAGE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    POTENTIAL_USAGE: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    DEPENDENCY_ONLY: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    INFERRED: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
            <Layers className="w-6 h-6 text-sky-400" />
            <span>Cryptography Bill of Materials (CBOM)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            CycloneDX 1.6 compliant cryptographic asset catalog with deterministic quantum risk scores and migration targets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => downloadCBOMJson(cbomReport)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => downloadCBOMCsv(cbomReport)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Multi-Faceted Filters */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by asset ID, algorithm, file path, evidence, library, or target PQC..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1">Algorithm Family</label>
            <select
              value={selectedAlgo}
              onChange={(e) => { setSelectedAlgo(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-sky-500 focus:outline-none"
            >
              <option value="ALL">All Algorithms</option>
              {uniqueAlgos.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1">Quantum Risk Level</label>
            <select
              value={selectedRisk}
              onChange={(e) => { setSelectedRisk(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-sky-500 focus:outline-none"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1">Evidence Confidence</label>
            <select
              value={selectedConfidence}
              onChange={(e) => { setSelectedConfidence(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-sky-500 focus:outline-none"
            >
              <option value="ALL">All Confidences</option>
              <option value="CONFIRMED_USAGE">CONFIRMED_USAGE</option>
              <option value="POTENTIAL_USAGE">POTENTIAL_USAGE</option>
              <option value="DEPENDENCY_ONLY">DEPENDENCY_ONLY</option>
              <option value="INFERRED">INFERRED</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 font-mono block mb-1">Network Exposure</label>
            <select
              value={selectedExposure}
              onChange={(e) => { setSelectedExposure(e.target.value); setCurrentPage(1); }}
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:border-sky-500 focus:outline-none"
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
          <span>Showing {paginatedAssets.length} of {sortedAssets.length} matched assets</span>
          {(searchQuery || selectedAlgo !== 'ALL' || selectedRisk !== 'ALL' || selectedConfidence !== 'ALL' || selectedExposure !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedAlgo('ALL');
                setSelectedRisk('ALL');
                setSelectedConfidence('ALL');
                setSelectedExposure('ALL');
              }}
              className="text-sky-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main CBOM Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 text-slate-400 uppercase font-mono text-[11px] border-b border-slate-800">
              <tr>
                <th className="p-3.5 cursor-pointer hover:text-sky-400" onClick={() => handleSort('migration_priority')}>
                  <div className="flex items-center gap-1">
                    <span>Rank</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:text-sky-400" onClick={() => handleSort('asset_id')}>
                  <div className="flex items-center gap-1">
                    <span>Asset ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:text-sky-400" onClick={() => handleSort('algorithm')}>
                  <div className="flex items-center gap-1">
                    <span>Algorithm</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Confidence</th>
                <th className="p-3.5 cursor-pointer hover:text-sky-400" onClick={() => handleSort('risk_score')}>
                  <div className="flex items-center gap-1">
                    <span>Quantum Risk</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5">Recommended PQC Target</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {paginatedAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    No cryptographic assets match your search/filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedAssets.map((asset) => (
                  <tr
                    key={asset.asset_id}
                    onClick={() => onSelectAsset(asset)}
                    className="hover:bg-slate-800/50 cursor-pointer transition"
                  >
                    <td className="p-3.5 font-mono font-bold text-sky-400">
                      #{asset.migration_priority}
                    </td>
                    <td className="p-3.5 font-mono text-slate-300">
                      {asset.asset_id}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        <span>{asset.algorithm}</span>
                        {asset.key_size && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({asset.key_size}b)
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {asset.usage}
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-300">
                      {asset.category}
                    </td>
                    <td className="p-3.5 font-mono text-indigo-300 max-w-[200px] truncate" title={asset.file}>
                      {asset.file}:{asset.line_number || 1}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${confBadgeStyles[asset.confidence]}`}>
                        {asset.confidence}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${riskBadgeStyles[asset.risk_level]}`}>
                        {asset.risk_level} ({asset.risk_score})
                      </span>
                    </td>
                    <td className="p-3.5 text-emerald-400 font-medium max-w-[240px] truncate" title={asset.recommended_pqc}>
                      {asset.recommended_pqc}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAsset(asset);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold transition"
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
          <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-800"
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
