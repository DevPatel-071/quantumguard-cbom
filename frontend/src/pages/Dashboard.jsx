import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Layers, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Gauge, 
  Compass, 
  DollarSign, 
  Activity, 
  Network, 
  Lock, 
  FileSearch,
  Database,
  CheckCircle2,
  Cpu,
  Radio,
  BarChart3,
  PieChart,
  Terminal,
  Zap,
  Info,
  Server,
  ExternalLink
} from 'lucide-react';

import QuantumThreatMap from '../components/visuals/QuantumThreatMap';
import FMEAMigrationFailureVisual from '../components/visuals/FMEAMigrationFailureVisual';
import CryptographicEnvironmentGraph from '../components/visuals/CryptographicEnvironmentGraph';
import HNDLTimelineVisual from '../components/visuals/HNDLTimelineVisual';
import MigrationReadinessVisual from '../components/visuals/MigrationReadinessVisual';
import QuantumRiskTrend from '../components/visuals/QuantumRiskTrend';

export default function Dashboard({ cbomReport, onNavigate, onSelectAsset }) {
  const [hoveredAlgo, setHoveredAlgo] = useState(null);
  const [activeDonutFilter, setActiveDonutFilter] = useState(null);

  // Empty State / First-Time Onboarding
  if (!cbomReport || !cbomReport.scan_summary || cbomReport.scan_summary.crypto_assets_count === 0) {
    return (
      <div className="p-6 sm:p-12 max-w-4xl mx-auto space-y-8 text-center animate-fadeIn">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3 shadow-cyan-glow flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-10 h-10 fill-none">
            <circle cx="50" cy="50" r="34" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" />
            <path d="M54 54 L74 74" stroke="#00F0FF" strokeWidth="12" strokeLinecap="round" />
            <circle cx="50" cy="50" r="9" fill="#FFFFFF" />
          </svg>
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30">
            ENTERPRISE CRYPTOGRAPHIC INTELLIGENCE
          </span>
          <h1 className="text-3xl font-black text-white font-mono tracking-tight glow-cyan pt-2">
            QUANTUM READINESS COMMAND CENTER
          </h1>
          <p className="text-xs font-mono text-slate-400 max-w-lg mx-auto leading-relaxed">
            Real-time cryptographic discovery, quantum exposure quantification, and deterministic PQC migration roadmaps.
          </p>
        </div>

        {/* 6 Onboarding Steps */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-left font-mono">
          <div className="p-4 rounded-xl bg-command-card/80 border border-command-border space-y-1">
            <span className="text-xs font-bold text-cyan-400">01. Source Discovery</span>
            <p className="text-[11px] text-slate-400 font-sans">Multi-channel AST &amp; binary cryptographic asset discovery.</p>
          </div>
          <div className="p-4 rounded-xl bg-command-card/80 border border-command-border space-y-1">
            <span className="text-xs font-bold text-blue-400">02. User Consent</span>
            <p className="text-[11px] text-slate-400 font-sans">Explicit Single Scan or Continuous Monitoring authorization.</p>
          </div>
          <div className="p-4 rounded-xl bg-command-card/80 border border-command-border space-y-1">
            <span className="text-xs font-bold text-purple-400">03. CycloneDX 1.6 CBOM</span>
            <p className="text-[11px] text-slate-400 font-sans">Machine-readable cryptography bill of materials export.</p>
          </div>
          <div className="p-4 rounded-xl bg-command-card/80 border border-command-border space-y-1">
            <span className="text-xs font-bold text-rose-400">04. Quantum FMEA</span>
            <p className="text-[11px] text-slate-400 font-sans">Deterministic Risk Priority Number (S &times; O &times; D = RPN) calculation.</p>
          </div>
          <div className="p-4 rounded-xl bg-command-card/80 border border-command-border space-y-1">
            <span className="text-xs font-bold text-amber-400">05. Mosca Theorem</span>
            <p className="text-[11px] text-slate-400 font-sans">Harvest-Now-Decrypt-Later (X + Y &gt; Z) timeline modeling.</p>
          </div>
          <div className="p-4 rounded-xl bg-command-card/80 border border-command-border space-y-1">
            <span className="text-xs font-bold text-emerald-400">06. NIST PQC Roadmap</span>
            <p className="text-[11px] text-slate-400 font-sans">FIPS 203/204 transitional hybrid &amp; pure migration playbooks.</p>
          </div>
        </div>

        <div>
          <button
            onClick={() => onNavigate('scan')}
            className="px-6 py-3 rounded-xl text-xs font-bold font-mono uppercase tracking-wider bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-glow transition flex items-center gap-2 mx-auto border border-cyan-400/40"
          >
            <FileSearch className="w-4 h-4" />
            <span>Launch First Discovery Scan</span>
          </button>
        </div>
      </div>
    );
  }

  const s = cbomReport.scan_summary;
  const r = cbomReport.readiness_assessment;
  const rm = cbomReport.roadmap_report;
  const c = cbomReport.cost_summary;
  const fmea = cbomReport.fmea_summary;
  const assets = cbomReport.assets || [];

  const score = r ? r.overall_score : 62.0;
  const statusLabel = r ? r.status_label : 'Moderate Readiness';

  // Calculate Risk Breakdown Counts
  const criticalCount = assets.filter(a => a.risk_level === 'CRITICAL').length;
  const highCount = assets.filter(a => a.risk_level === 'HIGH').length;
  const mediumCount = assets.filter(a => a.risk_level === 'MEDIUM').length;
  const lowCount = assets.filter(a => a.risk_level === 'LOW').length;
  const totalAssets = assets.length || s.crypto_assets_count || 1;

  const criticalPct = Math.round((criticalCount / totalAssets) * 100);
  const highPct = Math.round((highCount / totalAssets) * 100);
  const mediumPct = Math.round((mediumCount / totalAssets) * 100);
  const lowPct = Math.round((lowCount / totalAssets) * 100);

  // Group top algorithms
  const algoMap = {};
  assets.forEach((a) => {
    const key = a.algorithm || 'Unknown';
    if (!algoMap[key]) {
      algoMap[key] = {
        name: key,
        count: 0,
        isShor: a.quantum_vulnerability === 'CRITICAL' || a.quantum_vulnerability === 'HIGH' || a.quantum_vulnerability === 'SHOR_BROKEN' || key.includes('RSA') || key.includes('ECDSA') || key.includes('ECDH'),
        risk: a.risk_level,
        keySize: a.key_size,
        category: a.category
      };
    }
    algoMap[key].count += 1;
  });
  const topAlgos = Object.values(algoMap).sort((a, b) => b.count - a.count).slice(0, 5);
  const maxAlgoCount = Math.max(...topAlgos.map(a => a.count), 1);

  // Top 5 Immediate Priority Assets
  const topPriorities = assets
    .filter(a => a.migration_phase === 'PHASE_1_IMMEDIATE' || a.risk_level === 'CRITICAL' || (a.mosca && a.mosca.is_urgent))
    .slice(0, 5);

  // Radial Gauge Geometry (180 degree arc)
  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto text-slate-100 command-grid">
      
      {/* 1. HEADER COMMAND RIBBON */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30">
              ENTERPRISE CRYPTOGRAPHIC INTELLIGENCE
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Monitoring Active
            </span>
          </div>
          <h1 className="text-2xl font-black font-mono tracking-tight text-white glow-cyan flex items-center gap-2">
            <span>QUANTUM READINESS COMMAND CENTER</span>
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Real-time cryptographic intelligence for a quantum-resilient future &bull; Target: <strong className="text-white font-semibold">{s.target_name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('roadmap')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-[#070D1E] hover:bg-[#0D1730] text-slate-300 hover:text-white border border-[#1E2D4A] transition"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Roadmap</span>
          </button>
          <button
            onClick={() => onNavigate('scan')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-wide bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-glow transition border border-cyan-400/40"
          >
            <span>Run New Scan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. QUANTUM READINESS HERO ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hero Left: Animated Quantum Readiness Gauge (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl command-card border-cyan-500/30 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Quantum Readiness Index
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40">
              NIST FIPS 203/204
            </span>
          </div>

          {/* SVG Semi-Circular Dial */}
          <div className="my-3 flex flex-col items-center justify-center relative z-10">
            <div className="relative w-52 h-32 flex items-end justify-center">
              <svg viewBox="0 0 200 120" className="w-52 h-32">
                <defs>
                  <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="40%" stopColor="#F59E0B" />
                    <stop offset="70%" stopColor="#00F0FF" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>

                {/* Track background */}
                <path
                  d="M 20 105 A 80 80 0 0 1 180 105"
                  fill="none"
                  stroke="#1E2D4A"
                  strokeWidth="14"
                  strokeLinecap="round"
                />

                {/* Animated colored progress path */}
                <path
                  d="M 20 105 A 80 80 0 0 1 180 105"
                  fill="none"
                  stroke="url(#gaugeGradient)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  strokeDasharray={`${circumference}`}
                  strokeDashoffset={`${strokeDashoffset}`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Center Score Display */}
              <div className="absolute bottom-0 flex flex-col items-center">
                <span className="text-4xl font-black font-mono tracking-tight text-white glow-cyan">
                  {score.toFixed(1)}
                </span>
                <span className="text-[11px] font-mono text-slate-400">/ 100</span>
              </div>
            </div>

            <div className="mt-2 text-center space-y-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-950/80 text-blue-300 border border-blue-500/40">
                {statusLabel}
              </span>
              <p className="text-[11px] text-slate-400 font-mono">
                Maturity: <strong className="text-cyan-300">Level 3: Strategic Transitional</strong>
              </p>
            </div>
          </div>

          {/* 4 Pillar Sub-Meters */}
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#1E2D4A] text-[11px] font-mono z-10">
            <div className="p-2 rounded-lg bg-[#070D1E] border border-[#1E2D4A]">
              <span className="text-slate-400 block text-[9px] uppercase">Agility Score</span>
              <span className="font-bold text-cyan-300">{r?.pillar_scores?.crypto_agility?.toFixed(0) || '72'}/100</span>
            </div>
            <div className="p-2 rounded-lg bg-[#070D1E] border border-[#1E2D4A]">
              <span className="text-slate-400 block text-[9px] uppercase">PQC Resistance</span>
              <span className="font-bold text-rose-400">{r?.pillar_scores?.algorithm_quantum_resistance?.toFixed(0) || '38'}/100</span>
            </div>
            <div className="p-2 rounded-lg bg-[#070D1E] border border-[#1E2D4A]">
              <span className="text-slate-400 block text-[9px] uppercase">FMEA Stability</span>
              <span className="font-bold text-amber-400">{r?.pillar_scores?.fmea_stability?.toFixed(0) || '58'}/100</span>
            </div>
            <div className="p-2 rounded-lg bg-[#070D1E] border border-[#1E2D4A]">
              <span className="text-slate-400 block text-[9px] uppercase">Governance</span>
              <span className="font-bold text-emerald-400">{r?.pillar_scores?.governance_policy?.toFixed(0) || '80'}/100</span>
            </div>
          </div>
        </div>

        {/* Hero Right: SIGNATURE VISUAL 1 — QUANTUM THREAT MAP (7 cols) */}
        <div className="lg:col-span-7">
          <QuantumThreatMap 
            cbomReport={cbomReport}
            onSelectAsset={onSelectAsset}
            onNavigate={onNavigate}
          />
        </div>

      </div>

      {/* 3. KEY TELEMETRY TILES ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Total Crypto Assets */}
        <div 
          onClick={() => onNavigate('cbom')}
          className="p-5 rounded-2xl command-card cursor-pointer hover:border-cyan-500/50 space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Total Crypto Assets
            </span>
            <div className="p-2 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-white font-mono glow-cyan">
              {s.crypto_assets_count}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Discovered in <strong className="text-slate-200">{s.files_scanned} files</strong> across repository
            </p>
          </div>
          <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[11px] font-mono text-cyan-400">
            <span>View CBOM Inventory</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Metric 2: Critical Shor Risk */}
        <div 
          onClick={() => onNavigate('readiness')}
          className="p-5 rounded-2xl command-card border-rose-500/40 cursor-pointer hover:border-rose-500 space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
              Critical Shor Vulnerable
            </span>
            <div className="p-2 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-500/40 group-hover:scale-110 transition">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-rose-400 font-mono glow-red">
              {s.critical_risk_count}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              RSA &amp; ECC public-key primitives
            </p>
          </div>
          <div className="pt-2 border-t border-rose-950/60 flex items-center justify-between text-[11px] font-mono text-rose-400">
            <span>Urgent Remediation</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Metric 3: High Risk & FMEA Flags */}
        <div 
          onClick={() => onNavigate('fmea')}
          className="p-5 rounded-2xl command-card cursor-pointer hover:border-amber-500/50 space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              High Risk &amp; FMEA Flags
            </span>
            <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-500/40 group-hover:scale-110 transition">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-amber-400 font-mono">
              {s.high_risk_count}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              High RPN migration failure modes
            </p>
          </div>
          <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[11px] font-mono text-amber-400">
            <span>Inspect FMEA Matrix</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

        {/* Metric 4: Mosca HNDL Urgency */}
        <div 
          onClick={() => onNavigate('simulators')}
          className="p-5 rounded-2xl command-card cursor-pointer hover:border-indigo-500/50 space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Mosca HNDL Urgent (X+Y &gt; Z)
            </span>
            <div className="p-2 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-500/40 group-hover:scale-110 transition">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-indigo-400 font-mono">
              {s.mosca_urgent_count}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Harvest-Now-Decrypt-Later exposed
            </p>
          </div>
          <div className="pt-2 border-t border-[#1E2D4A] flex items-center justify-between text-[11px] font-mono text-indigo-400">
            <span>Open HNDL Simulator</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
          </div>
        </div>

      </div>

      {/* 4. VISUAL ANALYTICS ROW: Risk Classification Donut, Top Algorithm Exposure Bars, and SIGNATURE VISUAL 2 — FMEA VISUAL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Donut: Risk Classification (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl command-card space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Risk Classification
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">{totalAssets} Assets</span>
          </div>

          {/* SVG Donut Chart */}
          <div className="flex items-center justify-center my-2 relative">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-44 h-44 -rotate-90">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0D1730" strokeWidth="12" />

                {/* Critical Segment (Red) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="12"
                  strokeDasharray={`${(criticalPct * 2.387).toFixed(1)} 238.7`}
                  strokeDashoffset="0"
                  className="transition-all duration-500 hover:stroke-[14] cursor-pointer"
                  onClick={() => onNavigate('cbom')}
                />

                {/* High Segment (Orange) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="12"
                  strokeDasharray={`${(highPct * 2.387).toFixed(1)} 238.7`}
                  strokeDashoffset={`${-(criticalPct * 2.387).toFixed(1)}`}
                  className="transition-all duration-500 hover:stroke-[14] cursor-pointer"
                  onClick={() => onNavigate('cbom')}
                />

                {/* Medium Segment (Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  strokeDasharray={`${(mediumPct * 2.387).toFixed(1)} 238.7`}
                  strokeDashoffset={`${-((criticalPct + highPct) * 2.387).toFixed(1)}`}
                  className="transition-all duration-500 hover:stroke-[14] cursor-pointer"
                  onClick={() => onNavigate('cbom')}
                />

                {/* Low Segment (Emerald) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray={`${(lowPct * 2.387).toFixed(1)} 238.7`}
                  strokeDashoffset={`${-((criticalPct + highPct + mediumPct) * 2.387).toFixed(1)}`}
                  className="transition-all duration-500 hover:stroke-[14] cursor-pointer"
                  onClick={() => onNavigate('cbom')}
                />
              </svg>

              {/* Center Donut Counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black font-mono text-white glow-cyan">
                  {totalAssets}
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  Assets
                </span>
              </div>
            </div>
          </div>

          {/* Risk Legend Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div 
              onClick={() => onNavigate('cbom')}
              className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between cursor-pointer hover:bg-rose-950/60 transition"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-rose-glow" />
                <span className="text-rose-300 font-semibold">Critical</span>
              </div>
              <span className="font-bold text-white">{criticalCount} ({criticalPct}%)</span>
            </div>

            <div 
              onClick={() => onNavigate('cbom')}
              className="p-2 rounded-xl bg-orange-950/40 border border-orange-500/30 flex items-center justify-between cursor-pointer hover:bg-orange-950/60 transition"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-orange-300 font-semibold">High</span>
              </div>
              <span className="font-bold text-white">{highCount} ({highPct}%)</span>
            </div>

            <div 
              onClick={() => onNavigate('cbom')}
              className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between cursor-pointer hover:bg-amber-950/60 transition"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-amber-300 font-semibold">Medium</span>
              </div>
              <span className="font-bold text-white">{mediumCount} ({mediumPct}%)</span>
            </div>

            <div 
              onClick={() => onNavigate('cbom')}
              className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between cursor-pointer hover:bg-emerald-950/60 transition"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-300 font-semibold">Low</span>
              </div>
              <span className="font-bold text-white">{lowCount} ({lowPct}%)</span>
            </div>
          </div>
        </div>

        {/* Horizontal Bar Chart: Top Algorithm Exposure (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl command-card space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#1E2D4A] pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Top Algorithm Exposure
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">By Detection Count</span>
          </div>

          {/* Bars */}
          <div className="space-y-3 my-1">
            {topAlgos.map((algo, idx) => {
              const widthPct = Math.round((algo.count / maxAlgoCount) * 100);
              return (
                <div 
                  key={idx}
                  onClick={() => onNavigate('cbom')}
                  onMouseEnter={() => setHoveredAlgo(algo.name)}
                  onMouseLeave={() => setHoveredAlgo(null)}
                  className="space-y-1 group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 group-hover:text-cyan-300 transition">
                        {algo.name} {algo.keySize ? `(${algo.keySize}b)` : ''}
                      </span>
                      {algo.isShor ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-950 text-rose-300 border border-rose-500/40">
                          Shor Broken
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          Quantum Resilient
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-white">{algo.count} instances</span>
                  </div>

                  {/* Bar track and fill */}
                  <div className="w-full h-2.5 rounded-full bg-[#050A14] border border-[#1E2D4A] overflow-hidden">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className={`h-full rounded-full transition-all duration-700 ${
                        algo.isShor
                          ? 'bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 shadow-rose-glow'
                          : 'bg-gradient-to-r from-cyan-500 to-emerald-500 shadow-emerald-glow'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2.5 rounded-xl bg-[#070D1E] border border-[#1E2D4A] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Critical public-key algorithms require hybrid encapsulation.</span>
            <button 
              onClick={() => onNavigate('knowledge-base')}
              className="text-cyan-400 hover:underline font-bold"
            >
              KB &rarr;
            </button>
          </div>
        </div>

        {/* SIGNATURE VISUAL 2: FMEA MIGRATION FAILURE VISUAL (4 cols) */}
        <div className="lg:col-span-4">
          <FMEAMigrationFailureVisual 
            cbomReport={cbomReport}
            onNavigate={onNavigate}
            onSelectAsset={onSelectAsset}
          />
        </div>

      </div>

      {/* 5. SIGNATURE VISUAL 3: FULL-WIDTH CRYPTOGRAPHIC ENVIRONMENT GRAPH */}
      <div className="w-full">
        <CryptographicEnvironmentGraph 
          cbomReport={cbomReport}
          onSelectAsset={onSelectAsset}
          onNavigate={onNavigate}
        />
      </div>

      {/* 6. STRATEGIC PLANNING ROW: HNDL Timeline + Migration Readiness + Risk Trend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Module 1: Mosca / HNDL Visual Timeline */}
        <HNDLTimelineVisual 
          cbomReport={cbomReport}
          onNavigate={onNavigate}
        />

        {/* Module 2: Migration Readiness Step Visual */}
        <MigrationReadinessVisual 
          cbomReport={cbomReport}
          onNavigate={onNavigate}
        />

        {/* Module 3: Quantum Risk Trend Line Chart */}
        <QuantumRiskTrend 
          cbomReport={cbomReport}
          onNavigate={onNavigate}
        />

      </div>

      {/* 7. PRIORITY REMEDIATION BACKLOG */}
      <div className="p-6 rounded-2xl command-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1E2D4A]">
          <div>
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Immediate Quantum Vulnerability Backlog (Top Action Items)</span>
            </h2>
            <p className="text-[11px] font-mono text-slate-400">
              Ranked by polynomial Shor exposure, Harvest-Now-Decrypt-Later urgency, and migration RPN.
            </p>
          </div>

          <button
            onClick={() => onNavigate('cbom')}
            className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            <span>View Complete Inventory ({assets.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {topPriorities.map((asset) => (
            <div
              key={asset.asset_id}
              className="p-4 rounded-xl bg-[#070D1E] border border-[#1E2D4A] hover:border-cyan-500/50 hover:bg-[#0A1224] transition flex flex-col xl:flex-row xl:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-cyan-400 text-xs bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                    #{asset.migration_priority} {asset.asset_id}
                  </span>
                  <span className="font-bold text-white text-xs font-mono">
                    {asset.algorithm} {asset.key_size ? `(${asset.key_size}-bit)` : ''}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-500/40 font-mono">
                    Risk: {asset.risk_score} (CRITICAL)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-500/40 font-mono">
                    {asset.phase_label || asset.migration_phase}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono truncate" title={`${asset.file}:${asset.line_number || 1}`}>
                  <span className="text-slate-300 font-semibold">Location:</span> {asset.file}:{asset.line_number || 1} &bull; <span className="text-slate-300 font-semibold">Criticality:</span> {asset.business_criticality}
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed font-mono">
                  <strong className="text-cyan-300">Action:</strong> {asset.suggested_action}
                </p>
              </div>

              <div className="flex items-center justify-between xl:justify-end gap-4 pt-3 xl:pt-0 border-t xl:border-t-0 xl:border-l border-[#1E2D4A] xl:pl-4 flex-shrink-0">
                <div className="text-left xl:text-right">
                  <span className="text-[10px] font-mono font-semibold uppercase text-slate-400 block tracking-wider">
                    Recommended Target
                  </span>
                  <span className="font-bold text-xs text-emerald-400 font-mono glow-emerald">
                    {asset.recommended_pqc || 'ML-KEM-768'}
                  </span>
                </div>
                <button
                  onClick={() => onSelectAsset(asset)}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-[#0D1730] hover:bg-cyan-950 text-slate-200 hover:text-cyan-300 border border-[#1E2D4A] hover:border-cyan-500/50 transition shadow-xs flex items-center gap-1.5 flex-shrink-0"
                >
                  <span>Inspect</span>
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
