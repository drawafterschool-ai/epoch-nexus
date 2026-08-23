import React, { useState, useEffect } from 'react';
import { Factory, TrendingUp, AlertTriangle, Heart, DollarSign, Activity, Wind, Cpu, Sparkles } from 'lucide-react';

interface IndustrialCitySimProps {
  isRunning: boolean;
  testPassed: boolean;
}

export const IndustrialCitySim: React.FC<IndustrialCitySimProps> = ({ testPassed }) => {
  const [wage, setWage] = useState<number>(7.0);
  const [hours, setHours] = useState<number>(8.0);
  const [scrubberActive, setScrubberActive] = useState<boolean>(false);
  const lovelaceN = 4;
  const workers = 100;
  const capital = 1450;
  const [satisfaction, setSatisfaction] = useState<number>(85);
  const [strikeRisk, setStrikeRisk] = useState<number>(15);
  const [smogIndex, setSmogIndex] = useState<number>(28);

  useEffect(() => {
    // Dynamic calculation of satisfaction, strike risk, and smog
    let sat = 70;
    if (wage >= 6.0 && hours <= 8.0) {
      sat = Math.min(100, 70 + (wage - 5) * 5 + (8 - hours) * 4);
    } else if (hours > 9.0) {
      sat = Math.max(10, 70 - (hours - 8) * 8 - (6 - wage) * 4);
    }
    if (scrubberActive) {
      sat = Math.min(100, sat + 5);
    }

    const risk = Math.max(0, Math.round(100 - sat));
    const baseSmog = Math.round(workers * hours * 0.05);
    const calculatedSmog = scrubberActive ? Math.round(baseSmog * 0.4) : baseSmog;

    setSatisfaction(sat);
    setStrikeRisk(risk);
    setSmogIndex(calculatedSmog);
  }, [wage, hours, scrubberActive]);

  // Ada Lovelace Bernoulli sequence calculation: sum(k^2 for k in 1..n)
  const lovelaceTerms = Array.from({ length: lovelaceN }, (_, i) => {
    const n = i + 1;
    return (n * (n + 1) * (2 * n + 1)) / 6; // sum k^2
  });

  return (
    <div className="relative flex flex-col h-full bg-[#121826] rounded-lg border border-slate-800 overflow-hidden">
      {/* Simulation Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-semibold text-amber-400">
          <Factory className="w-4 h-4 text-amber-400" />
          <span>Victorian Manchester & Lovelace Analytical Engine Matrix</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <button
            onClick={() => setScrubberActive(!scrubberActive)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition flex items-center gap-1 ${
              scrubberActive
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3 h-3 text-cyan-400" />
            <span>{scrubberActive ? '1875 Scrubbers Active' : 'Install Smog Scrubbers'}</span>
          </button>
        </div>
      </div>

      <div className="relative flex-1 p-3 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
        {/* Visual Factory Landscape SVG */}
        <div className="bg-[#0b101b] rounded-md border border-slate-800 p-2 flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between mb-1">
            <span>STEAM DISTRICT & LOVELACE ENGINE</span>
            <span className={strikeRisk > 30 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
              {strikeRisk > 30 ? '⚠️ Strike Alert' : '✓ Operations Stable'}
            </span>
          </div>

          <svg viewBox="0 0 300 120" className="w-full h-28">
            {/* Sky with dynamic smog color */}
            <rect width="300" height="120" fill={smogIndex > 25 ? '#212638' : '#141d2e'} />

            {/* Factory Building 1 */}
            <rect x="15" y="45" width="65" height="75" fill="#334155" />
            <polygon points="15,45 47,28 80,45" fill="#475569" />
            {/* Smokestack 1 */}
            <rect x="68" y="10" width="10" height="35" fill="#1e293b" />
            {/* Dynamic Smoke particles */}
            <circle cx="73" cy="6" r={scrubberActive ? 3 : 7} fill="#64748b" opacity={scrubberActive ? 0.3 : 0.7} className="animate-pulse" />
            <circle cx="78" cy="2" r={scrubberActive ? 4 : 10} fill="#64748b" opacity={scrubberActive ? 0.2 : 0.5} className="animate-pulse" />

            {/* Factory Building 2 (Loom Mill) */}
            <rect x="95" y="38" width="85" height="82" fill="#1e293b" />
            {/* Windows */}
            {[0, 1, 2].map(row => (
              <g key={row}>
                {[0, 1, 2, 3].map(col => (
                  <rect
                    key={col}
                    x={105 + col * 17}
                    y={50 + row * 18}
                    width="9"
                    height="10"
                    fill={strikeRisk > 40 ? '#475569' : '#f59e0b'}
                    opacity="0.8"
                  />
                ))}
              </g>
            ))}

            {/* Lovelace Babbage Analytical Gear */}
            <g transform="translate(235, 60)">
              <circle cx="0" cy="0" r="24" fill="#d97706" />
              <circle cx="0" cy="0" r="15" fill="#0f172a" />
              <line x1="-24" y1="0" x2="24" y2="0" stroke="#fef3c7" strokeWidth="2.5" />
              <line x1="0" y1="-24" x2="0" y2="24" stroke="#fef3c7" strokeWidth="2.5" />
              <line x1="-17" y1="-17" x2="17" y2="17" stroke="#fef3c7" strokeWidth="2.5" />
              <line x1="-17" y1="17" x2="17" y2="-17" stroke="#fef3c7" strokeWidth="2.5" />
              <text x="0" y="3" fill="#fef3c7" fontSize="7" fontWeight="bold" textAnchor="middle">1843</text>
            </g>

            {/* Ground */}
            <rect x="0" y="115" width="300" height="5" fill="#0f172a" />
          </svg>

          {/* Real-time 4-Metric Bar */}
          <div className="grid grid-cols-4 gap-1.5 mt-2 pt-2 border-t border-slate-800 text-[9.5px]">
            <div className="bg-slate-900 p-1 rounded border border-slate-800">
              <span className="text-slate-400 flex items-center gap-0.5">
                <DollarSign className="w-2.5 h-2.5 text-amber-400" /> Capital
              </span>
              <span className="font-mono font-bold text-amber-300 text-[10.5px]">£{capital}</span>
            </div>
            <div className="bg-slate-900 p-1 rounded border border-slate-800">
              <span className="text-slate-400 flex items-center gap-0.5">
                <Activity className="w-2.5 h-2.5 text-emerald-400" /> Output
              </span>
              <span className="font-mono font-bold text-emerald-300 text-[10.5px]">
                {Math.round(workers * hours * 0.5)} u
              </span>
            </div>
            <div className="bg-slate-900 p-1 rounded border border-slate-800">
              <span className="text-slate-400 flex items-center gap-0.5">
                <Heart className="w-2.5 h-2.5 text-rose-400" /> Morale
              </span>
              <span className={`font-mono font-bold text-[10.5px] ${satisfaction > 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {satisfaction}%
              </span>
            </div>
            <div className="bg-slate-900 p-1 rounded border border-slate-800">
              <span className="text-slate-400 flex items-center gap-0.5">
                <Wind className="w-2.5 h-2.5 text-cyan-400" /> Smog
              </span>
              <span className={`font-mono font-bold text-[10.5px] ${smogIndex > 25 ? 'text-amber-400' : 'text-cyan-300'}`}>
                {smogIndex} AQI
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Controls & Lovelace Sequence Explorer */}
        <div className="bg-slate-900/60 rounded-md border border-slate-800 p-3 flex flex-col justify-between text-xs">
          <div>
            <div className="flex items-center justify-between text-amber-400 font-bold mb-2">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Economic & Lovelace Matrix</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">OOP Sim Instance</span>
            </div>

            {/* Wage & Hours Sliders */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-slate-950 p-2 rounded border border-slate-800 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Wage:</span>
                  <span className="font-mono font-bold text-amber-400">£{wage.toFixed(1)}/hr</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="0.5"
                  value={wage}
                  onChange={(e) => setWage(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800 space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Shift Length:</span>
                  <span className={`font-mono font-bold ${hours > 9 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {hours} hrs
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="14"
                  step="1"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>

            {/* Lovelace Sequence Term Explorer */}
            <div className="bg-slate-950 p-2 rounded border border-slate-800 mb-2">
              <div className="flex justify-between items-center text-[10px] mb-1">
                <span className="text-cyan-300 font-semibold flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> Ada Lovelace Analytical Sequence:
                </span>
                <span className="font-mono text-slate-400">B(n) = Σ k²</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-cyan-200">
                {lovelaceTerms.map((t, idx) => (
                  <span key={idx} className="bg-slate-900 px-1.5 py-0.5 rounded border border-cyan-900/60">
                    B_{idx+1}={t}
                  </span>
                ))}
              </div>
            </div>

            {/* Strike Gauge */}
            <div className="bg-slate-950 p-1.5 rounded border border-slate-800 space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-400 flex items-center gap-1">
                  <AlertTriangle className="w-2.5 h-2.5 text-rose-400" /> Strike Risk:
                </span>
                <span className={`font-mono font-bold ${strikeRisk > 30 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {strikeRisk}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    strikeRisk > 40 ? 'bg-rose-500' : strikeRisk > 20 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${strikeRisk}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 italic pt-1.5 border-t border-slate-800 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{testPassed ? "✓ Complete Track 3 Curriculum Pack verified." : "Implement methods in code editor..."}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
