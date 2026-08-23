import React, { useState, useEffect } from 'react';
import { Sparkles, Shield, Cpu, Zap } from 'lucide-react';

interface DynamicCustomSimProps {
  title: string;
  era: string;
  civicsFocus: string;
  stemFocus: string;
  testPassed?: boolean;
}

export const DynamicCustomSim: React.FC<DynamicCustomSimProps> = ({
  title,
  era,
  civicsFocus,
  stemFocus,
  testPassed = false
}) => {
  const [metricA, setMetricA] = useState<number>(78);
  const [metricB, setMetricB] = useState<number>(92);
  const [equilibriumScore, setEquilibriumScore] = useState<number>(85);
  const [activeNode, setActiveNode] = useState<number>(1);
  const [shockActive, setShockActive] = useState<boolean>(false);

  useEffect(() => {
    if (testPassed) {
      setEquilibriumScore(98);
      setMetricA(95);
      setMetricB(96);
    }
  }, [testPassed]);

  const handleInjectShock = () => {
    setShockActive(true);
    setMetricA(prev => Math.max(20, prev - 25));
    setEquilibriumScore(prev => Math.max(30, prev - 20));
    setTimeout(() => {
      setShockActive(false);
      setMetricA(prev => Math.min(100, prev + 25));
      setEquilibriumScore(prev => Math.min(100, prev + 20));
    }, 3000);
  };

  return (
    <div className="relative flex flex-col h-full bg-[#101524] rounded-lg border border-slate-800 overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-semibold text-cyan-300 truncate">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
            {era}
          </span>
        </div>
      </div>

      <div className="relative flex-1 p-3 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
        {/* Dynamic Procedural Simulation Canvas */}
        <div className="bg-[#080c16] rounded-md border border-slate-800 p-2.5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1 z-10">
            <span>PROCEDURAL STATE MATRIX</span>
            <span className={testPassed ? "text-emerald-400 font-bold" : shockActive ? "text-rose-400 font-bold" : "text-cyan-400"}>
              {testPassed ? "✓ Solution Verified" : shockActive ? "⚠️ External Shock" : "● System Stable"}
            </span>
          </div>

          {/* Interactive Node Graph SVG */}
          <svg viewBox="0 0 300 130" className="w-full h-32 my-1">
            {/* Background Grid Lines */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="300" height="130" fill="url(#grid)" />

            {/* Connecting Edges */}
            <line x1="50" y1="65" x2="150" y2="35" stroke="#38bdf8" strokeWidth={activeNode === 1 ? "2.5" : "1.5"} strokeDasharray="4,4" className="animate-pulse" />
            <line x1="50" y1="65" x2="150" y2="95" stroke="#38bdf8" strokeWidth={activeNode === 2 ? "2.5" : "1.5"} strokeDasharray="4,4" className="animate-pulse" />
            <line x1="150" y1="35" x2="250" y2="65" stroke="#10b981" strokeWidth="2" />
            <line x1="150" y1="95" x2="250" y2="65" stroke="#10b981" strokeWidth="2" />

            {/* Node 1: Input / Origin */}
            <g transform="translate(50, 65)" onClick={() => setActiveNode(1)} className="cursor-pointer">
              <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
              <circle cx="0" cy="0" r="8" fill="#0284c7" />
              <text x="0" y="24" fill="#38bdf8" fontSize="7" textAnchor="middle" fontFamily="monospace">INPUT</text>
            </g>

            {/* Node 2: Civic Constraints */}
            <g transform="translate(150, 35)" onClick={() => setActiveNode(2)} className="cursor-pointer">
              <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="0" cy="0" r="8" fill="#d97706" />
              <text x="0" y="-20" fill="#f59e0b" fontSize="7" textAnchor="middle" fontFamily="monospace">CIVICS</text>
            </g>

            {/* Node 3: Algorithmic Logic */}
            <g transform="translate(150, 95)" onClick={() => setActiveNode(3)} className="cursor-pointer">
              <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
              <circle cx="0" cy="0" r="8" fill="#7e22ce" />
              <text x="0" y="24" fill="#c084fc" fontSize="7" textAnchor="middle" fontFamily="monospace">STEM</text>
            </g>

            {/* Node 4: Equilibrium Output */}
            <g transform="translate(250, 65)">
              <circle cx="0" cy="0" r="18" fill="#0f172a" stroke={testPassed ? "#10b981" : "#f59e0b"} strokeWidth="2" className={testPassed ? "animate-pulse" : ""} />
              <circle cx="0" cy="0" r="10" fill={testPassed ? "#10b981" : "#d97706"} />
              <text x="0" y="26" fill="#10b981" fontSize="7" textAnchor="middle" fontFamily="monospace">OUTPUT</text>
            </g>
          </svg>

          {/* Metric Badges */}
          <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800 text-[10px] font-mono">
            <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px]">Equilibrium:</span>
              <strong className={`text-[11px] ${equilibriumScore > 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {equilibriumScore}%
              </strong>
            </div>
            <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px]">Civic Flow:</span>
              <strong className="text-[11px] text-cyan-300">{metricA} pts</strong>
            </div>
            <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400 block text-[9px]">STEM Fidelity:</span>
              <strong className="text-[11px] text-purple-300">{metricB}%</strong>
            </div>
          </div>
        </div>

        {/* Right Pane: Challenge Focus & Shock Controls */}
        <div className="bg-slate-900/60 rounded-md border border-slate-800 p-3 flex flex-col justify-between text-xs space-y-3">
          <div>
            <div className="text-slate-200 font-bold mb-2 pb-1 border-b border-slate-800 flex items-center justify-between">
              <span>SIMULATION DYNAMICS</span>
              <span className="text-[10px] text-slate-400 font-mono">Custom Studio Node</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="bg-slate-950 p-2 rounded border border-slate-800 space-y-1">
                <div className="text-blue-400 font-bold flex items-center gap-1">
                  <Shield className="w-3 h-3" /> Civics Context:
                </div>
                <p className="text-slate-300">{civicsFocus}</p>
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800 space-y-1">
                <div className="text-amber-400 font-bold flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> STEM Algorithm:
                </div>
                <p className="text-slate-300">{stemFocus}</p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleInjectShock}
              className="px-2.5 py-1.5 rounded bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold text-[11px] flex items-center gap-1 transition shadow"
            >
              <Zap className="w-3 h-3" />
              <span>Simulate External Crisis Shock</span>
            </button>

            <span className="text-[10px] font-mono text-slate-400">
              {testPassed ? "✓ Solution Active" : "Waiting for code..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
