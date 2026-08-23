import React, { useState } from 'react';
import { TopBar } from './components/Navigation/TopBar';
import { DialogueTree } from './components/Dialogue/DialogueTree';
import { AgoraSim } from './components/Simulation/AgoraSim';
import { RenaissanceMapSim } from './components/Simulation/RenaissanceMapSim';
import { IndustrialCitySim } from './components/Simulation/IndustrialCitySim';
import { TreatyRoomSim } from './components/Simulation/TreatyRoomSim';
import { CodeEditor } from './components/Editor/CodeEditor';
import { ConsoleOutput } from './components/Editor/ConsoleOutput';
import { CertificateBadgeModal } from './components/Web3/CertificateBadgeModal';
import { ManualModal } from './components/Manual/ManualModal';
import { EducatorPortalModal } from './components/Educator/EducatorPortalModal';
import { MultiplayerLobbyModal } from './components/Multiplayer/MultiplayerLobbyModal';
import { InstitutionalAdminDashboard } from './components/Assessment/InstitutionalAdminDashboard';
import { InvestorShowcaseModal } from './components/Investor/InvestorShowcaseModal';
import { InfiniteStudioModal } from './components/Studio/InfiniteStudioModal';
import { DynamicCustomSim } from './components/Simulation/DynamicCustomSim';
import { TRACKS, TrackData } from './tracks';
import { runCodeSandbox, ExecutionResult } from './engine/sandbox/wasmRunner';
import { BookOpen, HelpCircle, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [tracksList, setTracksList] = useState<TrackData[]>(TRACKS);
  const [currentTrackId, setCurrentTrackId] = useState<number>(1);
  const currentTrack: TrackData = tracksList.find(t => t.id === currentTrackId) || tracksList[0];

  const [codes, setCodes] = useState<Record<number, string>>({
    1: TRACKS[0].starterCode,
    2: TRACKS[1].starterCode,
    3: TRACKS[2].starterCode,
    4: TRACKS[3].starterCode
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [results, setResults] = useState<Record<number, ExecutionResult | null>>({});
  const [completedTracks, setCompletedTracks] = useState<number[]>([]);
  const [civicScore, setCivicScore] = useState<number>(120);

  // Web3 & Modal state
  const [walletConnected, setWalletConnected] = useState<boolean>(true);
  const [walletAddress] = useState<string>("0x71C8364F3B84432aF5cFe1b7eF29A440D9e9149A");
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState<boolean>(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [isEducatorModalOpen, setIsEducatorModalOpen] = useState<boolean>(false);
  const [isMultiplayerModalOpen, setIsMultiplayerModalOpen] = useState<boolean>(false);
  const [isStandardsModalOpen, setIsStandardsModalOpen] = useState<boolean>(false);
  const [isInvestorModalOpen, setIsInvestorModalOpen] = useState<boolean>(false);
  const [isStudioModalOpen, setIsStudioModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'briefing' | 'dialogue' | 'hints'>('briefing');

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode !== undefined) {
      setCodes(prev => ({ ...prev, [currentTrackId]: newCode }));
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    const codeToRun = codes[currentTrackId] || currentTrack.starterCode;
    const res = await runCodeSandbox(currentTrackId, codeToRun, "python");
    setResults(prev => ({ ...prev, [currentTrackId]: res }));
    setIsRunning(false);

    if (res.success && !completedTracks.includes(currentTrackId)) {
      setCompletedTracks(prev => [...prev, currentTrackId]);
      setCivicScore(prev => prev + 100);
    }
  };

  const handleDeployCustomScenario = (scenario: any) => {
    setTracksList(prev => [...prev.filter(t => t.id !== scenario.id), scenario]);
    setCodes(prev => ({ ...prev, [scenario.id]: scenario.starterCode }));
    setCurrentTrackId(scenario.id);
    setIsEducatorModalOpen(false);
  };

  const handleDeployTrack = (track: TrackData) => {
    setTracksList(prev => [...prev.filter(t => t.id !== track.id), track]);
    setCodes(prev => ({ ...prev, [track.id]: track.starterCode }));
    setCurrentTrackId(track.id);
    setIsStudioModalOpen(false);
  };

  const handleResetCode = () => {
    setCodes(prev => ({ ...prev, [currentTrackId]: currentTrack.starterCode }));
  };

  const handleLoadSolution = () => {
    setCodes(prev => ({ ...prev, [currentTrackId]: currentTrack.solutionCode }));
  };

  const handleMintBadge = async (trackId: number) => {
    try {
      const resp = await fetch("http://localhost:8000/api/credentials/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_address: walletAddress,
          track_id: trackId,
          track_title: currentTrack.title,
          score: 100,
          verification_hash: results[trackId]?.verificationHash || "0x94eaa7...17fda"
        })
      });
      if (resp.ok) {
        return await resp.json();
      }
    } catch (e) {
      console.warn("Backend mint fallback:", e);
    }
    return {
      tx_hash: "0x" + Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join(''),
      token_id: 1000 + trackId
    };
  };

  const currentResult = results[currentTrackId] || null;
  const isTrackPassed = currentResult?.success || completedTracks.includes(currentTrackId);

  return (
    <div className="flex flex-col h-screen bg-[#0a0d14] text-slate-100 overflow-hidden select-none">
      {/* Top Navigation */}
      <TopBar
        tracks={tracksList}
        currentTrackId={currentTrackId}
        onSelectTrack={(id) => setCurrentTrackId(id)}
        civicScore={civicScore}
        completedTracks={completedTracks}
        onOpenCredentialModal={() => setIsCredentialModalOpen(true)}
        onOpenManual={() => setIsManualModalOpen(true)}
        onOpenEducatorSuite={() => setIsEducatorModalOpen(true)}
        onOpenMultiplayer={() => setIsMultiplayerModalOpen(true)}
        onOpenStandardsDashboard={() => setIsStandardsModalOpen(true)}
        onOpenInvestorShowcase={() => setIsInvestorModalOpen(true)}
        onOpenTrackStudio={() => setIsStudioModalOpen(true)}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
        onConnectWallet={() => setWalletConnected(!walletConnected)}
      />

      {/* Main Workspace Layout (2x2 Grid) */}
      <main className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-3 overflow-hidden">
        {/* Top-Left: Historical Narrative & Civic Briefing / Dialogue */}
        <div className="bg-[#121826] rounded-lg border border-slate-800 flex flex-col overflow-hidden shadow-sm">
          {/* Sub-header navigation tabs */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('briefing')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'briefing'
                    ? 'bg-blue-600/30 border border-blue-500 text-blue-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Historical Lore & Objectives</span>
              </button>

              <button
                onClick={() => setActiveTab('dialogue')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'dialogue'
                    ? 'bg-amber-600/30 border border-amber-500 text-amber-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{currentTrack.historicalFigure.avatar}</span>
                <span>Council Deliberation</span>
              </button>

              <button
                onClick={() => setActiveTab('hints')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'hints'
                    ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-200'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Coding Hints</span>
              </button>
            </div>

            <span className="font-mono text-[11px] text-amber-400 font-bold">
              {currentTrack.era}
            </span>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-3.5 overflow-y-auto">
            {activeTab === 'briefing' && (
              <div className="space-y-3 text-xs">
                <div>
                  <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>{currentTrack.title}</span>
                  </h2>
                  <p className="text-[11px] text-amber-400/90 font-medium">{currentTrack.subtitle}</p>
                </div>

                <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800 text-slate-300 font-serif leading-relaxed text-xs">
                  {currentTrack.lore}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-blue-950/30 border border-blue-900/40 p-2 rounded">
                    <div className="font-bold text-blue-300 mb-0.5">🏛️ Political Science Focus</div>
                    <div className="text-slate-300 text-[10.5px]">{currentTrack.civicsFocus}</div>
                  </div>
                  <div className="bg-amber-950/30 border border-amber-900/40 p-2 rounded">
                    <div className="font-bold text-amber-300 mb-0.5">💻 STEM Coding Focus</div>
                    <div className="text-slate-300 text-[10.5px]">{currentTrack.stemFocus}</div>
                  </div>
                </div>

                <div>
                  <div className="font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Technical Challenge Instructions:</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 pl-4 list-disc text-[11px]">
                    {currentTrack.instructions.map((inst, i) => (
                      <li key={i}>{inst}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'dialogue' && (
              <DialogueTree dialogueList={currentTrack.dialogue} />
            )}

            {activeTab === 'hints' && (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-amber-400 mb-1 flex items-center gap-1">
                  <HelpCircle className="w-4 h-4" />
                  <span>Curriculum Guidance & Syntax Tips</span>
                </div>
                {currentTrack.hints.map((hint, i) => (
                  <div key={i} className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-300 text-[11px] flex items-start gap-2">
                    <span className="font-mono text-amber-400 font-bold">0{i+1}.</span>
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top-Right: Interactive Historical Simulation Canvas */}
        <div className="h-full">
          {currentTrackId === 1 && <AgoraSim isRunning={isRunning} testPassed={isTrackPassed} />}
          {currentTrackId === 2 && <RenaissanceMapSim isRunning={isRunning} testPassed={isTrackPassed} />}
          {currentTrackId === 3 && <IndustrialCitySim isRunning={isRunning} testPassed={isTrackPassed} />}
          {currentTrackId === 4 && <TreatyRoomSim isRunning={isRunning} testPassed={isTrackPassed} />}
          {currentTrackId > 4 && (
            <DynamicCustomSim
              title={currentTrack.title}
              era={currentTrack.era}
              civicsFocus={currentTrack.civicsFocus}
              stemFocus={currentTrack.stemFocus}
              testPassed={isTrackPassed}
            />
          )}
        </div>

        {/* Bottom-Left: Monaco Code Editor */}
        <div className="h-full">
          <CodeEditor
            code={codes[currentTrackId] || currentTrack.starterCode}
            onChange={handleCodeChange}
            onRunCode={handleRunCode}
            onResetCode={handleResetCode}
            onLoadSolution={handleLoadSolution}
            isRunning={isRunning}
            language="python"
          />
        </div>

        {/* Bottom-Right: Test Assertions & Console Inspector */}
        <div className="h-full">
          <ConsoleOutput
            result={currentResult}
            isRunning={isRunning}
            onClaimBadge={() => setIsCredentialModalOpen(true)}
          />
        </div>
      </main>

      {/* Verifiable Credential / Soulbound NFT Modal */}
      <CertificateBadgeModal
        isOpen={isCredentialModalOpen}
        onClose={() => setIsCredentialModalOpen(false)}
        tracks={TRACKS}
        completedTracks={completedTracks}
        walletAddress={walletAddress}
        onMintBadge={handleMintBadge}
      />

      {/* Official Field Manual Modal */}
      <ManualModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />

      {/* Teacher Orchestration Suite & Scenario Builder Modal */}
      <EducatorPortalModal
        isOpen={isEducatorModalOpen}
        onClose={() => setIsEducatorModalOpen(false)}
        onDeployCustomScenario={handleDeployCustomScenario}
      />

      {/* Real-time Collaborative Multiplayer Conclave Modal */}
      <MultiplayerLobbyModal
        isOpen={isMultiplayerModalOpen}
        onClose={() => setIsMultiplayerModalOpen(false)}
      />

      {/* Institutional Assessment & Standards Dashboard Modal */}
      <InstitutionalAdminDashboard
        isOpen={isStandardsModalOpen}
        onClose={() => setIsStandardsModalOpen(false)}
      />

      {/* Investor Showcase & Interactive Simulation Video Reel Modal */}
      <InvestorShowcaseModal
        isOpen={isInvestorModalOpen}
        onClose={() => setIsInvestorModalOpen(false)}
        onLaunchTrack={(id) => setCurrentTrackId(id)}
      />

      {/* Infinite Track & Task Creator Studio Modal */}
      <InfiniteStudioModal
        isOpen={isStudioModalOpen}
        onClose={() => setIsStudioModalOpen(false)}
        onDeployTrack={handleDeployTrack}
      />
    </div>
  );
};
