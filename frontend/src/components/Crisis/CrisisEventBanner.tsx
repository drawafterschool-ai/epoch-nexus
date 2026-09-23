import React from 'react';
import { Sparkles, X, Flame } from 'lucide-react';

export interface CrisisEvent {
  id: string;
  eraTitle: string;
  title: string;
  description: string;
  historicalContext: string;
  codeChallenge: string;
  impactScore: number;
}

export const CRISIS_DATABASE: Record<number, CrisisEvent> = {
  1: {
    id: 'crisis-athens-plague',
    eraTitle: 'Classical Antiquity (430 BCE)',
    title: 'The Great Plague of Athens',
    description: 'A sudden pestilence strikes the port of Piraeus. Citizen assembly attendance drops sharply!',
    historicalContext: 'During the Peloponnesian War, the crowded walls of Athens triggered an epidemic that claimed one-third of the populace, including Pericles.',
    codeChallenge: 'Modify your voting code to dynamically scale quorum down to 4,200 while strictly maintaining the Tribunician Veto rule.',
    impactScore: -35
  },
  2: {
    id: 'crisis-ottoman-blockade',
    eraTitle: 'Age of Discovery (1570 CE)',
    title: 'Ottoman Naval Blockade & Storm',
    description: 'Ottoman galleys intercept Venetian dispatches off Crete. Standard Caesar ciphers are compromised!',
    historicalContext: 'The Fourth Ottoman–Venetian War forced the Republic of Venice to adopt double-keyed polyalphabetic ciphers to protect spice convoys.',
    codeChallenge: 'Switch your decryption algorithm from Caesar substitution to full Vigenère polyalphabetic wrap with a secondary salt key.',
    impactScore: -40
  },
  3: {
    id: 'crisis-manchester-strike',
    eraTitle: 'Industrial Revolution (1842 CE)',
    title: 'The General Strike & Plug Plot Riots',
    description: '50,000 factory operatives pull boiler plugs from steam engines across Lancashire!',
    historicalContext: 'The Chartist movement and wage cuts triggered the first nationwide industrial general strike in world history.',
    codeChallenge: 'Adjust your IndustrialEconomySim to install emergency smog scrubbers and cap daily work hours at 10 to reduce strike risk below 0.15.',
    impactScore: -50
  },
  4: {
    id: 'crisis-byzantine-exploit',
    eraTitle: 'Modern Governance (2030+ CE)',
    title: 'Sybil Botnet Attack on Multilateral DAO',
    description: 'A rogue coalition generates 10,000 puppet identities to manipulate Outer Space Treaty ratification!',
    historicalContext: 'Decentralized governance systems must withstand 51% Byzantine attacks through quadratic capital constraints.',
    codeChallenge: 'Implement strict identity-bound Quadratic Voting: Cost = Votes^2. Reject any votes where cost exceeds delegate balance.',
    impactScore: -60
  }
};

interface CrisisEventBannerProps {
  trackId: number;
  isActive: boolean;
  onDismiss: () => void;
  onSolveCrisis: () => void;
}

export const CrisisEventBanner: React.FC<CrisisEventBannerProps> = ({
  trackId,
  isActive,
  onDismiss,
  onSolveCrisis
}) => {
  if (!isActive) return null;

  const crisis = CRISIS_DATABASE[trackId] || CRISIS_DATABASE[1];

  return (
    <div className="bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-y-2 border-rose-500/80 px-4 py-3 shadow-2xl text-white select-none animate-fadeIn relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-rose-600/30 border border-rose-400 text-rose-300 animate-pulse mt-0.5">
            <Flame className="w-5 h-5 text-rose-400" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-rose-900/90 text-rose-200 border border-rose-700 font-bold tracking-wider">
                ⚠️ DYNAMIC HISTORICAL CRISIS INJECTED
              </span>
              <span className="text-xs font-mono text-rose-300">{crisis.eraTitle}</span>
            </div>

            <h4 className="font-bold text-sm text-rose-100 mt-0.5">{crisis.title}</h4>
            <p className="text-xs text-rose-200/90 max-w-2xl">{crisis.description}</p>
            <div className="text-[11px] text-amber-200 bg-rose-950/60 rounded px-2 py-1 mt-1 border border-rose-800/60">
              <span className="font-bold">🎯 Adaptive Challenge:</span> {crisis.codeChallenge}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={onSolveCrisis}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>Refactor & Solve Crisis</span>
          </button>

          <button
            onClick={onDismiss}
            className="p-1 rounded-lg hover:bg-rose-800/50 text-rose-300 hover:text-white transition"
            title="Dismiss Alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
