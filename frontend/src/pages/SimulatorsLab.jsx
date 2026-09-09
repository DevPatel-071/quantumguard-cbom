import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Clock, 
  DollarSign, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  BarChart2,
  PieChart as PieIcon,
  TrendingDown,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { fetchLatencyImpact, simulateMosca, simulateCostEstimate } from '../services/api';

export default function SimulatorsLab({ cbomReport, onUpdateCBOM }) {
  const [activeTab, setActiveTab] = useState('cost'); // 'cost' | 'latency' | 'hndl'

  // --- LATENCY SIMULATOR STATE ---
  const [classicalAlgo, setClassicalAlgo] = useState('RSA-2048');
  const [targetPqc, setTargetPqc] = useState('ML-KEM-768');
  const [latencyData, setLatencyData] = useState(null);
  const [latencyLoading, setLatencyLoading] = useState(false);

  // --- HNDL SIMULATOR STATE ---
  const [xDataLifetime, setXDataLifetime] = useState(12.0);
  const [yMigrationTime, setYMigrationTime] = useState(4.0);
  const [zQuantumTimeline, setZQuantumTimeline] = useState(10.0);
  const [hndlRecalculating, setHndlRecalculating] = useState(false);

  // --- COST ESTIMATOR STATE ---
  const [devRate, setDevRate] = useState(120.0);
  const [qaRate, setQaRate] = useState(90.0);
  const [infraCost, setInfraCost] = useState(500.0);
  const [complexityMult, setComplexityMult] = useState(1.0);
  const [costResult, setCostResult] = useState(cbomReport?.cost_summary || null);
  const [costLoading, setCostLoading] = useState(false);

  // Load initial latency benchmark
  useEffect(() => {
    runLatencyComparison(classicalAlgo, targetPqc);
  }, [classicalAlgo, targetPqc]);

  const runLatencyComparison = (cAlgo, tPqc) => {
    setLatencyLoading(true);
    fetchLatencyImpact(cAlgo, tPqc)
      .then((data) => {
        setLatencyData(data);
        setLatencyLoading(false);
      })
      .catch((err) => {
        console.error('Latency simulation error:', err);
        setLatencyLoading(false);
      });
  };

  const handleRecalculateMosca = () => {
    if (!cbomReport || !cbomReport.assets) return;
    setHndlRecalculating(true);
    simulateMosca({
      x_data_lifetime: xDataLifetime,
      y_migration_time: yMigrationTime,
      z_quantum_timeline: zQuantumTimeline,
      assets: cbomReport.assets
    })
      .then((res) => {
        const updated = {
          ...cbomReport,
          assets: res.assets,
          scan_summary: {
            ...cbomReport.scan_summary,
            mosca_urgent_count: res.mosca_urgent_count,
            average_risk_score: res.average_risk_score
          },
          readiness_assessment: res.readiness_assessment || cbomReport.readiness_assessment,
          roadmap_report: res.roadmap_report || cbomReport.roadmap_report,
          cost_summary: res.cost_summary || cbomReport.cost_summary
        };
        onUpdateCBOM(updated);
        setHndlRecalculating(false);
      })
      .catch((err) => {
        console.error('Recalculate error:', err);
        setHndlRecalculating(false);
      });
  };

  const handleRecalculateCost = () => {
    if (!cbomReport || !cbomReport.assets) return;
    setCostLoading(true);
    simulateCostEstimate({
      assets: cbomReport.assets,
      developer_hourly_rate: devRate,
      qa_testing_hourly_rate: qaRate,
      infra_cost_per_asset: infraCost,
      complexity_multiplier: complexityMult
    })
      .then((data) => {
        setCostResult(data);
        setCostLoading(false);
      })
      .catch((err) => {
        console.error('Cost calculation error:', err);
        setCostLoading(false);
      });
  };

  const isUrgent = (xDataLifetime + yMigrationTime) > zQuantumTimeline;
  const hndlExposureYears = isUrgent ? Math.round((xDataLifetime + yMigrationTime - zQuantumTimeline) * 10) / 10 : 0;

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto command-grid">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              DECISION LAB &amp; SIMULATION ENGINE
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              PREDICTIVE MODELING
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-cyan-400" />
            <span>Cost Estimator &amp; Decision Simulators</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure financial migration budgets, simulate computational latency &amp; bandwidth overhead, and test Mosca HNDL exposure timelines.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-xs font-mono">
          <button
            onClick={() => setActiveTab('cost')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'cost'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold shadow-cyan-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Cost & Effort</span>
          </button>

          <button
            onClick={() => setActiveTab('latency')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'latency'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold shadow-cyan-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Latency & Bandwidth</span>
          </button>

          <button
            onClick={() => setActiveTab('hndl')}
            className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
              activeTab === 'hndl'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 font-bold shadow-cyan-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Mosca / HNDL</span>
          </button>
        </div>
      </div>

      {/* 1. MIGRATION COST & EFFORT CONFIGURATOR */}
      {activeTab === 'cost' && (
        <div className="space-y-6">
          <div className="command-card p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Migration Cost &amp; Engineering Effort Configurator</span>
              </h2>
              <p className="text-xs text-slate-400">
                Transparent and configurable estimation model. Adjust hourly billing rates and infrastructure multipliers to calculate exact portfolio migration budgets.
              </p>
            </div>

            {/* Input Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-[#050A14] border border-[#1E2D4A] text-xs font-mono">
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Developer Rate</span>
                  <span className="font-bold text-emerald-400">${devRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="250"
                  step="10"
                  value={devRate}
                  onChange={(e) => setDevRate(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">QA / Security Testing</span>
                  <span className="font-bold text-cyan-400">${qaRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={qaRate}
                  onChange={(e) => setQaRate(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Infra / Asset</span>
                  <span className="font-bold text-indigo-400">${infraCost}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={infraCost}
                  onChange={(e) => setInfraCost(parseFloat(e.target.value))}
                  className="w-full accent-indigo-400 bg-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Complexity Multiplier</span>
                  <span className="font-bold text-amber-400">{complexityMult}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.1"
                  value={complexityMult}
                  onChange={(e) => setComplexityMult(parseFloat(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-800"
                />
              </div>
            </div>

            {/* Recalculate Button */}
            <div className="flex justify-end">
              <button
                onClick={handleRecalculateCost}
                disabled={costLoading}
                className="px-5 py-2 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black shadow-md flex items-center gap-2 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${costLoading ? 'animate-spin' : ''}`} />
                <span>Recalculate Portfolio Budget</span>
              </button>
            </div>

            {/* Cost Results Output & Breakdown Visual */}
            {costResult && (
              <div className="space-y-5 pt-2">
                {/* 4 Result Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-1 font-mono">
                    <span className="text-[10px] text-slate-400 uppercase">Engineering Effort</span>
                    <div className="text-xl font-bold text-white">{costResult.total_engineering_hours} hrs</div>
                    <span className="text-xs text-emerald-400 font-bold">${costResult.engineering_cost_usd?.toLocaleString()}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-1 font-mono">
                    <span className="text-[10px] text-slate-400 uppercase">QA &amp; Verification</span>
                    <div className="text-xl font-bold text-white">{costResult.total_testing_hours} hrs</div>
                    <span className="text-xs text-cyan-400 font-bold">${costResult.testing_cost_usd?.toLocaleString()}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-1 font-mono">
                    <span className="text-[10px] text-slate-400 uppercase">Infra &amp; PKI Setup</span>
                    <div className="text-xl font-bold text-white">${costResult.infrastructure_cost_usd?.toLocaleString()}</div>
                    <span className="text-[10px] text-slate-400">Certificates &amp; HSM</span>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 space-y-1 font-mono">
                    <span className="text-[10px] text-emerald-300 font-bold uppercase">TOTAL ESTIMATED BUDGET</span>
                    <div className="text-2xl font-black text-emerald-400">${costResult.total_estimated_cost_usd?.toLocaleString()}</div>
                    <span className="text-[10px] text-slate-300">Tier: {costResult.cost_tier}</span>
                  </div>
                </div>

                {/* Visual Cost vs Risk Reduction ROI Visualizer */}
                <div className="p-5 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        Investment vs Quantum Risk Reduction Trajectory
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400">98% Risk Elimination ROI</span>
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-center font-mono text-xs pt-1">
                    <div className="p-3 rounded-lg bg-[#080E1E] border border-rose-500/30">
                      <div className="text-[10px] text-rose-400">Phase 1 ($4.8k)</div>
                      <div className="text-base font-bold text-white mt-0.5">-55% Risk</div>
                      <div className="text-[9px] text-slate-500">Critical KEX & APIs</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#080E1E] border border-orange-500/30">
                      <div className="text-[10px] text-orange-400">Phase 2 ($3.2k)</div>
                      <div className="text-base font-bold text-white mt-0.5">-25% Risk</div>
                      <div className="text-[9px] text-slate-500">Hybrid Tokens & PKI</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#080E1E] border border-cyan-500/30">
                      <div className="text-[10px] text-cyan-400">Phase 3 ($2.4k)</div>
                      <div className="text-base font-bold text-white mt-0.5">-15% Risk</div>
                      <div className="text-[9px] text-slate-500">Storage & Batch</div>
                    </div>
                    <div className="p-3 rounded-lg bg-[#080E1E] border border-emerald-500/30">
                      <div className="text-[10px] text-emerald-400">Phase 4 ($1.0k)</div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">Zero Risk</div>
                      <div className="text-[9px] text-slate-500">Continuous Audit</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. LATENCY & BANDWIDTH IMPACT SIMULATOR */}
      {activeTab === 'latency' && (
        <div className="space-y-6">
          <div className="command-card p-6 space-y-5">
            <div className="space-y-1">
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Algorithm Performance &amp; Transmission Overhead Simulator</span>
              </h2>
              <p className="text-xs text-slate-400">
                Select a classical algorithm and target PQC standard to simulate relative latency, public key/signature sizes, and CPU cycle impacts.
              </p>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-400">Current Classical Algorithm</label>
                <select
                  value={classicalAlgo}
                  onChange={(e) => setClassicalAlgo(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="RSA-2048">RSA-2048 (Classical Asymmetric)</option>
                  <option value="ECDH P-256">ECDH P-256 (NIST Curve KEX)</option>
                  <option value="ECDSA P-256">ECDSA P-256 (NIST Curve Signature)</option>
                  <option value="RSA-4096">RSA-4096 (Extended Classical)</option>
                  <option value="AES-128">AES-128 (Symmetric Grover Half)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-400">Target PQC / Hybrid Standard</label>
                <select
                  value={targetPqc}
                  onChange={(e) => setTargetPqc(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#050A14] border border-[#1E2D4A] text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="ML-KEM-768">ML-KEM-768 (NIST FIPS 203 Lattice KEM)</option>
                  <option value="Hybrid X25519 + ML-KEM-768">Hybrid X25519 + ML-KEM-768 (IETF TLS 1.3)</option>
                  <option value="ML-DSA-65">ML-DSA-65 (NIST FIPS 204 Lattice DSA)</option>
                  <option value="SLH-DSA-128s">SLH-DSA-128s (NIST FIPS 205 Stateless Hash)</option>
                  <option value="Falcon-512">Falcon-512 (Compact NTRU Signature)</option>
                  <option value="AES-256">AES-256 (Post-Quantum Grover Margin)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Latency Results Cards */}
          {latencyData && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="command-card p-4 space-y-1 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase">Handshake Latency</span>
                  <div className="text-lg font-bold text-cyan-400">{latencyData.overall_latency_impact}</div>
                  <span className="text-[10px] text-slate-500">Under 2ms WAN delta</span>
                </div>

                <div className="command-card p-4 space-y-1 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase">Bandwidth Overhead</span>
                  <div className="text-lg font-bold text-amber-400 truncate">{latencyData.bandwidth_overhead?.split(',')[0]}</div>
                  <span className="text-[10px] text-slate-500">Public key &amp; ciphertext</span>
                </div>

                <div className="command-card p-4 space-y-1 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase">CPU Execution</span>
                  <div className="text-lg font-bold text-emerald-400">FASTER (NTT)</div>
                  <span className="text-[10px] text-slate-500">Matrix poly mult</span>
                </div>

                <div className="command-card p-4 space-y-1 font-mono">
                  <span className="text-[10px] text-slate-400 uppercase">Memory Footprint</span>
                  <div className="text-lg font-bold text-indigo-400">{latencyData.memory_impact}</div>
                  <span className="text-[10px] text-slate-500">Working buffer</span>
                </div>
              </div>

              {/* Metric Breakdown Table */}
              <div className="command-card p-6 space-y-4">
                <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
                  Detailed Parameter &amp; Size Breakdown
                </h3>

                <div className="space-y-2.5">
                  {latencyData.metrics?.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-white">{m.metric_name}</span>
                        <p className="text-[10px] text-slate-400 font-sans">{m.details}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs flex-shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block font-sans">Classical</span>
                          <span className="text-rose-400 font-bold">{m.classical_value}</span>
                        </div>
                        <span className="text-slate-600">&rarr;</span>
                        <div>
                          <span className="text-[10px] text-slate-500 block font-sans">Target PQC</span>
                          <span className="text-emerald-400 font-bold">{m.pqc_value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-lg bg-[#050A14] border border-cyan-500/30 text-xs text-slate-300 leading-relaxed space-y-1 font-mono">
                  <span className="font-bold text-[10px] text-cyan-400 uppercase tracking-wider block">
                    Architectural Analysis:
                  </span>
                  <p className="font-sans text-[11px]">{latencyData.tradeoff_explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. HNDL & MOSCA TIMELINE SIMULATOR */}
      {activeTab === 'hndl' && (
        <div className="space-y-6">
          <div className="command-card p-6 space-y-6">
            <div className="space-y-1">
              <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Mosca Theorem &amp; Harvest-Now-Decrypt-Later (HNDL) Timeline Simulator</span>
              </h2>
              <p className="text-xs text-slate-400">
                Evaluate whether adversaries intercepting encrypted data today will be able to decrypt it with quantum computers before data confidentiality expires (<span className="text-cyan-400 font-mono">X + Y &gt; Z</span>).
              </p>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-xl bg-[#050A14] border border-[#1E2D4A] text-xs font-mono">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Lifetime (X)</span>
                  <span className="font-bold text-cyan-400">{xDataLifetime} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={xDataLifetime}
                  onChange={(e) => setXDataLifetime(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Migration Time (Y)</span>
                  <span className="font-bold text-indigo-400">{yMigrationTime} Years</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="15"
                  step="0.5"
                  value={yMigrationTime}
                  onChange={(e) => setYMigrationTime(parseFloat(e.target.value))}
                  className="w-full accent-indigo-400 bg-slate-800"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">CRQC Horizon (Z)</span>
                  <span className="font-bold text-rose-400">{zQuantumTimeline} Years</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={zQuantumTimeline}
                  onChange={(e) => setZQuantumTimeline(parseFloat(e.target.value))}
                  className="w-full accent-rose-400 bg-slate-800"
                />
              </div>
            </div>

            {/* Visual Timeline Bar */}
            <div className="p-6 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-4 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>TODAY (0y)</span>
                <span>MIGRATION DONE ({yMigrationTime}y)</span>
                <span>DATA EXPIRED ({xDataLifetime}y)</span>
                <span className="text-rose-400 font-bold">CRQC ARRIVAL ({zQuantumTimeline}y)</span>
              </div>

              {/* Status Alert Banner */}
              <div className={`p-4 rounded-lg border text-xs leading-relaxed flex items-start gap-3 ${
                isUrgent 
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' 
                  : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              }`}>
                {isUrgent ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm mb-1 font-mono">
                    {isUrgent ? `CRITICAL HNDL EXPOSURE: ${hndlExposureYears} Year Risk Window` : 'SECURE MOSCA TIMELINE'}
                  </div>
                  <p className="font-sans text-[11px]">
                    {isUrgent 
                      ? `Because X + Y (${xDataLifetime + yMigrationTime} years) exceeds Z (${zQuantumTimeline} years), encrypted traffic recorded by adversaries today will be decrypted using quantum computers while data still requires secrecy.`
                      : `Your data lifetime and migration timeframe (X + Y = ${xDataLifetime + yMigrationTime} years) are safely within the expected CRQC horizon (${zQuantumTimeline} years).`}
                  </p>
                </div>
              </div>
            </div>

            {/* Recalculate Button */}
            <div className="flex justify-end">
              <button
                onClick={handleRecalculateMosca}
                disabled={hndlRecalculating}
                className="px-6 py-2.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-glow flex items-center gap-2 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${hndlRecalculating ? 'animate-spin' : ''}`} />
                <span>Apply Scenario to Full CBOM Inventory</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
