import React, { useState } from 'react';
import { Swords, Trophy, Users, Zap, ArrowRight, X, CheckCircle2 } from 'lucide-react';

interface Faction {
  id: string;
  name: string;
  motto: string;
  color: string;
  bannerColor: string;
  score: number;
  scholarsCount: number;
  members: string[];
  civicPerk: string;
}

interface FactionTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackId: number;
}

export const FactionTournamentModal: React.FC<FactionTournamentModalProps> = ({
  isOpen,
  onClose,
  trackId
}) => {
  if (!isOpen) return null;

  const [selectedFaction, setSelectedFaction] = useState<string>('faction-a');
  const [hasJoined, setHasJoined] = useState<boolean>(false);

  const getFactions = (id: number): [Faction, Faction] => {
    if (id === 1) {
      return [
        {
          id: 'faction-a',
          name: 'The Delian League (Athens)',
          motto: 'Knowledge, Maritime Trade & Civic Deliberation',
          color: 'text-cyan-400 border-cyan-500 bg-cyan-950/40',
          bannerColor: 'from-cyan-900 to-blue-950',
          score: 8420,
          scholarsCount: 14,
          members: ['Pericles_99', 'Hypatia_Alpha', 'Socrates_Code', 'Themistocles_01'],
          civicPerk: '+15% Quorum consensus speed'
        },
        {
          id: 'faction-b',
          name: 'The Peloponnesian League (Sparta)',
          motto: 'Discipline, Military Quorum & Iron Resolve',
          color: 'text-rose-400 border-rose-500 bg-rose-950/40',
          bannerColor: 'from-rose-900 to-red-950',
          score: 7980,
          scholarsCount: 12,
          members: ['Leonidas_300', 'Brasidas_Tactics', 'Gorgo_Queen', 'Agis_IV'],
          civicPerk: '+20% Crisis resistance against plagues'
        }
      ];
    } else if (id === 2) {
      return [
        {
          id: 'faction-a',
          name: 'Serenissima Republic of Venice',
          motto: 'The Golden Lion of Saint Mark & Polyalphabetic Secrecy',
          color: 'text-amber-400 border-amber-500 bg-amber-950/40',
          bannerColor: 'from-amber-900 to-yellow-950',
          score: 9150,
          scholarsCount: 16,
          members: ['Doge_Mocenigo', 'MarcoPolo_92', 'Galileo_Dev', 'Bellini_Art'],
          civicPerk: 'Caesar & Vigenère Decryption Speed +25%'
        },
        {
          id: 'faction-b',
          name: 'Superba Republic of Genoa',
          motto: 'Saint George Cross & Mediterranean Maritime Convoys',
          color: 'text-emerald-400 border-emerald-500 bg-emerald-950/40',
          bannerColor: 'from-emerald-900 to-teal-950',
          score: 8840,
          scholarsCount: 15,
          members: ['Columbus_Nav', 'Doria_Admiral', 'Spinola_Fleet', 'Grimaldi_Coin'],
          civicPerk: 'Trade Route Tariff Optimization +20%'
        }
      ];
    } else if (id === 3) {
      return [
        {
          id: 'faction-a',
          name: 'The Analytical Innovators (Lovelace Guild)',
          motto: 'Bernoulli Sequences, Automation & Clean Steam',
          color: 'text-purple-400 border-purple-500 bg-purple-950/40',
          bannerColor: 'from-purple-900 to-indigo-950',
          score: 7600,
          scholarsCount: 11,
          members: ['Ada_Lovelace_1843', 'Babbage_Engine', 'Faraday_Charge', 'Brunel_Iron'],
          civicPerk: 'Smog Scrubber Efficiency +30%'
        },
        {
          id: 'faction-b',
          name: 'The Chartist Cooperative Alliance',
          motto: 'Ten Hours Act, Labor Equity & Social Accord',
          color: 'text-amber-400 border-amber-500 bg-amber-950/40',
          bannerColor: 'from-amber-900 to-orange-950',
          score: 7450,
          scholarsCount: 13,
          members: ['Robert_Owen', 'Feargus_OConnor', 'Gaskell_Novels', 'Kay_Shuttle'],
          civicPerk: 'Worker Satisfaction Decay Halved'
        }
      ];
    } else {
      return [
        {
          id: 'faction-a',
          name: 'The Multilateral Treaty Alliance (UN DAO)',
          motto: 'Universal Declarations & Quadratic Voting Equivalence',
          color: 'text-sky-400 border-sky-500 bg-sky-950/40',
          bannerColor: 'from-sky-900 to-blue-950',
          score: 9800,
          scholarsCount: 18,
          members: ['Eleanor_R', 'Dag_Hammarskjold', 'Boutros_Ghali', 'Ban_Ki_Moon'],
          civicPerk: 'Quadratic Voice Credit Subsidy +10'
        },
        {
          id: 'faction-b',
          name: 'The Decentralized Zero-Knowledge Coalition',
          motto: 'Algorithmic Truth, Cryptographic Proofs & Open Ledgers',
          color: 'text-emerald-400 border-emerald-500 bg-emerald-950/40',
          bannerColor: 'from-emerald-900 to-green-950',
          score: 9550,
          scholarsCount: 17,
          members: ['Satoshi_N', 'Hal_Finney', 'Vitalik_B', 'Szabo_Nick'],
          civicPerk: 'Byzantine Attack Defense Immunity'
        }
      ];
    }
  };

  const [factionA, factionB] = getFactions(trackId);
  const totalScore = factionA.score + factionB.score;
  const percentA = Math.round((factionA.score / totalScore) * 100);
  const percentB = 100 - percentA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b101d] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 text-white shadow-lg">
              <Swords className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">Classroom Faction Tournament</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 border border-rose-800">
                  LIVE SEASON 1
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Compete in real-time historical statecraft challenges & algorithmic problem solving
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tournament Tug-of-War Score Bar */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-bold font-mono mb-1.5">
            <span className="text-cyan-400">{factionA.name}: {factionA.score} PTS ({percentA}%)</span>
            <span className="text-slate-500 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>LEADERBOARD STANDINGS</span>
            </span>
            <span className="text-rose-400">{factionB.name}: {factionB.score} PTS ({percentB}%)</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden flex border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-500"
              style={{ width: `${percentA}%` }}
            />
            <div
              className="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-500"
              style={{ width: `${percentB}%` }}
            />
          </div>
        </div>

        {/* Faction Cards Grid */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto flex-1">
          {/* Faction A */}
          <div
            onClick={() => setSelectedFaction(factionA.id)}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedFaction === factionA.id
                ? 'border-cyan-400 bg-cyan-950/30 ring-2 ring-cyan-500/20 shadow-xl'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold uppercase">
                  FACTION ALPHA
                </span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>

              <h4 className="font-bold text-base text-white mt-2">{factionA.name}</h4>
              <p className="text-xs text-slate-300 italic mt-0.5">"{factionA.motto}"</p>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Faction Perk: {factionA.civicPerk}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Scholars Deployed: <span className="text-white font-bold">{factionA.scholarsCount} active</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Active Faction Roster:
                </div>
                <div className="flex flex-wrap gap-1">
                  {factionA.members.map((m, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-400 font-bold">{factionA.score} Civic Points</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFaction(factionA.id);
                  setHasJoined(true);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  hasJoined && selectedFaction === factionA.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                }`}
              >
                {hasJoined && selectedFaction === factionA.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Enlisted</span>
                  </>
                ) : (
                  <>
                    <span>Join Faction</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Faction B */}
          <div
            onClick={() => setSelectedFaction(factionB.id)}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
              selectedFaction === factionB.id
                ? 'border-rose-400 bg-rose-950/30 ring-2 ring-rose-500/20 shadow-xl'
                : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase">
                  FACTION BETA
                </span>
                <Users className="w-4 h-4 text-rose-400" />
              </div>

              <h4 className="font-bold text-base text-white mt-2">{factionB.name}</h4>
              <p className="text-xs text-slate-300 italic mt-0.5">"{factionB.motto}"</p>

              <div className="mt-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                <div className="text-rose-300 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Faction Perk: {factionB.civicPerk}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Scholars Deployed: <span className="text-white font-bold">{factionB.scholarsCount} active</span>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Active Faction Roster:
                </div>
                <div className="flex flex-wrap gap-1">
                  {factionB.members.map((m, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-rose-400 font-bold">{factionB.score} Civic Points</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedFaction(factionB.id);
                  setHasJoined(true);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  hasJoined && selectedFaction === factionB.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {hasJoined && selectedFaction === factionB.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Enlisted</span>
                  </>
                ) : (
                  <>
                    <span>Join Faction</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Real-time Tournament synchronization active</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Close & Return to Arena
          </button>
        </div>
      </div>
    </div>
  );
};
