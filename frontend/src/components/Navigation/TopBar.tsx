import React from 'react';
import { Landmark, Shield, Award, Wallet, CheckCircle2, BookOpen, GraduationCap, Users2, BarChart3, Sparkles, Zap, Swords, AlertTriangle } from 'lucide-react';
import { TrackData } from '../../tracks';

interface TopBarProps {
  tracks: TrackData[];
  currentTrackId: number;
  onSelectTrack: (id: number) => void;
  civicScore: number;
  completedTracks: number[];
  onOpenCredentialModal: () => void;
  onOpenManual: () => void;
  onOpenEducatorSuite: () => void;
  onOpenMultiplayer: () => void;
  onOpenStandardsDashboard: () => void;
  onOpenInvestorShowcase: () => void;
  onOpenTrackStudio: () => void;
  onOpenTournament: () => void;
  onTriggerCrisis: () => void;
  crisisActive: boolean;
  walletConnected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  tracks,
  currentTrackId,
  onSelectTrack,
  civicScore,
  completedTracks,
  onOpenCredentialModal,
  onOpenManual,
  onOpenEducatorSuite,
  onOpenMultiplayer,
  onOpenStandardsDashboard,
  onOpenInvestorShowcase,
  onOpenTrackStudio,
  onOpenTournament,
  onTriggerCrisis,
  crisisActive,
  walletConnected,
  walletAddress,
  onConnectWallet
}) => {

  return (
    <header className="bg-[#0f1422] border-b border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-md">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>EPOCH NEXUS <span className="text-amber-400">ACADEMY</span></span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                CIVICS & STEM
              </span>
            </div>
            <div className="text-[10px] text-slate-400">Tri-Pillar Simulation Platform</div>
          </div>
        </div>

        {/* Track Selector Tabs */}
        <div className="hidden lg:flex items-center gap-1 ml-6 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
          {tracks.map((t) => {
            const isCompleted = completedTracks.includes(t.id);
            const isSelected = t.id === currentTrackId;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTrack(t.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>Track {t.id}</span>
                {isCompleted && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right User State & Web3 Badges */}
      <div className="flex items-center gap-3">
        {/* Civic Score Gauge */}
        <div className="flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800 text-xs">
          <Shield className="w-4 h-4 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400">Civic Mastery: </span>
            <span className="font-mono font-bold text-amber-300">{civicScore} PTS</span>
          </div>
        </div>

        {/* Multiplayer Conclave Button */}
        <button
          onClick={onOpenMultiplayer}
          className="flex items-center gap-1.5 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-700/60 text-cyan-300 px-2.5 py-1 rounded-md text-xs font-semibold transition"
          title="Open Real-time Multiplayer Deliberation Conclave"
        >
          <Users2 className="w-4 h-4 text-cyan-400" />
          <span>Multiplayer</span>
        </button>

        {/* Standards & Assessment Dashboard Button */}
        <button
          onClick={onOpenStandardsDashboard}
          className="flex items-center gap-1.5 bg-amber-950/80 hover:bg-amber-900/80 border border-amber-700/60 text-amber-300 px-2.5 py-1 rounded-md text-xs font-semibold transition"
          title="Open Institutional Standards & Gradebook Dashboard"
        >
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span>Standards</span>
        </button>

        {/* Faction Tournament Button */}
        <button
          onClick={onOpenTournament}
          className="flex items-center gap-1.5 bg-gradient-to-r from-rose-900/80 to-amber-900/80 hover:from-rose-800 hover:to-amber-800 border border-amber-600/50 text-amber-200 px-2.5 py-1 rounded-md text-xs font-bold transition shadow-sm"
          title="Open Classroom Faction Tournament (Live Team Competition)"
        >
          <Swords className="w-3.5 h-3.5 text-amber-400" />
          <span>Tournament ⚔️</span>
        </button>

        {/* Dynamic Crisis Trigger Button */}
        <button
          onClick={onTriggerCrisis}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border transition ${
            crisisActive
              ? 'bg-rose-600 text-white border-rose-400 animate-pulse shadow-rose-900/50 shadow-lg'
              : 'bg-rose-950/60 hover:bg-rose-900/70 border-rose-800 text-rose-300'
          }`}
          title="Inject Dynamic Historical Crisis Shock"
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${crisisActive ? 'text-white' : 'text-rose-400'}`} />
          <span>{crisisActive ? 'Crisis Active!' : 'Crisis Shock ⚠️'}</span>
        </button>

        {/* Educator Suite Button */}
        <button
          onClick={onOpenEducatorSuite}
          className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-700/60 text-emerald-300 px-2.5 py-1 rounded-md text-xs font-semibold transition"
          title="Open Teacher Orchestration Suite & Scenario Builder"
        >
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          <span>Educator Suite</span>
        </button>

        {/* Infinite Track Studio Button */}
        <button
          onClick={onOpenTrackStudio}
          className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-500 hover:to-indigo-500 text-white font-bold px-2.5 py-1 rounded-md text-xs shadow-md transition"
          title="Open Infinite Track & Task Creator Studio (AI Synthesizer & Community Hub)"
        >
          <Zap className="w-3.5 h-3.5 text-yellow-300" />
          <span>Track Studio ⚡</span>
        </button>

        {/* Investor Demo Showcase Button */}
        <button
          onClick={onOpenInvestorShowcase}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600/90 to-yellow-600/90 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-bold px-2.5 py-1 rounded-md text-xs shadow-md transition"
          title="Watch Interactive Investor Simulation Reel & Platform Showcase"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>Investor Demo</span>
        </button>

        {/* Manual Button */}
        <button
          onClick={onOpenManual}
          className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-md text-xs font-semibold transition"
          title="Open Field Manual & Curriculum Guide"
        >
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span>Manual</span>
        </button>

        {/* L2 Credential Button */}
        <button
          onClick={onOpenCredentialModal}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/40 hover:to-amber-500/30 border border-amber-500/40 text-amber-300 px-2.5 py-1 rounded-md text-xs font-semibold transition"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Verifiable Credentials ({completedTracks.length}/4)</span>
        </button>

        {/* Web3 Wallet Button */}
        <button
          onClick={onConnectWallet}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold border transition ${
            walletConnected
              ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
              : 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>
            {walletConnected ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Connect Wallet'}
          </span>
        </button>
      </div>
    </header>
  );
};
