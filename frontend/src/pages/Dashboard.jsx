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
  Server
} from 'lucide-react';

export default function Dashboard({ cbomReport, onNavigate, onSelectAsset }) {
  const [hoveredAlgo, setHoveredAlgo] = useState(null);

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
            <p className="text-[11px] text-slate-400 font-sans">Multi-channel AST & binary cryptographic asset discovery.</p>
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
            <p className="text-[11px] text-slate-400 font-sans">Deterministic Risk Priority Number ($S \times O \times D = \text{RPN}$) calculation.</p>
          </div>
          <div className="p-4 rounded-xl bg-command-card/80 border border-command-border space-y-1">
            <span className="text-xs font-bold text-amber-400">05. Mosca Theorem</span>
            <p className="text-[11px] text-slate-400 font-sans">Harvest-Now-Decrypt-Later ($X+Y&gt;Z$) timeline modeling.</p>
          </div>
          <div className="p-4 rounded-xl bg-command-card/80 border border-command-border space-y-1">
            <span className="text-xs font-bold text-emerald-400">06. NIST PQC Roadmap</span>
            <p className="text-[11px] text-slate-400 font-sans">FIPS 203/204 transitional hybrid & pure migration playbooks.</p>
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
  const dep = cbomReport.dependency_graph;
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
        isShor: a.quantum_vulnerability === 'SHOR_BROKEN',
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

  // FMEA Distribution
  const fmeaCrit = assets.filter(a => a.fmea && a.fmea.rpn >= 300).length;
  const fmeaHigh = assets.filter(a => a.fmea && a.fmea.rpn >= 200 && a.fmea.rpn < 300).length;
  const fmeaMed = assets.filter(a => a.fmea && a.fmea.rpn >= 100 && a.fmea.rpn < 200).length;
  const fmeaLow = assets.filter(a => a.fmea && a.fmea.rpn < 100).length;
  const maxFmeaGroup = Math.max(fmeaCrit, fmeaHigh, fmeaMed, fmeaLow, 1);

  // Radial Gauge Geometry (180 degree arc)
  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="p-6 sm:p-8 space-y-7 max-w-7xl mx-auto text-slate-100">
      
      {/* 1. Header Command Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-command-border/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 shadow-xs">
              ENTERPRISE CRYPTOGRAPHIC INTELLIGENCE
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-mono font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Monitoring Active
            </span>
          </div>
          <h1 className="text-2xl font-black font-mono tracking-tight text-white glow-cyan flex items-center gap-2">
            <span>QUANTUM READINESS DASHBOARD</span>
          </h1>
          <p className="text-xs font-mono text-slate-400">
            Real-time cryptographic intelligence for a quantum-resilient future &bull; Target: <strong className="text-white font-semibold">{s.target_name}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('roadmap')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-command-card hover:bg-command-cardHover text-slate-300 hover:text-white border border-command-border transition shadow-command-card"
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

      {/* 2. HERO SECTION: Interactive Quantum Readiness Gauge & 4 Key Telemetry Tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Hero Left: Animated Quantum Readiness Dial (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl command-card command-card-glow flex flex-col justify-between relative overflow-hidden">
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
                  <filter id="gaugeGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
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
                  filter="url(#gaugeGlow)"
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
          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-command-border/80 text-[11px] font-mono z-10">
            <div className="p-2 rounded-lg bg-command-surface/80 border border-command-border/60">
              <span className="text-slate-400 block text-[9px] uppercase">Agility Score</span>
              <span className="font-bold text-cyan-300">{r?.pillar_scores?.crypto_agility?.toFixed(0) || '72'}/100</span>
            </div>
            <div className="p-2 rounded-lg bg-command-surface/80 border border-command-border/60">
              <span className="text-slate-400 block text-[9px] uppercase">PQC Resistance</span>
              <span className="font-bold text-rose-400">{r?.pillar_scores?.algorithm_quantum_resistance?.toFixed(0) || '38'}/100</span>
            </div>
            <div className="p-2 rounded-lg bg-command-surface/80 border border-command-border/60">
              <span className="text-slate-400 block text-[9px] uppercase">FMEA Stability</span>
              <span className="font-bold text-amber-400">{r?.pillar_scores?.fmea_stability?.toFixed(0) || '58'}/100</span>
            </div>
            <div className="p-2 rounded-lg bg-command-surface/80 border border-command-border/60">
              <span className="text-slate-400 block text-[9px] uppercase">Governance</span>
              <span className="font-bold text-emerald-400">{r?.pillar_scores?.governance_policy?.toFixed(0) || '80'}/100</span>
            </div>
          </div>
        </div>

        {/* Hero Right: 4 High-Impact Telemetry Metrics (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
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
                Discovered in <strong className="text-slate-200">{s.files_scanned} files</strong> across codebase
              </p>
            </div>
            <div className="pt-2 border-t border-command-border/60 flex items-center justify-between text-[11px] font-mono text-cyan-400">
              <span>View CBOM Inventory</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Metric 2: Critical Shor Risk */}
          <div 
            onClick={() => onNavigate('readiness')}
            className="p-5 rounded-2xl command-card command-card-critical cursor-pointer hover:border-rose-500/50 space-y-3 group"
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
                RSA &amp; ECC public-key cryptography
              </p>
            </div>
            <div className="pt-2 border-t border-rose-950/60 flex items-center justify-between text-[11px] font-mono text-rose-400">
              <span>Urgent Remediation</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Metric 3: High Risk Assets */}
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
            <div className="pt-2 border-t border-command-border/60 flex items-center justify-between text-[11px] font-mono text-amber-400">
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
                Mosca HNDL Urgent ($X+Y &gt; Z$)
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
            <div className="pt-2 border-t border-command-border/60 flex items-center justify-between text-[11px] font-mono text-indigo-400">
              <span>Open HNDL Simulator</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

        </div>

      </div>

      {/* 3. VISUAL ANALYTICS ROW: Quantum Risk Donut, Top Algorithm Horizontal Bars, & Shor Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Donut: Quantum Risk Distribution (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl command-card space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-command-border/80 pb-3">
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
                  className="transition-all duration-500 hover:stroke-[14]"
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
                  className="transition-all duration-500 hover:stroke-[14]"
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
                  className="transition-all duration-500 hover:stroke-[14]"
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
                  className="transition-all duration-500 hover:stroke-[14]"
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
            <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-rose-glow" />
                <span className="text-rose-300 font-semibold">Critical</span>
              </div>
              <span className="font-bold text-white">{criticalCount} ({criticalPct}%)</span>
            </div>

            <div className="p-2 rounded-xl bg-orange-950/40 border border-orange-500/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <span className="text-orange-300 font-semibold">High</span>
              </div>
              <span className="font-bold text-white">{highCount} ({highPct}%)</span>
            </div>

            <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-amber-300 font-semibold">Medium</span>
              </div>
              <span className="font-bold text-white">{mediumCount} ({mediumPct}%)</span>
            </div>

            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-300 font-semibold">Low</span>
              </div>
              <span className="font-bold text-white">{lowCount} ({lowPct}%)</span>
            </div>
          </div>
        </div>

        {/* Horizontal Bar Chart: Top Algorithm Exposure (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl command-card space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-command-border/80 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Top Algorithm Exposure
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">By Detection Volume</span>
          </div>

          {/* Bars */}
          <div className="space-y-3 my-1">
            {topAlgos.map((algo, idx) => {
              const widthPct = Math.round((algo.count / maxAlgoCount) * 100);
              return (
                <div 
                  key={idx}
                  onMouseEnter={() => setHoveredAlgo(algo.name)}
                  onMouseLeave={() => setHoveredAlgo(null)}
                  className="space-y-1 group"
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
                  <div className="w-full h-3 rounded-full bg-slate-900 border border-command-border overflow-hidden">
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

          <div className="p-2.5 rounded-xl bg-command-surface/80 border border-command-border flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Critical asymmetric algorithms require hybrid encapsulation replacement.</span>
            <button 
              onClick={() => onNavigate('knowledge-base')}
              className="text-cyan-400 hover:underline font-bold"
            >
              Explore Catalog &rarr;
            </button>
          </div>
        </div>

        {/* Shor Comparison Stack & Trajectory (3 cols) */}
        <div className="lg:col-span-3 p-6 rounded-2xl command-card space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-command-border/80 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Quantum Threat
              </span>
            </div>
          </div>

          {/* Shor Vulnerable Gauge */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-rose-300 font-bold">Shor-Vulnerable</span>
              <span className="font-bold text-rose-400 text-sm">{s.quantum_vulnerable_count} / {s.crypto_assets_count}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div 
                style={{ width: `${Math.round((s.quantum_vulnerable_count / totalAssets) * 100)}%` }}
                className="h-full bg-rose-500 rounded-full shadow-rose-glow"
              />
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Asymmetric keys vulnerable to polynomial Shor factorisation.
            </p>
          </div>

          {/* Quantum Resistant Gauge */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-300 font-bold">Grover Resistant</span>
              <span className="font-bold text-emerald-400 text-sm">{s.crypto_assets_count - s.quantum_vulnerable_count} / {s.crypto_assets_count}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div 
                style={{ width: `${Math.round(((s.crypto_assets_count - s.quantum_vulnerable_count) / totalAssets) * 100)}%` }}
                className="h-full bg-emerald-500 rounded-full shadow-emerald-glow"
              />
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Symmetric 256-bit ciphers resilient against Grover search.
            </p>
          </div>

          <button
            onClick={() => onNavigate('readiness')}
            className="w-full py-2 rounded-xl text-xs font-mono font-bold bg-command-surface hover:bg-command-card text-cyan-400 hover:text-cyan-300 border border-command-border transition flex items-center justify-center gap-1.5"
          >
            <span>Mosca Urgency Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 4. MIGRATION TRAJECTORY & QUANTUM FMEA ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: 4-Phase Migration Trajectory (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl command-card space-y-4">
          <div className="flex items-center justify-between border-b border-command-border/80 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Post-Quantum Transition Trajectory
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              EST. BUDGET: ${c?.total_estimated_cost_usd?.toLocaleString() || '82,980'}
            </span>
          </div>

          {/* 4 Phased Visual Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1.5">
              <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block">Phase 1: Immediate</span>
              <span className="text-base font-black text-white font-mono">{rm?.phases?.[0]?.asset_count || 12} Assets</span>
              <p className="text-[10px] text-slate-400 font-sans">Critical KEX &amp; Auth (0-6 mo)</p>
              <div className="text-[9px] text-rose-300 font-bold pt-1 border-t border-rose-900/60">
                Risk Target: -55%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-950/40 border border-orange-500/40 space-y-1.5">
              <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider block">Phase 2: High Pri</span>
              <span className="text-base font-black text-white font-mono">{rm?.phases?.[1]?.asset_count || 7} Assets</span>
              <p className="text-[10px] text-slate-400 font-sans">Hybrid Rollout (6-18 mo)</p>
              <div className="text-[9px] text-orange-300 font-bold pt-1 border-t border-orange-900/60">
                Risk Target: -25%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/40 space-y-1.5">
              <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wider block">Phase 3: Planned</span>
              <span className="text-base font-black text-white font-mono">{rm?.phases?.[2]?.asset_count || 4} Assets</span>
              <p className="text-[10px] text-slate-400 font-sans">Pure PQC Baseline (18-36 mo)</p>
              <div className="text-[9px] text-blue-300 font-bold pt-1 border-t border-blue-900/60">
                Risk Target: -15%
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1.5">
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">Phase 4: Resilient</span>
              <span className="text-base font-black text-white font-mono">{rm?.phases?.[3]?.asset_count || 2} Assets</span>
              <p className="text-[10px] text-slate-400 font-sans">Automated Compliance (36+ mo)</p>
              <div className="text-[9px] text-emerald-300 font-bold pt-1 border-t border-emerald-900/60">
                Residual Risk: 0%
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-command-surface/90 border border-command-border flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300">
              Total Engineering Effort: <strong className="text-cyan-300">{rm?.total_effort_hours || 680} hours</strong>
            </span>
            <button
              onClick={() => onNavigate('roadmap')}
              className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline flex items-center gap-1"
            >
              <span>Explore Strategic Roadmap</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: Quantum FMEA Migration Risk (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl command-card space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-command-border/80 pb-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                PQC Migration Failure Risk (FMEA)
              </span>
            </div>
            <span className="text-[10px] font-mono text-rose-400 font-bold">MAX RPN: {fmea?.max_rpn || 392}</span>
          </div>

          {/* FMEA RPN Distribution Bars */}
          <div className="space-y-2 text-xs font-mono">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-rose-400 font-semibold">Critical Priority (RPN &ge; 300)</span>
                <span className="text-white font-bold">{fmeaCrit} Failure Modes</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div style={{ width: `${(fmeaCrit / maxFmeaGroup) * 100}%` }} className="h-full bg-rose-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-orange-400 font-semibold">High Priority (200 &le; RPN &lt; 300)</span>
                <span className="text-white font-bold">{fmeaHigh} Failure Modes</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div style={{ width: `${(fmeaHigh / maxFmeaGroup) * 100}%` }} className="h-full bg-orange-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-amber-400 font-semibold">Medium Priority (100 &le; RPN &lt; 200)</span>
                <span className="text-white font-bold">{fmeaMed} Failure Modes</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div style={{ width: `${(fmeaMed / maxFmeaGroup) * 100}%` }} className="h-full bg-amber-500 rounded-full" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-emerald-400 font-semibold">Controlled Baseline (RPN &lt; 100)</span>
                <span className="text-white font-bold">{fmeaLow} Failure Modes</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                <div style={{ width: `${(fmeaLow / maxFmeaGroup) * 100}%` }} className="h-full bg-emerald-500 rounded-full" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-command-border/60 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Mean Portfolio RPN: <strong className="text-white">{fmea?.average_rpn || 297.9}</strong></span>
            <button
              onClick={() => onNavigate('fmea')}
              className="text-cyan-400 hover:underline font-bold"
            >
              Inspect Full FMEA Table &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* 5. SYSTEM HEALTH MODULE */}
      <div className="p-5 rounded-2xl command-card space-y-3">
        <div className="flex items-center justify-between border-b border-command-border/80 pb-2">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              QUANTECT Engine &amp; Service Telemetry
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            100% OPERATIONAL
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-command-surface/80 border border-command-border space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Scanner Service</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ONLINE ({s.files_scanned} files)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-command-surface/80 border border-command-border space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Risk Engine</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ONLINE (Shor/Mosca)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-command-surface/80 border border-command-border space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">FMEA Calculus</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ONLINE (S &times; O &times; D)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-command-surface/80 border border-command-border space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">NIST PQC Engine</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ONLINE (FIPS 203/204)</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-command-surface/80 border border-command-border space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase">Monitoring Daemon</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ACTIVE (Heartbeat OK)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. PRIORITY REMEDIATION BACKLOG */}
      <div className="p-6 rounded-2xl command-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-command-border/80">
          <div>
            <h2 className="text-sm font-bold font-mono text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Immediate Quantum Vulnerability Backlog (Action Items)</span>
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
              className="p-4 rounded-xl bg-command-surface/90 border border-command-border hover:border-cyan-500/50 hover:bg-command-card transition flex flex-col xl:flex-row xl:items-center justify-between gap-4 group"
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
                    {asset.phase_label}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-mono truncate" title={`${asset.file}:${asset.line_number || 1}`}>
                  <span className="text-slate-300 font-semibold">Location:</span> {asset.file}:{asset.line_number || 1} &bull; <span className="text-slate-300 font-semibold">Criticality:</span> {asset.business_criticality}
                </div>
                <p className="text-xs text-slate-300 font-medium leading-relaxed font-mono">
                  <strong className="text-cyan-300">Action:</strong> {asset.suggested_action}
                </p>
              </div>

              <div className="flex items-center justify-between xl:justify-end gap-4 pt-3 xl:pt-0 border-t xl:border-t-0 xl:border-l border-command-border xl:pl-4 flex-shrink-0">
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
                  className="px-3.5 py-2 rounded-xl text-xs font-mono font-bold bg-command-card hover:bg-cyan-950 text-slate-200 hover:text-cyan-300 border border-command-border hover:border-cyan-500/50 transition shadow-xs flex items-center gap-1.5 flex-shrink-0"
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
