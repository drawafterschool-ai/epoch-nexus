import React, { useState } from 'react';
import { X, Sparkles, Globe, Wand2, Play, Code2 } from 'lucide-react';
import { TrackData } from '../../tracks';

interface InfiniteStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeployTrack: (track: TrackData) => void;
}

export const InfiniteStudioModal: React.FC<InfiniteStudioModalProps> = ({
  isOpen,
  onClose,
  onDeployTrack
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'manual' | 'hub'>('ai');
  const [prompt, setPrompt] = useState<string>("Ancient Egypt: Nile Flooding Hydraulics & Grain Quorum");
  const [difficulty, setDifficulty] = useState<string>("Intermediate");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Manual Studio Form State
  const [title, setTitle] = useState<string>("The Space Race: Lunar Resource Governance");
  const [era, setEra] = useState<string>("2050+ CE (Lunar South Pole)");
  const [figure, setFigure] = useState<string>("Lunar Base Commander");
  const [civicsFocus, setCivicsFocus] = useState<string>("Outer Space Treaty non-appropriation and life-support resource quotas.");
  const [stemFocus, setStemFocus] = useState<string>("Resource allocation algorithms, threshold logic, and state matrices.");
  const [lore, setLore] = useState<string>("In 2050, permanent lunar colonies pool solar wattage and oxygen extractors under a shared multilateral accord.");
  const [instructions] = useState<string>("1. Implement allocate_life_support(bases, total_oxygen_kg, min_per_base)\n2. Distribute surplus proportionally based on base population");
  const [starterCode, setStarterCode] = useState<string>("def allocate_life_support(bases: dict, total_oxygen_kg: float, min_per_base: float) -> dict:\n    # TODO: Allocate baseline oxygen and distribute surplus\n    pass\n");
  const [solutionCode, setSolutionCode] = useState<string>("def allocate_life_support(bases: dict, total_oxygen_kg: float, min_per_base: float) -> dict:\n    allocated = {}\n    surplus = max(0.0, total_oxygen_kg - len(bases) * min_per_base)\n    total_pop = sum(bases.values())\n    for base, pop in bases.items():\n        share = (pop / total_pop) * surplus if total_pop > 0 else 0\n        allocated[base] = round(min_per_base + share, 1)\n    return allocated\n");
  const [badgeName] = useState<string>("Lunar Charter Diplomat");
  const [badgeIcon] = useState<string>("🚀");

  // Pre-loaded Community Hub Tracks
  const [communityTracks] = useState<TrackData[]>([
    {
      id: 101,
      title: "Ancient Egypt: Nile Flooding Hydraulics",
      subtitle: "Old Kingdom Silo Rationing & Nilometer Mathematics",
      era: "2500 BCE – Old Kingdom Egypt",
      historicalFigure: { name: "Imhotep", title: "Royal Architect", avatar: "🌾" },
      civicsFocus: "Emergency drought relief quotas and state granary distributions.",
      stemFocus: "Threshold checking, rate modifiers, and resource division.",
      lore: "Annual inundations of the Nile determined Egypt's survival. Viziers engineered automated granary allocations to survive erratic drought years.",
      instructions: ["Implement calculate_nile_grain_reserve(flood_cubits, demand, reserve_pct)"],
      starterCode: "def calculate_nile_grain_reserve(flood_cubits: float, demand: int, reserve_pct: float) -> int:\n    pass\n",
      solutionCode: "def calculate_nile_grain_reserve(flood_cubits: float, demand: int, reserve_pct: float) -> int:\n    if flood_cubits < 12.0: return int(demand * reserve_pct * 1.5)\n    return int(demand * 1.3 * reserve_pct)\n",
      hints: ["Droughts below 12 cubits require emergency 1.5x reserve multiplier."],
      badgeName: "Vizier of the Granaries",
      badgeIcon: "🌾",
      dialogue: [{ speaker: "Imhotep", avatar: "🌾", role: "Vizier", era: "2500 BCE", text: "The Nile rises. Compute the granary reserves to protect the kingdom.", options: [{ label: "Enact emergency reserve quota.", feedback: "The granaries are secured." }] }]
    },
    {
      id: 102,
      title: "Feudal Japan: Shogunate Courier Cipher",
      subtitle: "Edo Period Checkpoint Security & Clan Oaths",
      era: "1603 CE – Tokugawa Edo Period",
      historicalFigure: { name: "Tokugawa Ieyasu", title: "Shogun of Japan", avatar: "🏯" },
      civicsFocus: "Sankin-kōtai diplomacy and checkpoint pass authentications.",
      stemFocus: "Hash verification and string prefix matching.",
      lore: "Along the Tokaido road, official couriers carried encrypted tally seals to verify travel authorization between Kyoto and Edo.",
      instructions: ["Implement verify_checkpoint_token(token_code, clan_seal, valid_clans)"],
      starterCode: "def verify_checkpoint_token(token_code: str, clan_seal: str, valid_clans: list) -> str:\n    pass\n",
      solutionCode: "def verify_checkpoint_token(token_code: str, clan_seal: str, valid_clans: list) -> str:\n    if clan_seal in valid_clans and token_code.startswith(clan_seal): return 'PERMITTED'\n    return 'DETAINED'\n",
      hints: ["Check if clan_seal is in valid_clans and matches token prefix."],
      badgeName: "Tokugawa Seal Guardian",
      badgeIcon: "🏯",
      dialogue: [{ speaker: "Ieyasu", avatar: "🏯", role: "Shogun", era: "1603 CE", text: "Security of the road ensures the tranquility of the realm.", options: [{ label: "Verify daimyo passport seals.", feedback: "The passage is granted." }] }]
    }
  ]);

  if (!isOpen) return null;

  const handleGenerateAITrack = async () => {
    setIsGenerating(true);
    try {
      const resp = await fetch("http://localhost:8000/api/tracks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, difficulty, language: "python" })
      });
      if (resp.ok) {
        const generated = await resp.json();
        onDeployTrack(generated);
        onClose();
        return;
      }
    } catch (e) {
      console.warn("Backend generator fallback to local template:", e);
    }

    // Local Synthesizer Fallback
    const newTrack: TrackData = {
      id: Date.now(),
      title: prompt.length < 35 ? prompt : "Custom Synthesized Track",
      subtitle: `${difficulty} Level • Synthesized Statecraft Module`,
      era: "Custom Era & Civic Dilemma",
      historicalFigure: { name: "Historical Mentor", title: "Civics Guide", avatar: "⚡" },
      civicsFocus: "Institutional equilibrium, checks and balances, and civic decision-making.",
      stemFocus: "Algorithmic decision trees, boolean assertions, and functions.",
      lore: `In this custom simulation based on '${prompt}', scholars model historical constraints through code.`,
      instructions: ["Implement solve_custom_civic_challenge(inputs, constraints, threshold)"],
      starterCode: "def solve_custom_civic_challenge(inputs: list, constraints: dict, threshold: int) -> str:\n    # TODO: Implement custom state logic\n    pass\n",
      solutionCode: "def solve_custom_civic_challenge(inputs: list, constraints: dict, threshold: int) -> str:\n    if sum(inputs) >= threshold and constraints.get('legal_quorum', False):\n        return 'APPROVED'\n    return 'REJECTED'\n",
      hints: ["Inspect the 'legal_quorum' key in the constraints dictionary."],
      badgeName: "Custom Track Master",
      badgeIcon: "⚡",
      dialogue: [{ speaker: "Mentor", avatar: "⚡", role: "Advisor", era: "Custom", text: "Your algorithmic logic will determine civic success.", options: [{ label: "Deploy solution.", feedback: "State verified." }] }]
    };

    setIsGenerating(false);
    onDeployTrack(newTrack);
    onClose();
  };

  const handleDeployManual = () => {
    const newTrack: TrackData = {
      id: Date.now(),
      title: title,
      subtitle: `${era} • Custom Creator Studio Module`,
      era: era,
      historicalFigure: { name: figure, title: "Historical Advisor", avatar: badgeIcon },
      civicsFocus: civicsFocus,
      stemFocus: stemFocus,
      lore: lore,
      instructions: instructions.split('\n').filter(Boolean),
      starterCode: starterCode,
      solutionCode: solutionCode,
      hints: ["Ensure all test boundary conditions are verified."],
      badgeName: badgeName,
      badgeIcon: badgeIcon,
      dialogue: [{ speaker: figure, avatar: badgeIcon, role: "Advisor", era: era, text: lore, options: [{ label: "Solve challenge.", feedback: "Challenge launched." }] }]
    };
    onDeployTrack(newTrack);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0e1320] border border-slate-700 rounded-xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-cyan-500 flex items-center justify-center shadow-lg text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>EPOCH NEXUS — INFINITE TRACK & TASK CREATOR STUDIO</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  Infinite Engine
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Generate, Author, Play, and Share Unlimited Historical Civics & STEM Coding Modules</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'ai' ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>AI Generator</span>
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'manual' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>WYSIWYG Studio</span>
              </button>
              <button
                onClick={() => setActiveTab('hub')}
                className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'hub' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Community Hub ({communityTracks.length})</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-y-auto text-xs">
          {activeTab === 'ai' && (
            <div className="max-w-2xl mx-auto space-y-5 py-4">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-amber-300 flex items-center justify-center gap-2">
                  <Wand2 className="w-4 h-4 text-amber-400" />
                  <span>Instant AI Scenario & Track Synthesizer</span>
                </h3>
                <p className="text-slate-400 text-xs">
                  Type any historical era, political dilemma, or STEM concept to generate a fully playable simulation track with Python starter code, tests, and dialogue.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Enter Topic, Historical Era, or Coding Concept:</label>
                <textarea
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Ancient Egypt Nile Flooding Hydraulics, French Revolution National Assembly Voting, Feudal Japan Shogunate Ciphers, Apollo 11 Trajectory Logic..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-slate-100 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Difficulty Tier:</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 text-xs"
                  >
                    <option value="Beginner">Beginner (Logic & Conditionals)</option>
                    <option value="Intermediate">Intermediate (Algorithms & Data Structures)</option>
                    <option value="Advanced">Advanced (OOP, Dynamics & Smart Contracts)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Quick Templates:</label>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setPrompt("Ancient Egypt: Nile Flooding Hydraulics & Grain Quorum")}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded text-[10px] text-amber-300 border border-slate-800 truncate"
                    >
                      🌾 Nile Egypt
                    </button>
                    <button
                      onClick={() => setPrompt("Feudal Japan: Shogunate Courier Cipher & Han Alliances")}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded text-[10px] text-cyan-300 border border-slate-800 truncate"
                    >
                      🏯 Edo Japan
                    </button>
                    <button
                      onClick={() => setPrompt("Space Colonization: Artemis Lunar Resource Governance Accord")}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 rounded text-[10px] text-purple-300 border border-slate-800 truncate"
                    >
                      🚀 Artemis Moon
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  disabled={isGenerating}
                  onClick={handleGenerateAITrack}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-amber-600 via-rose-600 to-cyan-600 hover:from-amber-500 hover:to-cyan-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? "Synthesizing Infinite Simulation Track..." : "Generate & Launch Custom Track in Studio"}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Track Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Historical Era / Setting</label>
                  <input
                    type="text"
                    value={era}
                    onChange={(e) => setEra(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Historical Persona</label>
                  <input
                    type="text"
                    value={figure}
                    onChange={(e) => setFigure(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-blue-400 font-bold">🏛️ Civics & Political Science Concept</label>
                  <textarea
                    rows={2}
                    value={civicsFocus}
                    onChange={(e) => setCivicsFocus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-amber-400 font-bold">💻 STEM Coding & Algorithm Focus</label>
                  <textarea
                    rows={2}
                    value={stemFocus}
                    onChange={(e) => setStemFocus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold">Historical Narrative Lore</label>
                <textarea
                  rows={2}
                  value={lore}
                  onChange={(e) => setLore(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                />
              </div>

              {/* Code Templates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Student Starter Code Template (Python)</label>
                  <textarea
                    rows={5}
                    value={starterCode}
                    onChange={(e) => setStarterCode(e.target.value)}
                    className="w-full bg-slate-950 font-mono text-[11px] border border-slate-800 rounded p-2 text-blue-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold">Reference Solution Code</label>
                  <textarea
                    rows={5}
                    value={solutionCode}
                    onChange={(e) => setSolutionCode(e.target.value)}
                    className="w-full bg-slate-950 font-mono text-[11px] border border-slate-800 rounded p-2 text-emerald-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={handleDeployManual}
                  className="px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Play className="w-4 h-4" />
                  <span>Deploy Track to Active IDE</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'hub' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <div>
                  <div className="text-xs font-bold text-slate-200">COMMUNITY EXPANSION PACKS & REMIX PLAYGROUND</div>
                  <p className="text-[11px] text-slate-400">Play user-created tracks or fork them into the studio to modify tasks.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {communityTracks.map((trk) => (
                  <div key={trk.id} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{trk.badgeIcon}</span>
                        <div>
                          <div className="font-bold text-slate-200 text-xs">{trk.title}</div>
                          <div className="text-[10px] text-amber-400">{trk.era}</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{trk.lore}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex justify-between items-center">
                      <span className="text-[10px] font-mono text-cyan-300">{trk.stemFocus}</span>
                      <button
                        onClick={() => {
                          onDeployTrack(trk);
                          onClose();
                        }}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1 transition shadow"
                      >
                        <Play className="w-3 h-3" />
                        <span>Play Track</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Epoch Nexus Academy • Infinite Possibilities Creator Studio</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
};
