import React, { useState } from 'react';
import { X, Users2, Send, CheckCircle2, Shield, Landmark, Scale, Globe } from 'lucide-react';

interface Delegate {
  delegate_id: string;
  name: string;
  role: string;
  nation: string;
  avatar: string;
  votes_cast: number;
  voice_credits_remaining: number;
}

interface LobbyData {
  lobby_id: string;
  title: string;
  era: string;
  topic: string;
  required_quorum: number;
  total_yes_votes: number;
  total_no_votes: number;
  consensus_reached: boolean;
  delegates: Delegate[];
  recent_events: {
    sender: string;
    type: string;
    text: string;
    timestamp: number;
  }[];
}

interface MultiplayerLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: {
    name: string;
    role: string;
    nation: string;
    avatar: string;
  };
}

export const MultiplayerLobbyModal: React.FC<MultiplayerLobbyModalProps> = ({
  isOpen,
  onClose,
  currentUser = {
    name: "Hypatia of Alexandria",
    role: "Assembly Orator",
    nation: "Agora Academy",
    avatar: "🏛️"
  }
}) => {
  const [currentLobbyId, setCurrentLobbyId] = useState<string>("agora-room-01");
  const [voteCount, setVoteCount] = useState<number>(2);
  const [chatInput, setChatInput] = useState<string>("");
  const [voiceCredits, setVoiceCredits] = useState<number>(100);

  // Mock initial lobby states
  const [lobbies, setLobbies] = useState<Record<string, LobbyData>>({
    "agora-room-01": {
      lobby_id: "agora-room-01",
      title: "Athenian Pnyx Popular Assembly (Ekklesia)",
      era: "508 BCE – Classical Antiquity",
      topic: "Decree on Athenian Naval Defense & Trireme Construction Quorum",
      required_quorum: 12,
      total_yes_votes: 8,
      total_no_votes: 2,
      consensus_reached: false,
      delegates: [
        { delegate_id: "del-01", name: "Hypatia", role: "Assembly Orator", nation: "Athens", avatar: "🏛️", votes_cast: 3, voice_credits_remaining: 91 },
        { delegate_id: "del-02", name: "Marcus Cicero", role: "Roman Tribune", nation: "Rome", avatar: "⚖️", votes_cast: 2, voice_credits_remaining: 96 },
        { delegate_id: "del-03", name: "Pericles", role: "Strategos", nation: "Athens", avatar: "📜", votes_cast: 5, voice_credits_remaining: 75 }
      ],
      recent_events: [
        { sender: "Pericles", type: "DEBATE_SPEECH", text: "A quorum of free citizens ensures lawful decrees.", timestamp: Date.now() - 40000 },
        { sender: "Marcus Cicero", type: "DEBATE_SPEECH", text: "The Tribunes of Rome support this motion provided veto rights are respected.", timestamp: Date.now() - 20000 }
      ]
    },
    "geneva-room-01": {
      lobby_id: "geneva-room-01",
      title: "UN & Web3 Multilateral Treaty Chamber",
      era: "1945 CE – 2030+ Modern Governance",
      topic: "Outer Space Environmental & Algorithmic Ethics Accord",
      required_quorum: 20,
      total_yes_votes: 14,
      total_no_votes: 3,
      consensus_reached: false,
      delegates: [
        { delegate_id: "del-04", name: "Eleanor Roosevelt", role: "Commission Chair", nation: "United Nations", avatar: "🌐", votes_cast: 6, voice_credits_remaining: 64 },
        { delegate_id: "del-05", name: "Ada Lovelace", role: "Technical Plenipotentiary", nation: "Scientific Union", avatar: "⚙️", votes_cast: 8, voice_credits_remaining: 36 }
      ],
      recent_events: [
        { sender: "Eleanor Roosevelt", type: "DEBATE_SPEECH", text: "Quadratic voice credits protect regional diversity of voice.", timestamp: Date.now() - 25000 }
      ]
    }
  });

  const activeLobby = lobbies[currentLobbyId] || lobbies["agora-room-01"];
  const quadraticCost = voteCount * voteCount;

  if (!isOpen) return null;

  const handleCastVote = (side: 'YES' | 'NO') => {
    if (voiceCredits < quadraticCost) {
      alert("Insufficient voice credits! Quadratic cost exceeds balance.");
      return;
    }

    setVoiceCredits(prev => prev - quadraticCost);

    setLobbies(prev => {
      const target = { ...prev[currentLobbyId] };
      const newYes = side === 'YES' ? target.total_yes_votes + voteCount : target.total_yes_votes;
      const newNo = side === 'NO' ? target.total_no_votes + voteCount : target.total_no_votes;
      const consensus = newYes >= target.required_quorum;

      target.total_yes_votes = newYes;
      target.total_no_votes = newNo;
      target.consensus_reached = consensus;
      target.recent_events = [
        ...target.recent_events,
        {
          sender: currentUser.name,
          type: "VOTE_CAST",
          text: `Casted ${voteCount} ${side} votes (Quadratic Cost: ${quadraticCost} credits)`,
          timestamp: Date.now()
        }
      ];
      return { ...prev, [currentLobbyId]: target };
    });
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setLobbies(prev => {
      const target = { ...prev[currentLobbyId] };
      target.recent_events = [
        ...target.recent_events,
        {
          sender: currentUser.name,
          type: "DEBATE_SPEECH",
          text: chatInput,
          timestamp: Date.now()
        }
      ];
      return { ...prev, [currentLobbyId]: target };
    });
    setChatInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f1422] border border-slate-700 rounded-xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>EPOCH NEXUS — REAL-TIME MULTIPLAYER CONCLAVE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                  WebSocket Live
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Synchronous Multi-Delegate Deliberation & Quadratic Consensus Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Lobby Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setCurrentLobbyId("agora-room-01")}
                className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
                  currentLobbyId === "agora-room-01" ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>Athenian Pnyx</span>
              </button>
              <button
                onClick={() => setCurrentLobbyId("geneva-room-01")}
                className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
                  currentLobbyId === "geneva-room-01" ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>UN Treaty Chamber</span>
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

        {/* Chamber Info Bar */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-300">{activeLobby.title}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{activeLobby.topic}</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="text-cyan-400 flex items-center gap-1">
              <Shield className="w-3 h-3" /> Voice Credits: <strong className="text-white">{voiceCredits}</strong>
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
          {/* Deliberation Chat & Feed */}
          <div className="lg:col-span-2 flex flex-col bg-slate-950/60 rounded-lg border border-slate-800 overflow-hidden">
            {/* Consensus Progress Bar */}
            <div className="p-3 bg-slate-900/80 border-b border-slate-800">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-bold text-slate-300 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-amber-400" /> Quorum Progress:
                </span>
                <span className={`font-mono font-bold ${activeLobby.consensus_reached ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {activeLobby.total_yes_votes} / {activeLobby.required_quorum} Votes Required
                  {activeLobby.consensus_reached && " (✓ RATIFIED)"}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (activeLobby.total_yes_votes / activeLobby.required_quorum) * 100)}%` }}
                />
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(50, (activeLobby.total_no_votes / activeLobby.required_quorum) * 100)}%` }}
                />
              </div>
            </div>

            {/* Live Message Feed */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs">
              {activeLobby.recent_events.map((evt, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded border ${
                    evt.type === 'VOTE_CAST'
                      ? 'bg-cyan-950/30 border-cyan-800/50 text-cyan-200'
                      : 'bg-slate-900/80 border-slate-800 text-slate-200'
                  }`}
                >
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="font-bold text-amber-300">{evt.sender}</span>
                    <span className="font-mono">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p>{evt.text}</p>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Address the delegate assembly or propose an amendment..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200"
              />
              <button
                onClick={handleSendMessage}
                className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Speak</span>
              </button>
            </div>
          </div>

          {/* Connected Delegates & Voting Controls */}
          <div className="flex flex-col gap-3">
            {/* Quadratic Vote Dispatcher */}
            <div className="bg-slate-900/90 rounded-lg border border-slate-800 p-3 text-xs space-y-2.5">
              <div className="font-bold text-amber-300 flex items-center justify-between">
                <span>⚡ Quadratic Vote Dispatch</span>
                <span className="font-mono text-[10px] text-cyan-300">Cost = V²</span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Vote Multiplier (V):</span>
                  <span className="font-mono font-bold text-white">{voteCount} Votes</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={voteCount}
                  onChange={(e) => setVoteCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>Quadratic Cost:</span>
                  <span className="font-mono font-bold text-amber-400">{quadraticCost} Voice Credits</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleCastVote('YES')}
                  className="py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Aye ({voteCount})</span>
                </button>
                <button
                  onClick={() => handleCastVote('NO')}
                  className="py-2 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow transition"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Nay ({voteCount})</span>
                </button>
              </div>
            </div>

            {/* Active Delegate Roster */}
            <div className="flex-1 bg-slate-900/90 rounded-lg border border-slate-800 p-3 text-xs flex flex-col overflow-hidden">
              <div className="font-bold text-slate-300 mb-2 flex items-center justify-between pb-1 border-b border-slate-800">
                <span>DELEGATE ROSTER</span>
                <span className="text-[10px] text-emerald-400 font-mono">{activeLobby.delegates.length} Connected</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5">
                {activeLobby.delegates.map((d) => (
                  <div
                    key={d.delegate_id}
                    className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{d.avatar}</span>
                      <div>
                        <div className="font-bold text-slate-200 text-[11px]">{d.name}</div>
                        <div className="text-[9.5px] text-slate-400">{d.role} • {d.nation}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-[10px]">
                      <div className="text-cyan-300 font-bold">{d.votes_cast} V</div>
                      <div className="text-slate-500">{d.voice_credits_remaining} cr</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Epoch Nexus Academy • Multilateral Consensus Protocol</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Leave Chamber
          </button>
        </div>
      </div>
    </div>
  );
};
