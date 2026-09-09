import React, { useState } from 'react';
import { 
  Sliders, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw, 
  ArrowRight, 
  Zap,
  Calendar,
  Layers,
  Info
} from 'lucide-react';
import { simulateMosca } from '../services/api';

export default function MoscaLab({ cbomReport, onUpdateCBOM, onSelectAsset }) {
  const [xLifetime, setXLifetime] = useState(cbomReport?.metadata?.data_lifetime_years || 15.0);
  const [yMigration, setYMigration] = useState(cbomReport?.metadata?.migration_time_years || 5.0);
  const [zQuantum, setZQuantum] = useState(cbomReport?.metadata?.quantum_timeline_years || 17.0);
  const [isSimulating, setIsSimulating] = useState(false);

  const xPlusY = Math.round((xLifetime + yMigration) * 10) / 10;
  const isUrgent = xPlusY > zQuantum;
  const diff = Math.round(Math.abs(xPlusY - zQuantum) * 10) / 10;
  const hndlExposure = Math.max(0, Math.round((xLifetime - zQuantum) * 10) / 10);

  const presets = [
    {
      name: 'Banking & Financial Core',
      desc: '15-year wire transfer & credit ledger retention + 5-year migration time',
      x: 15.0,
      y: 5.0,
      z: 17.0
    },
    {
      name: 'Healthcare & Patient EHR',
      desc: '25-year medical confidentiality + 6-year health system migration',
      x: 25.0,
      y: 6.0,
      z: 15.0
    },
    {
      name: 'Standard Commercial SaaS',
      desc: '5-year operational data retention + 2-year agile microservice migration',
      x: 5.0,
      y: 2.0,
      z: 15.0
    },
    {
      name: 'Government Defense Systems',
      desc: '30-year classified secrets + 8-year defense procurement migration',
      x: 30.0,
      y: 8.0,
      z: 15.0
    }
  ];

  const applyPreset = (p) => {
    setXLifetime(p.x);
    setYMigration(p.y);
    setZQuantum(p.z);
  };

  const handleSimulate = async () => {
    if (!cbomReport?.assets) return;
    setIsSimulating(true);
    try {
      const res = await simulateMosca({
        x_data_lifetime: xLifetime,
        y_migration_time: yMigration,
        z_quantum_timeline: zQuantum,
        assets: cbomReport.assets
      });

      const updatedReport = {
        ...cbomReport,
        assets: res.assets,
        scan_summary: {
          ...cbomReport.scan_summary,
          mosca_urgent_count: res.mosca_urgent_count,
          average_risk_score: res.average_risk_score
        },
        metadata: {
          ...cbomReport.metadata,
          data_lifetime_years: xLifetime,
          migration_time_years: yMigration,
          quantum_timeline_years: zQuantum
        }
      };

      onUpdateCBOM(updatedReport);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto command-grid">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1E2D4A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              MATHEMATICAL URGENCY CALCULUS
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              X + Y &gt; Z MODELING
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Sliders className="w-6 h-6 text-amber-400" />
            <span>Mosca's Theorem Simulation Lab (X + Y &gt; Z)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate quantum urgency timelines dynamically to assess Harvest-Now-Decrypt-Later (HNDL) exposure windows and recalculate risk across all cryptographic assets.
          </p>
        </div>
      </div>

      {/* Formula & Urgency Indicator Hero */}
      <div className={`p-6 rounded-xl command-card border transition-all duration-300 ${
        isUrgent 
          ? 'border-rose-500/50 shadow-rose-glow' 
          : 'border-emerald-500/50 shadow-sm'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="space-y-2 md:col-span-2">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                isUrgent 
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {isUrgent ? 'URGENT: MIGRATION REQUIRED IMMEDIATELY' : 'SECURE TIMELINE BUFFER'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                X + Y = {xPlusY} yrs vs Z = {zQuantum} yrs
              </span>
            </div>

            <div className="text-3xl font-extrabold font-mono tracking-tight text-white">
              {xLifetime}y <span className="text-slate-500">+</span> {yMigration}y {' '}
              <span className={isUrgent ? 'text-rose-400' : 'text-emerald-400'}>
                {isUrgent ? '>' : '<'}
              </span>{' '}
              {zQuantum}y
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-sans">
              {isUrgent ? (
                <>
                  Total exposure <strong className="text-rose-400">{xPlusY} years</strong> exceeds the estimated quantum computer timeline (<strong className="text-indigo-300">{zQuantum} years</strong>) by <strong className="text-rose-400">{diff} years</strong>. 
                  Adversaries capturing network traffic today can store encrypted payloads and decrypt them before confidentiality requirements expire.
                </>
              ) : (
                <>
                  Safe timeline buffer remaining: <strong className="text-emerald-400">{diff} years</strong> before quantum threats reach parity with data lifetime and migration schedules.
                </>
              )}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#050A14] border border-[#1E2D4A] space-y-2 text-center font-mono">
            <div className="text-[10px] text-slate-400 uppercase">
              HNDL Decryption Window
            </div>
            <div className={`text-3xl font-black ${hndlExposure > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {hndlExposure} Years
            </div>
            <p className="text-[10px] text-slate-500 font-sans">
              {hndlExposure > 0 ? 'Duration data remains exposed post-CRQC' : 'Zero retroactive exposure'}
            </p>
          </div>

        </div>
      </div>

      {/* Interactive Sliders & Presets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sliders Panel */}
        <div className="lg:col-span-2 p-6 rounded-xl command-card space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#1E2D4A]">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Interactive Parameter Tuning
            </span>
            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition shadow-cyan-glow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Recalculate CBOM Risk</span>
            </button>
          </div>

          {/* Slider X */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-cyan-400">X : Data / Information Lifetime</span>
                <p className="text-[10px] text-slate-400 font-sans">Years data must remain confidential or signatures verified</p>
              </div>
              <span className="text-base font-bold text-cyan-400 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-500/30">
                {xLifetime} yrs
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="35"
              step="1"
              value={xLifetime}
              onChange={(e) => setXLifetime(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>1 yr (Ephemeral)</span>
              <span>15 yrs (Financial)</span>
              <span>35 yrs (National Sec)</span>
            </div>
          </div>

          {/* Slider Y */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-indigo-400">Y : Migration &amp; Deployment Time</span>
                <p className="text-[10px] text-slate-400 font-sans">Years to re-architect, test, deploy PQC, and rotate keys/certs</p>
              </div>
              <span className="text-base font-bold text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-500/30">
                {yMigration} yrs
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="15"
              step="0.5"
              value={yMigration}
              onChange={(e) => setYMigration(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-800 accent-indigo-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0.5 yr (Rapid API)</span>
              <span>5 yrs (Enterprise)</span>
              <span>15 yrs (Legacy HW)</span>
            </div>
          </div>

          {/* Slider Z */}
          <div className="space-y-2 font-mono text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-rose-400">Z : Quantum Threat Timeline</span>
                <p className="text-[10px] text-slate-400 font-sans">Estimated years until a Cryptographically Relevant Quantum Computer (CRQC)</p>
              </div>
              <span className="text-base font-bold text-rose-400 bg-rose-950/60 px-3 py-1 rounded-lg border border-rose-500/30">
                {zQuantum} yrs
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={zQuantum}
              onChange={(e) => setZQuantum(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg bg-slate-800 accent-rose-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>5 yrs (Aggressive)</span>
              <span>15-17 yrs (Consensus)</span>
              <span>30 yrs (Conservative)</span>
            </div>
          </div>
        </div>

        {/* Industry Presets Panel */}
        <div className="p-6 rounded-xl command-card space-y-4 font-mono text-xs">
          <span className="text-xs font-bold text-white uppercase block pb-2 border-b border-[#1E2D4A]">
            Industry Simulation Presets
          </span>

          <div className="space-y-3">
            {presets.map((p, idx) => (
              <div
                key={idx}
                onClick={() => applyPreset(p)}
                className="p-3 rounded-lg bg-[#050A14] hover:bg-[#0D1730] border border-[#1E2D4A] hover:border-cyan-500/50 cursor-pointer transition space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{p.name}</span>
                  <span className="text-[10px] text-cyan-400">
                    X:{p.x}y | Y:{p.y}y | Z:{p.z}y
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Affected CBOM Assets Table under this Simulation */}
      {cbomReport?.assets && (
        <div className="rounded-xl border border-[#1E2D4A] bg-[#080E1E] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#1E2D4A] flex items-center justify-between font-mono text-xs">
            <div>
              <h3 className="font-bold text-white uppercase">
                Asset Impact Evaluation under Simulation Parameters
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Sorted by simulated quantum vulnerability under X={xLifetime}y, Y={yMigration}y, Z={zQuantum}y
              </p>
            </div>
            <span className="text-cyan-400">
              {cbomReport.assets.length} Assets
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#050A14] text-slate-400 font-mono uppercase text-[11px] border-b border-[#1E2D4A]">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Algorithm</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Mosca Status</th>
                  <th className="p-3">Simulated Risk Score</th>
                  <th className="p-3">Target PQC Alternative</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2D4A]/40 font-mono text-xs">
                {cbomReport.assets.slice(0, 8).map((asset) => (
                  <tr
                    key={asset.asset_id}
                    onClick={() => onSelectAsset(asset)}
                    className="hover:bg-[#0D1730]/70 cursor-pointer transition border-b border-[#1E2D4A]/20"
                  >
                    <td className="p-3 font-bold text-cyan-400">
                      #{asset.migration_priority}
                    </td>
                    <td className="p-3 font-bold text-white">
                      {asset.algorithm} {asset.key_size ? `(${asset.key_size}b)` : ''}
                    </td>
                    <td className="p-3 text-cyan-300">
                      {asset.file}:{asset.line_number || 1}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        asset.mosca?.is_urgent 
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {asset.mosca?.urgency || 'STANDARD'}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-white">
                      {asset.risk_score} / 100
                    </td>
                    <td className="p-3 text-emerald-400">
                      {asset.recommended_pqc}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
