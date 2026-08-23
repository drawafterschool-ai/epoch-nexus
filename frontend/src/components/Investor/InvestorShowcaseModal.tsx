import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Sparkles, TrendingUp, Shield, Cpu, ChevronRight } from 'lucide-react';

interface InvestorShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchTrack?: (trackId: number) => void;
}

export const InvestorShowcaseModal: React.FC<InvestorShowcaseModalProps> = ({
  isOpen,
  onClose,
  onLaunchTrack
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const steps = [
    {
      id: 1,
      title: "Track 1: Classical Antiquity (508 BCE)",
      era: "Athenian Agora & Roman Senate",
      lore: "Cleisthenes establishes direct citizen quorum; Plebeian Tribunes wield sacred Veto power.",
      stem: "Boolean Logic, Truth Tables, Compound Conditionals, State Registers",
      codeSnippet: "def tally_civic_vote(votes, quorum, veto_active):\n    if veto_active: return 'VETOED'\n    if sum(votes.values()) < quorum: return 'QUORUM_FAILED'\n    return 'PASSED' if votes['yes'] > votes['no'] else 'REJECTED'",
      metrics: { turnout: "6,420 Citizens", quorum: "6,000", status: "PASSED ✓", hash: "0xe0a1...69cf" },
      color: "from-amber-600 to-yellow-600",
      accent: "text-amber-400"
    },
    {
      id: 2,
      title: "Track 2: Age of Discovery (1560 CE)",
      era: "Venetian Conclave & Maritime Trade",
      lore: "Navigators encrypt diplomatic cables using Caesar & Vigenère cipher disks to secure trade treaties.",
      stem: "String Modulo Arithmetic, ASCII Character Manipulation, Polyalphabetic Ciphers",
      codeSnippet: "def decrypt_diplomatic_cable(ciphertext, cipher_type, key):\n    shift = ord(key[i % len(key)]) - ord('A')\n    return chr((ord(ch) - ord('A') - shift) % 26 + ord('A'))",
      metrics: { fleetRevenue: "£28,450.00", tariffs: "5% Hanseatic", status: "DECRYPTED ✓", hash: "0xc261...2116" },
      color: "from-blue-600 to-cyan-600",
      accent: "text-cyan-400"
    },
    {
      id: 3,
      title: "Track 3: Industrial Revolution (1847 CE)",
      era: "Victorian Manchester & Lovelace Engine",
      lore: "Parliamentary Factory Acts mitigate strikes; Ada Lovelace computes Bernoulli polynomial sequence.",
      stem: "OOP Class Encapsulation, Discrete Simulation Loops, Non-Linear Dynamics",
      codeSnippet: "class IndustrialEconomySim:\n    def tick(self):\n        self.capital += (self.output * 2.0 - self.labor_cost)\n        self.smog_index += self.output * 0.05",
      metrics: { output: "500 Units", morale: "85%", smog: "14 AQI (Scrubbed)", hash: "0xcc8e...ce93" },
      color: "from-emerald-600 to-teal-600",
      accent: "text-emerald-400"
    },
    {
      id: 4,
      title: "Track 4: Modern Governance (2030+ CE)",
      era: "UN & Web3 Multilateral Consensus",
      lore: "Sovereign nations leverage Quadratic Voting to protect minority rights and ratify global treaties.",
      stem: "Quadratic Cost Models (Cost = V²), Smart Contracts, Soulbound ERC-5192 Badges",
      codeSnippet: "def cast_quadratic_vote(delegate, proposal, votes):\n    cost = votes ** 2\n    if self.balances[delegate] < cost: raise Error()\n    self.balances[delegate] -= cost",
      metrics: { delegates: "193 Nations", quorum: "20 / 20", status: "RATIFIED ✓", hash: "0x6deb...85ba" },
      color: "from-purple-600 to-indigo-600",
      accent: "text-purple-400"
    },
    {
      id: 5,
      title: "Infinite Studio: AI Track Synthesizer",
      era: "Custom Era & Infinite Possibilities",
      lore: "Teachers and students type natural language prompts to instantly synthesize runnable simulations, Python tests, and lore.",
      stem: "Prompt Engineering, Algorithmic State Matrices, Dynamic Procedural Canvas",
      codeSnippet: "def calculate_nile_grain_reserve(flood_cubits, demand, reserve_pct):\n    if flood_cubits < 12.0:\n        return int(demand * reserve_pct * 1.5)\n    return int(demand * 1.3 * reserve_pct)",
      metrics: { generationTime: "0.18s", synthesisMode: "AI Prompt", status: "SYNTHESIZED ⚡", hash: "0xinfinitestudio...7710" },
      color: "from-amber-600 to-rose-600",
      accent: "text-amber-300"
    },
    {
      id: 6,
      title: "Institutional Standards & Gradebook",
      era: "District Admin & Assessment Pipeline",
      lore: "District administrators track AP Euro, AP Gov, and AP CSP mastery with 1-click gradebook exports to Canvas and Google Classroom.",
      stem: "Misconception Diagnostic Heatmaps, Cryptographic Audit Ledgers, SOC2 & FERPA",
      codeSnippet: "# AP Standards Mastery & Gradebook Export Pipeline\nAP_STANDARDS_MAPPING = {\n    'AP-EURO-4.2': {'mastery': 94.5, 'track': 2},\n    'AP-GOV-1.3':  {'mastery': 96.2, 'track': [1, 4]},\n    'AP-CSP-3.1':  {'mastery': 97.8, 'track': [1, 2, 3, 4]}\n}",
      metrics: { enrolledScholars: "5,240", apMastery: "95.4%", lmsExport: "1-Click Ready", hash: "0xsoc2audit...9921" },
      color: "from-cyan-600 to-blue-600",
      accent: "text-cyan-300"
    }
  ];

  const activeStep = steps[currentStep];

  useEffect(() => {
    let interval: any = null;
    if (isPlaying && isOpen) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setCurrentStep((s) => (s + 1) % steps.length);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isOpen, steps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#0b0f19] border border-slate-700 rounded-xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>EPOCH NEXUS ACADEMY — MASTER SIMULATION & STUDIO REEL</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  Executive Reel (6 Modules)
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Tri-Pillar Pedagogical Matrix • Infinite AI Studio • Standards Assessment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{isPlaying ? 'Pause Reel' : 'Play Reel'}</span>
            </button>

            <button
              onClick={() => { setProgress(0); setCurrentStep(0); }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title="Restart Reel"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar Header */}
        <div className="grid grid-cols-6 bg-slate-950 border-b border-slate-800 text-xs">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => { setCurrentStep(idx); setProgress(0); }}
              className={`p-2.5 text-left border-r border-slate-800 transition relative overflow-hidden ${
                currentStep === idx ? 'bg-slate-900/90 text-white font-bold' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <div className="text-[9px] text-slate-400 font-mono">Stage {idx + 1} of 6</div>
              <div className="truncate text-[11px]">{step.title.split(':')[0]}</div>
              {currentStep === idx && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-500 to-amber-500 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Showcase Body */}
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
          {/* Left Column: Narrative Lore & Civics Concept */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                  {activeStep.era}
                </span>
                <span className="text-xs text-slate-400 font-mono">Step {currentStep + 1} / 4</span>
              </div>

              <h3 className="text-lg font-bold text-slate-100">{activeStep.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                {activeStep.lore}
              </p>

              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1.5">
                <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>STEM Computer Science Competency:</span>
                </div>
                <div className="text-xs text-slate-300">{activeStep.stem}</div>
              </div>
            </div>

            {/* Live Metrics Telemetry Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2">
              {Object.entries(activeStep.metrics).map(([key, val]) => (
                <div key={key} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-mono">{key}</div>
                  <div className="font-mono font-bold text-amber-300 text-xs mt-0.5">{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Code Execution & Verification Hash */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-slate-300 font-bold">Safe In-Browser Sandbox (Pyodide Wasm)</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">100% Passed</span>
              </div>

              {/* Code Snippet Box */}
              <pre className="bg-[#080b12] p-3.5 rounded-lg font-mono text-[11px] text-cyan-200 overflow-x-auto border border-slate-800/80 leading-relaxed">
                {activeStep.codeSnippet}
              </pre>
            </div>

            {/* Verification Proof & Credential Teaser */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <div className="text-[10px] text-slate-400 font-mono">Cryptographic Verification:</div>
                <div className="font-mono text-[11px] text-emerald-400 font-bold">{activeStep.metrics.hash}</div>
              </div>

              <button
                onClick={() => {
                  if (onLaunchTrack) onLaunchTrack(activeStep.id);
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow transition"
              >
                <span>Launch Interactive Track</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> SOC2 Type II & FERPA Compliant
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> 5,000+ Concurrency Scalability
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Showcase
          </button>
        </div>
      </div>
    </div>
  );
};
