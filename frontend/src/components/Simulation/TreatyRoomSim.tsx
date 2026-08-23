import React, { useState } from 'react';
import { Globe2, Cpu, ShieldCheck, Zap } from 'lucide-react';

interface TreatyRoomSimProps {
  isRunning: boolean;
  testPassed: boolean;
}

interface DelegateVote {
  nation: string;
  flag: string;
  votes: number;
  cost: number;
}

export const TreatyRoomSim: React.FC<TreatyRoomSimProps> = ({ testPassed }) => {
  const [delegates, setDelegates] = useState<DelegateVote[]>([
    { nation: "Archipelago Alliance", flag: "🏝️", votes: 6, cost: 36 },
    { nation: "Continental Union", flag: "🏛️", votes: 7, cost: 49 },
    { nation: "Nordic Federation", flag: "🏔️", votes: 5, cost: 25 },
    { nation: "South Pacific Coalition", flag: "🌊", votes: 8, cost: 64 },
  ]);

  const [selectedNation, setSelectedNation] = useState<number>(0);
  const totalVotes = delegates.reduce((sum, d) => sum + d.votes, 0);
  const totalCost = delegates.reduce((sum, d) => sum + d.cost, 0);
  const quorum = 24;
  const ratified = totalVotes >= quorum;

  const handleVoteChange = (index: number, newVotes: number) => {
    const safeVotes = Math.max(0, Math.min(10, newVotes));
    const newDelegates = [...delegates];
    newDelegates[index] = {
      ...newDelegates[index],
      votes: safeVotes,
      cost: safeVotes * safeVotes
    };
    setDelegates(newDelegates);
  };

  return (
    <div className="relative flex flex-col h-full bg-[#121826] rounded-lg border border-slate-800 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2 font-semibold text-amber-400">
          <Globe2 className="w-4 h-4 text-amber-400" />
          <span>Multilateral Treaty Chamber & Quadratic Voting Ledger</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-slate-400">Protocol:</span>
          <span className="text-cyan-400 font-bold">ERC-5192 / Arbitrum L2</span>
        </div>
      </div>

      <div className="relative flex-1 p-3 grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto">
        {/* Node Network Visualizer */}
        <div className="bg-[#0b1220] rounded-md border border-slate-800 p-2 flex flex-col justify-between">
          <div className="text-[11px] font-bold text-slate-400 flex items-center justify-between mb-1">
            <span>MULTILATERAL CONSENSUS MESH</span>
            <span className={ratified ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {ratified ? '✓ Quorum Reached' : `${totalVotes}/${quorum} Votes`}
            </span>
          </div>

          <svg viewBox="0 0 300 130" className="w-full h-32">
            <rect width="300" height="130" fill="#0c1527" />

            {/* Central Treaty Node */}
            <circle cx="150" cy="65" r="28" fill={ratified ? '#065f46' : '#1e293b'} stroke={ratified ? '#10b981' : '#3b82f6'} strokeWidth="2" />
            <text x="150" y="60" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">PARIS-2050</text>
            <text x="150" y="73" fill="#a7f3d0" fontSize="8" textAnchor="middle">{totalVotes} VOTES</text>

            {/* Delegate Nodes around center */}
            {delegates.map((d, i) => {
              const angle = (i / delegates.length) * Math.PI * 2;
              const x = 150 + Math.cos(angle) * 85;
              const y = 65 + Math.sin(angle) * 45;
              return (
                <g key={i}>
                  {/* Connection Line */}
                  <line
                    x1="150"
                    y1="65"
                    x2={x}
                    y2={y}
                    stroke={d.votes > 0 ? '#38bdf8' : '#334155'}
                    strokeWidth={Math.max(1, d.votes * 0.4)}
                    strokeDasharray={d.votes > 0 ? 'none' : '3,3'}
                  />
                  {/* Node */}
                  <circle cx={x} cy={y} r="14" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x={x} y={y + 3} fontSize="10" textAnchor="middle">{d.flag}</text>
                  <text x={x} y={y + 24} fill="#cbd5e1" fontSize="7" fontWeight="bold" textAnchor="middle">
                    {d.votes}v ({d.cost}c)
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Ledger Summary */}
          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px]">
            <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400">Total Votes Cast</span>
              <div className="font-mono font-bold text-cyan-400 text-xs">{totalVotes}</div>
            </div>
            <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400">Credits Burned (\(V^2\))</span>
              <div className="font-mono font-bold text-amber-400 text-xs">{totalCost} Credits</div>
            </div>
            <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
              <span className="text-slate-400">Consensus Status</span>
              <div className={`font-bold text-xs ${ratified ? 'text-emerald-400' : 'text-amber-400'}`}>
                {ratified ? 'RATIFIED' : 'PENDING'}
              </div>
            </div>
          </div>
        </div>

        {/* Quadratic Voting Voice Credit Allocator */}
        <div className="bg-slate-900/60 rounded-md border border-slate-800 p-3 flex flex-col justify-between text-xs">
          <div>
            <div className="flex items-center justify-between text-amber-400 font-bold mb-2">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Quadratic Voice Credit Slider</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Cost = Votes²</span>
            </div>

            {/* Select sovereign nation */}
            <div className="flex gap-1.5 mb-2.5">
              {delegates.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedNation(idx)}
                  className={`flex-1 py-1 px-1.5 rounded border text-[11px] flex items-center justify-center gap-1 transition ${
                    selectedNation === idx
                      ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{d.flag}</span>
                  <span className="truncate">{d.nation.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Vote Slider for selected delegate */}
            <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-2 mb-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-300 font-semibold">
                  {delegates[selectedNation].flag} {delegates[selectedNation].nation}:
                </span>
                <span className="font-mono text-cyan-400 font-bold">
                  {delegates[selectedNation].votes} Votes
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="10"
                value={delegates[selectedNation].votes}
                onChange={(e) => handleVoteChange(selectedNation, parseInt(e.target.value))}
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Voice Credit Cost:</span>
                <span className="font-mono font-bold text-amber-400 text-xs">
                  {delegates[selectedNation].cost} / 100 Credits ({delegates[selectedNation].votes}²)
                </span>
              </div>
            </div>

            {/* Merkle Proof Status */}
            <div className="bg-slate-950 p-2 rounded border border-slate-800 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Merkle Proof:
              </span>
              <span className="font-mono text-emerald-300 text-[10px]">
                0x7a8f...39d2 (Verified)
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>{testPassed ? "✓ Treaty ratified & anchored on Arbitrum L2." : "Implement Quadratic Voting protocol in editor..."}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
