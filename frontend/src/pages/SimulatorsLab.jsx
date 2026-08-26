import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Activity, 
  Clock, 
  DollarSign, 
  Zap, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles,
  Layers,
  Cpu,
  Wifi,
  HardDrive,
  RefreshCw,
  Info
} from 'lucide-react';
import { fetchLatencyImpact, simulateMosca, simulateCostEstimate } from '../services/api';

export default function SimulatorsLab({ cbomReport, onUpdateCBOM }) {
  const [activeTab, setActiveTab] = useState('latency'); // 'latency' | 'hndl' | 'cost'

  // --- LATENCY SIMULATOR STATE ---
  const [classicalAlgo, setClassicalAlgo] = useState('RSA-2048');
  const [targetPqc, setTargetPqc] = useState('ML-KEM-768');
  const [latencyData, setLatencyData] = useState(null);
  const [latencyLoading, setLatencyLoading] = useState(false);

  // --- HNDL SIMULATOR STATE ---
  const [xDataLifetime, setXDataLifetime] = useState(15.0);
  const [yMigrationTime, setYMigrationTime] = useState(5.0);
  const [zQuantumTimeline, setZQuantumTimeline] = useState(15.0);
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
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
          <Sliders className="w-6 h-6 text-sky-400" />
          <span>Interactive Simulators & Intelligence Lab</span>
        </h1>
        <p className="text-xs text-slate-400">
          Simulate computational latency and bandwidth overhead, test Harvest-Now-Decrypt-Later (HNDL) exposure timelines, and configure financial migration budgets.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold max-w-md">
        <button
          onClick={() => setActiveTab('latency')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'latency'
              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-sky-400" />
          <span>Latency & Bandwidth</span>
        </button>

        <button
          onClick={() => setActiveTab('hndl')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'hndl'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-indigo-400" />
          <span>HNDL Timeline</span>
        </button>

        <button
          onClick={() => setActiveTab('cost')}
          className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-2 ${
            activeTab === 'cost'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          <span>Cost Configurator</span>
        </button>
      </div>

      {/* 1. LATENCY & BANDWIDTH IMPACT SIMULATOR */}
      {activeTab === 'latency' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-400" />
                  <span>Algorithm Performance & Transmission Overhead Simulator</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Select a classical algorithm and target PQC standard to simulate relative latency, public key/signature sizes, and CPU cycle impacts.
                </p>
              </div>
            </div>

            {/* Algorithm Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-slate-400">Current Classical Algorithm</label>
                <select
                  value={classicalAlgo}
                  onChange={(e) => setClassicalAlgo(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-sky-500 focus:outline-none"
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
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:border-sky-500 focus:outline-none"
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
              {/* Summary KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono">Overall Handshake Latency</span>
                  <div className="text-xl font-bold text-sky-400">{latencyData.overall_latency_impact}</div>
                  <span className="text-[10px] text-slate-500">Under 2ms WAN delta</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono">Bandwidth Overhead</span>
                  <div className="text-xl font-bold text-amber-400 truncate">{latencyData.bandwidth_overhead.split(',')[0]}</div>
                  <span className="text-[10px] text-slate-500">Public key & ciphertext</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono">CPU Execution Efficiency</span>
                  <div className="text-xl font-bold text-emerald-400">FASTER</div>
                  <span className="text-[10px] text-slate-500">Matrix NTT vs BigInt Pow</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-400 font-mono">Memory State Footprint</span>
                  <div className="text-xl font-bold text-indigo-400">{latencyData.memory_impact}</div>
                  <span className="text-[10px] text-slate-500">Working buffer memory</span>
                </div>
              </div>

              {/* Metric Item Table */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-slate-200">
                  Detailed Cryptographic Parameter & Metric Comparison
                </h3>

                <div className="space-y-3">
                  {latencyData.metrics.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-200">{m.metric_name}</span>
                        <p className="text-[11px] text-slate-400">{m.details}</p>
                      </div>

                      <div className="flex items-center gap-4 font-mono text-xs flex-shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block">Classical</span>
                          <span className="text-slate-300 font-bold">{m.classical_value}</span>
                        </div>
                        <span className="text-slate-600">&rarr;</span>
                        <div>
                          <span className="text-[10px] text-slate-500 block">Target PQC</span>
                          <span className="text-sky-400 font-bold">{m.pqc_value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/30 text-xs text-sky-300 leading-relaxed space-y-1">
                  <span className="font-bold font-mono text-[11px] uppercase tracking-wider block text-sky-400">
                    Architectural Trade-off Analysis:
                  </span>
                  <p>{latencyData.tradeoff_explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. HNDL & MOSCA TIMELINE SIMULATOR */}
      {activeTab === 'hndl' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Mosca Theorem & Harvest-Now-Decrypt-Later (HNDL) Timeline Simulator</span>
              </h2>
              <p className="text-xs text-slate-400">
                Evaluate whether adversaries intercepting encrypted data today will be able to decrypt it with quantum computers before data confidentiality expires (<span className="font-mono text-sky-400 font-bold">X + Y &gt; Z</span>).
              </p>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Data Lifetime (X)</span>
                  <span className="font-bold text-sky-400">{xDataLifetime} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={xDataLifetime}
                  onChange={(e) => setXDataLifetime(parseFloat(e.target.value))}
                  className="w-full accent-sky-400"
                />
                <span className="text-[10px] text-slate-500">Years data must remain secret</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-mono">
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
                  className="w-full accent-indigo-400"
                />
                <span className="text-[10px] text-slate-500">Years to transition to PQC</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">CRQC Arrival Horizon (Z)</span>
                  <span className="font-bold text-purple-400">{zQuantumTimeline} Years</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={zQuantumTimeline}
                  onChange={(e) => setZQuantumTimeline(parseFloat(e.target.value))}
                  className="w-full accent-purple-400"
                />
                <span className="text-[10px] text-slate-500">Years until CRQC deployment</span>
              </div>
            </div>

            {/* Visual Timeline Bar */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex justify-between text-xs font-mono font-bold text-slate-400">
                <span>TODAY (Year 0)</span>
                <span>MIGRATION DONE (Year {yMigrationTime})</span>
                <span>DATA EXPIRED (Year {xDataLifetime})</span>
                <span className="text-purple-400">CRQC ARRIVAL (Year {zQuantumTimeline})</span>
              </div>

              {/* Visual Multi-Segment Timeline */}
              <div className="relative h-6 bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex">
                <div 
                  className="bg-indigo-600/80 h-full flex items-center justify-center text-[10px] font-bold text-white font-mono"
                  style={{ width: `${Math.min(100, (yMigrationTime / 35) * 100)}%` }}
                  title={`Migration Window: ${yMigrationTime} years`}
                >
                  Y ({yMigrationTime}y)
                </div>
                <div 
                  className="bg-sky-600/60 h-full flex items-center justify-center text-[10px] font-bold text-white font-mono"
                  style={{ width: `${Math.min(100, ((xDataLifetime - yMigrationTime > 0 ? xDataLifetime - yMigrationTime : xDataLifetime) / 35) * 100)}%` }}
                  title={`Data Lifetime: ${xDataLifetime} years`}
                >
                  X ({xDataLifetime}y)
                </div>
              </div>

              {/* Status Alert Banner */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
                isUrgent 
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              }`}>
                {isUrgent ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold text-sm mb-1">
                    {isUrgent ? `CRITICAL HNDL EXPOSURE: ${hndlExposureYears} Year Risk Window` : 'SECURE MOSCA TIMELINE'}
                  </div>
                  <p>
                    {isUrgent 
                      ? `Because X + Y (${xDataLifetime + yMigrationTime} years) exceeds Z (${zQuantumTimeline} years), encrypted traffic recorded by threat actors today will be decrypted using quantum computers while the data still requires confidentiality.`
                      : `Your data lifetime and migration timeframe (X + Y = ${xDataLifetime + yMigrationTime} years) are safely within the expected CRQC arrival window (${zQuantumTimeline} years).`}
                  </p>
                </div>
              </div>
            </div>

            {/* Recalculate Button */}
            <div className="flex justify-end">
              <button
                onClick={handleRecalculateMosca}
                disabled={hndlRecalculating}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 flex items-center gap-2 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${hndlRecalculating ? 'animate-spin' : ''}`} />
                <span>Apply Scenario to Full CBOM Inventory</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MIGRATION COST & EFFORT CONFIGURATOR */}
      {activeTab === 'cost' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="space-y-1">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Migration Cost & Engineering Effort Configurator</span>
              </h2>
              <p className="text-xs text-slate-400">
                Transparent and configurable estimation model. Adjust hourly billing rates and infrastructure multipliers to calculate exact portfolio migration budgets.
              </p>
            </div>

            {/* Input Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono">
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
                  className="w-full accent-emerald-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">QA / Security Testing Rate</span>
                  <span className="font-bold text-sky-400">${qaRate}/hr</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={qaRate}
                  onChange={(e) => setQaRate(parseFloat(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-mono">
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
                  className="w-full accent-indigo-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Complexity Multiplier</span>
                  <span className="font-bold text-purple-400">{complexityMult}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.1"
                  value={complexityMult}
                  onChange={(e) => setComplexityMult(parseFloat(e.target.value))}
                  className="w-full accent-purple-400"
                />
              </div>
            </div>

            {/* Recalculate Button */}
            <div className="flex justify-end">
              <button
                onClick={handleRecalculateCost}
                disabled={costLoading}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 flex items-center gap-2 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${costLoading ? 'animate-spin' : ''}`} />
                <span>Recalculate Portfolio Budget</span>
              </button>
            </div>

            {/* Cost Results Output */}
            {costResult && (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-500 font-mono">Total Engineering</span>
                  <div className="text-xl font-bold text-slate-100">{costResult.total_engineering_hours} hrs</div>
                  <span className="text-[11px] text-emerald-400 font-mono">${costResult.engineering_cost_usd.toLocaleString()}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-500 font-mono">Testing & Verification</span>
                  <div className="text-xl font-bold text-slate-100">{costResult.total_testing_hours} hrs</div>
                  <span className="text-[11px] text-sky-400 font-mono">${costResult.testing_cost_usd.toLocaleString()}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[11px] text-slate-500 font-mono">Infrastructure / PKI</span>
                  <div className="text-xl font-bold text-slate-100">${costResult.infrastructure_cost_usd.toLocaleString()}</div>
                  <span className="text-[11px] text-slate-400">Cloud / Certificate setup</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-1 bg-gradient-to-br from-emerald-950/20 to-slate-950">
                  <span className="text-[11px] text-emerald-400 font-mono font-bold">TOTAL ESTIMATED BUDGET</span>
                  <div className="text-2xl font-black text-emerald-300">${costResult.total_estimated_cost_usd.toLocaleString()}</div>
                  <span className="text-[10px] text-slate-400 font-mono">Tier: {costResult.cost_tier}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
