import React, { useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  Sliders, 
  TrendingDown, 
  BarChart2, 
  PieChart as PieIcon, 
  Layers, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function DynamicMigrationCostEngine({ visualData, onParamsChange }) {
  const [devRate, setDevRate] = useState(120.0);
  const [qaRate, setQaRate] = useState(90.0);
  const [infraCost, setInfraCost] = useState(500.0);
  const [complexityMult, setComplexityMult] = useState(1.0);
  const [activeView, setActiveView] = useState('bars'); // 'bars' | 'roi'
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  if (!visualData || !visualData.costEngineData) {
    return (
      <div className="p-8 text-center text-slate-400 command-card">
        <DollarSign className="w-10 h-10 text-emerald-500/50 mx-auto mb-3 animate-pulse" />
        <h4 className="text-base font-bold text-white mb-1">No Cost Data Available</h4>
        <p className="text-xs text-slate-400">Perform a cryptographic scan to generate the dynamic migration cost engine.</p>
      </div>
    );
  }

  const { costEngineData } = visualData;
  const { categories, riskVsCostPoints, totalEstimatedCostUSD, totalEngineeringHours, developerHours, qaHours, engineeringCostUSD, testingCostUSD, infrastructureCostUSD } = costEngineData;

  const handleSliderChange = (type, val) => {
    let newDev = devRate;
    let newQa = qaRate;
    let newInfra = infraCost;
    let newMult = complexityMult;

    if (type === 'dev') {
      newDev = val;
      setDevRate(val);
    } else if (type === 'qa') {
      newQa = val;
      setQaRate(val);
    } else if (type === 'infra') {
      newInfra = val;
      setInfraCost(val);
    } else if (type === 'mult') {
      newMult = val;
      setComplexityMult(val);
    }

    if (onParamsChange) {
      onParamsChange({
        devRate: newDev,
        qaRate: newQa,
        infraCost: newInfra,
        complexityMult: newMult
      });
    }
  };

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || null;

  return (
    <div className="space-y-6">
      
      {/* Visual Header & Budget Metric Tiles */}
      <div className="command-card p-6 border-emerald-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded">
                SIGNATURE VISUALIZATION 3
              </span>
              <span className="text-[10px] font-mono text-cyan-400 border border-cyan-800/40 bg-cyan-950/50 px-2 py-0.5 rounded">
                DYNAMIC FINANCIAL FORECASTING
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <DollarSign className="w-6 h-6 text-emerald-400" />
              <span>Migration Cost Engine</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              Real-time parametric financial modeling, effort distribution across 7 lifecycle categories, and risk reduction ROI curve.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-lg bg-[#070D1E] border border-emerald-500/40 text-right shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Total Estimated Cost</div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                ${totalEstimatedCostUSD.toLocaleString()}
              </div>
            </div>
            <div className="px-4 py-2.5 rounded-lg bg-[#070D1E] border border-cyan-500/40 text-right shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Total Engineering Effort</div>
              <div className="text-xl font-bold font-mono text-cyan-400">
                {totalEngineeringHours}h
              </div>
            </div>
          </div>
        </div>

        {/* Financial Sub-Totals */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#1E2D4A]/60 font-mono text-xs">
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A]">
            <span className="text-[10px] text-slate-400 uppercase">Development Effort</span>
            <div className="text-sm font-bold text-white mt-0.5">{developerHours} Hours</div>
            <div className="text-[10px] text-cyan-400">${engineeringCostUSD.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A]">
            <span className="text-[10px] text-slate-400 uppercase">QA &amp; KAT Testing</span>
            <div className="text-sm font-bold text-white mt-0.5">{qaHours} Hours</div>
            <div className="text-[10px] text-amber-400">${testingCostUSD.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A]">
            <span className="text-[10px] text-slate-400 uppercase">Infrastructure &amp; KMS</span>
            <div className="text-sm font-bold text-white mt-0.5">${infrastructureCostUSD.toLocaleString()}</div>
            <div className="text-[10px] text-purple-400">Cloud HSM &amp; PKI Root</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#070D1E] border border-[#1E2D4A]">
            <span className="text-[10px] text-slate-400 uppercase">Cost Efficiency</span>
            <div className="text-sm font-bold text-emerald-400 mt-0.5">Automated CI/CD</div>
            <div className="text-[10px] text-slate-400">-30% vs Manual Refactor</div>
          </div>
        </div>
      </div>

      {/* Interactive Parametric Sliders Bar */}
      <div className="command-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>INTERACTIVE FINANCIAL PARAMETERS &amp; MULTIPLIERS</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            Slide to simulate instant budget &amp; labor variances
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Dev Rate Slider */}
          <div className="p-3.5 rounded-xl bg-[#070D1E] border border-[#1E2D4A] space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Dev Hourly Rate:</span>
              <span className="text-cyan-400 font-bold">${devRate}/h</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              step="5"
              value={devRate}
              onChange={(e) => handleSliderChange('dev', parseFloat(e.target.value))}
              className="w-full accent-cyan-400 bg-[#050A14] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>$50/h</span>
              <span>$250/h</span>
            </div>
          </div>

          {/* QA Rate Slider */}
          <div className="p-3.5 rounded-xl bg-[#070D1E] border border-[#1E2D4A] space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">QA Testing Rate:</span>
              <span className="text-amber-400 font-bold">${qaRate}/h</span>
            </div>
            <input
              type="range"
              min="40"
              max="180"
              step="5"
              value={qaRate}
              onChange={(e) => handleSliderChange('qa', parseFloat(e.target.value))}
              className="w-full accent-amber-400 bg-[#050A14] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>$40/h</span>
              <span>$180/h</span>
            </div>
          </div>

          {/* Infra Cost Slider */}
          <div className="p-3.5 rounded-xl bg-[#070D1E] border border-[#1E2D4A] space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Infra Cost / Asset:</span>
              <span className="text-purple-400 font-bold">${infraCost}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={infraCost}
              onChange={(e) => handleSliderChange('infra', parseFloat(e.target.value))}
              className="w-full accent-purple-400 bg-[#050A14] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>$100</span>
              <span>$2,000</span>
            </div>
          </div>

          {/* Complexity Multiplier */}
          <div className="p-3.5 rounded-xl bg-[#070D1E] border border-[#1E2D4A] space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Complexity Multiplier:</span>
              <span className="text-emerald-400 font-bold">{complexityMult}&times;</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.5"
              step="0.1"
              value={complexityMult}
              onChange={(e) => handleSliderChange('mult', parseFloat(e.target.value))}
              className="w-full accent-emerald-400 bg-[#050A14] h-1.5 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-500">
              <span>0.5&times; (Simple)</span>
              <span>2.5&times; (Legacy)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 7 Lifecycle Categories Interactive Breakdown */}
      <div className="command-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>7-CATEGORY MIGRATION COST &amp; LABOR DISTRIBUTION</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('bars')}
              className={`px-3 py-1 rounded-md text-xs font-mono transition ${
                activeView === 'bars'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-[#070D1E] text-slate-400 border border-[#1E2D4A]'
              }`}
            >
              Category Breakdown
            </button>
            <button
              onClick={() => setActiveView('roi')}
              className={`px-3 py-1 rounded-md text-xs font-mono transition ${
                activeView === 'roi'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-[#070D1E] text-slate-400 border border-[#1E2D4A]'
              }`}
            >
              Risk vs Cost ROI Curve
            </button>
          </div>
        </div>

        {activeView === 'bars' ? (
          <div className="space-y-3">
            {categories.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;

              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(isSelected ? null : cat.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-[#0F2044] border-cyan-400 ring-1 ring-cyan-400/50'
                      : 'bg-[#080E1E] border-[#1E2D4A] hover:border-cyan-500/40 hover:bg-[#0B152A]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <strong className="text-white">{cat.name}</strong>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300">
                      <span>{cat.hours} Hours</span>
                      <strong className="text-emerald-400">${cat.cost.toLocaleString()}</strong>
                      <span className="text-[10px] font-bold text-slate-400 w-10 text-right">{cat.percentage}%</span>
                    </div>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full h-2 bg-[#050A14] rounded-full overflow-hidden border border-[#1E2D4A]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(4, cat.percentage * 2.5)}%`,
                        backgroundColor: cat.color
                      }}
                    />
                  </div>

                  {isSelected && (
                    <p className="mt-2.5 text-[11px] text-slate-400 font-mono leading-relaxed pt-2 border-t border-white/5">
                      {cat.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Risk Reduction vs Migration Cost Trajectory Curve */
          <div className="p-4.5 rounded-xl bg-[#070D1E] border border-emerald-500/30 space-y-4">
            <div className="text-xs font-mono text-slate-300">
              <strong className="text-emerald-400">Risk Reduction vs Investment Curve:</strong> Visualizes how phased capital expenditure directly drives unmitigated Shor exposure down to zero.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {riskVsCostPoints.map((pt, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#050A14] border border-[#1E2D4A] font-mono text-xs flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase">{pt.stage}</span>
                    <div className="text-sm font-bold text-white mt-1">${pt.investmentUSD.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400">Cumulative Spend</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#1E2D4A]">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">Risk Score:</span>
                      <span className={`font-bold ${pt.riskScore === 0 ? 'text-emerald-400' : pt.riskScore > 50 ? 'text-rose-400' : 'text-amber-400'}`}>
                        {pt.riskScore}/100
                      </span>
                    </div>
                    <div className="text-[9px] text-cyan-300 mt-0.5">{pt.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
