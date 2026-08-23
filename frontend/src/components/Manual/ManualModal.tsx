import React, { useState } from 'react';
import { X, BookOpen, Landmark, Cpu, Award, Shield, Compass, Factory, Globe2, Users } from 'lucide-react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'track1' | 'track2' | 'track3' | 'track4' | 'architecture' | 'security' | 'multiplayer' | 'educator'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f1422] border border-slate-700 rounded-xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-600 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>EPOCH NEXUS ACADEMY — OFFICIAL MANUAL</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  v1.0.0
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Tri-Pillar Curriculum Field Guide: History, Civics & Codecraft</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar + Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Nav Sidebar */}
          <div className="w-60 bg-slate-950/60 border-r border-slate-800 p-3 space-y-1 overflow-y-auto text-xs">
            <div className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1">Table of Contents</div>
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full text-left px-2.5 py-2 rounded font-medium flex items-center gap-2 transition ${
                activeSection === 'overview' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>1. Tri-Pillar Overview</span>
            </button>

            <button
              onClick={() => setActiveSection('track1')}
              className={`w-full text-left px-2.5 py-2 rounded font-medium flex items-center gap-2 transition ${
                activeSection === 'track1' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>2. Track 1: Antiquity & Logic</span>
            </button>

            <button
              onClick={() => setActiveSection('track2')}
              className={`w-full text-left px-2.5 py-2 rounded font-medium flex items-center gap-2 transition ${
                activeSection === 'track2' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>3. Track 2: Discovery & Crypto</span>
            </button>

            <button
              onClick={() => setActiveSection('track3')}
              className={`w-full text-left px-2.5 py-2 rounded font-medium flex items-center gap-2 transition ${
                activeSection === 'track3' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Factory className="w-4 h-4 text-amber-400" />
              <span>4. Track 3: Industrial Loops</span>
            </button>

            <button
              onClick={() => setActiveSection('track4')}
              className={`w-full text-left px-2.5 py-2 rounded font-medium flex items-center gap-2 transition ${
                activeSection === 'track4' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Globe2 className="w-4 h-4 text-amber-400" />
              <span>5. Track 4: Modern Web3 Civics</span>
            </button>

            <button
              onClick={() => setActiveSection('architecture')}
              className={`w-full text-left px-2.5 py-2 rounded font-medium flex items-center gap-2 transition ${
                activeSection === 'architecture' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>6. System Architecture</span>
            </button>

            <button
              onClick={() => setActiveSection('security')}
              className={`w-full text-left px-2.5 py-2 rounded font-medium flex items-center gap-2 transition ${
                activeSection === 'security' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4 text-rose-400" />
              <span>7. SOC2/FERPA & 5K+ Scale</span>
            </button>

            <button
              onClick={() => setActiveSection('multiplayer')}
              className={`w-full text-left px-2.5 py-2 rounded font-medium flex items-center gap-2 transition ${
                activeSection === 'multiplayer' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>8. Multiplayer & Standards</span>
            </button>

            <button
              onClick={() => setActiveSection('educator')}
              className={`w-full text-left px-2.5 py-2 rounded font-medium flex items-center gap-2 transition ${
                activeSection === 'educator' ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>9. Educator & L2 Badging</span>
            </button>
          </div>

          {/* Section Body */}
          <div className="flex-1 p-6 overflow-y-auto text-slate-300 text-xs space-y-4 leading-relaxed font-sans">
            {activeSection === 'overview' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-amber-300">1. Executive Overview & Tri-Pillar Philosophy</h3>
                <p>
                  <strong>Epoch Nexus Academy</strong> is an immersive educational simulation environment uniting three essential disciplines:
                </p>
                <div className="grid grid-cols-3 gap-2.5 my-3">
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-blue-900/40">
                    <div className="font-bold text-blue-400 text-xs mb-1">🏛️ World History</div>
                    <p className="text-[11px] text-slate-400">Chronological inflection points from Classical Athens to Renaissance navigation, Victorian industrialization, and 21st-century digital diplomacy.</p>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-amber-900/40">
                    <div className="font-bold text-amber-400 text-xs mb-1">⚖️ Political Science & Civics</div>
                    <p className="text-[11px] text-slate-400">Institutional mechanics: Quorum constraints, Tribunician Veto, checks and balances, collective action, and Quadratic Voting.</p>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-lg border border-emerald-900/40">
                    <div className="font-bold text-emerald-400 text-xs mb-1">💻 STEM Computer Science</div>
                    <p className="text-[11px] text-slate-400">Computational thinking: Boolean gates, ciphers & string algorithms, Object-Oriented simulation loops, and decentralized consensus smart contracts.</p>
                  </div>
                </div>
                <p>
                  Students interact directly with historical simulations, converse with key historical leaders in branching dialogue trees, and write Python/JavaScript code that alters simulation states in real-time.
                </p>
              </div>
            )}

            {activeSection === 'track1' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-amber-300">2. Track 1: Classical Antiquity & Logic (508 BCE – 44 BCE)</h3>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1">Civic Core: Direct Democracy vs Roman Senate</div>
                  <p className="text-[11px] text-slate-400">
                    In ancient Athens, the <em>Ekklesia</em> met upon the Pnyx hill where a strict quorum of 6,000 citizens was mandatory to validate decrees. To safeguard democracy against emerging tyrants, citizens cast broken pottery shards (<em>ostraka</em>) to ostracize factional leaders. Meanwhile, Roman plebeians elected Tribunes with the absolute power of <code>VETO</code> ("I forbid") to protect the citizenry from patrician consuls.
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1">Technical Mastery: Boolean Logic & Conditionals</div>
                  <p className="text-[11px] text-slate-400">
                    Students implement <code>tally_civic_vote(votes, quorum, veto_active)</code> and <code>evaluate_ostracism(shard_votes, total_threshold)</code> using compound Boolean gates (<code>if/elif/else</code>, <code>and</code>, <code>or</code>, <code>not</code>).
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'track2' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-amber-300">3. Track 2: The Age of Discovery & Cryptography (1453 CE – 1600 CE)</h3>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1">Civic Core: Trade Treaties, Tariffs & Espionage</div>
                  <p className="text-[11px] text-slate-400">
                    Following the fall of Constantinople in 1453, Venetian doges and Portuguese caravels navigated Mediterranean and Indian Ocean routes. Maritime diplomacy was maintained via encrypted dispatches to protect fleet movements from rival merchant guilds and Ottoman corsairs.
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1">Technical Mastery: Strings, ASCII & Ciphers</div>
                  <p className="text-[11px] text-slate-400">
                    Students code <code>decrypt_diplomatic_cable(ciphertext, cipher_type, key)</code> supporting Caesar shift transformations and Vigenère polyalphabetic square decryption, and optimize maritime revenue in <code>balance_trade_manifest(manifest, tariffs)</code>.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'track3' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-amber-300">4. Track 3: The Industrial & Digital Revolutions (1780 CE – 1900 CE)</h3>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1">Civic Core: Labor Movements & Parliamentary Reform</div>
                  <p className="text-[11px] text-slate-400">
                    The introduction of steam power concentrated labor in urban centers. Early factory conditions sparked unrest, prompting reformer Robert Owen and pioneer Ada Lovelace to advocate for legislative limits—culminating in the Factory Acts and the 8-hour workday.
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1">Technical Mastery: OOP & Simulation Loops</div>
                  <p className="text-[11px] text-slate-400">
                    Students build the <code>IndustrialEconomySim</code> class, encapsulating capital, daily output, wage curves, worker satisfaction, and strike probabilities across continuous <code>tick()</code> cycles.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'track4' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-amber-300">5. Track 4: Modern Governance & Decentralized Systems (1945 CE – 2030+ CE)</h3>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1">Civic Core: Multilateral Treaties & Quadratic Democracy</div>
                  <p className="text-[11px] text-slate-400">
                    Modern multilateral bodies like the UN and decentralized communities face the tragedy of the commons and majority tyranny. Quadratic voting grants sovereign delegates voice credit budgets, allowing them to allocate strong preferences to critical clauses.
                  </p>
                </div>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1">Technical Mastery: Smart Contracts & Quadratic Cost (V²)</div>
                  <p className="text-[11px] text-slate-400">
                    Students implement the <code>QuadraticVotingProtocol</code> class, enforcing budget constraints, calculating quadratic costs (Cost = Votes²), and validating consensus thresholds for international treaty ratification.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'architecture' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-cyan-300">6. System Architecture & Technical Specifications</h3>
                <div className="bg-slate-950 p-3 rounded border border-slate-800 font-mono text-[11px] text-cyan-200">
                  <pre>{`[ Frontend: React 18 / Vite / Monaco / 2D Canvas ]
                     │  (HTTPS / WSS)
     [ API Gateway / FastAPI Microservices ]
  ├── [ Simulation & Narrative Engine ] ── [ Session Cache: Redis ]
  ├── [ Code Sandbox Evaluator (Wasm) ]
  ├── [ User & Progress Service ] ──────── [ Database: PostgreSQL ]
  └── [ Web3 Minting / Credentialing ] ─── [ Smart Contracts (L2) ]`}</pre>
                </div>
                <p>
                  <strong>Dual Sandboxing</strong>: Instant client-side execution via Pyodide WebAssembly in Web Workers combined with a robust backend FastAPI sandbox fallback.
                </p>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-rose-400">7. Enterprise Hardening, 5,000+ Concurrency & SOC2 / FERPA Privacy</h3>
                <p>
                  Epoch Nexus Academy incorporates institutional-grade security and compliance controls for district-wide and campus-wide deployments:
                </p>
                <div className="grid grid-cols-2 gap-2.5 my-2">
                  <div className="bg-slate-900/90 p-3 rounded border border-rose-900/40">
                    <div className="font-bold text-rose-300 mb-1">🛡️ AST Sandbox Static Guard</div>
                    <p className="text-[11px] text-slate-400">Every submission undergoes Python AST security traversal, blocking <code>__subclasses__</code> introspection, import traversal, eval/exec attacks, and loop nesting bombs before execution.</p>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded border border-cyan-900/40">
                    <div className="font-bold text-cyan-300 mb-1">⚡ 5,000+ Concurrent Scalability</div>
                    <p className="text-[11px] text-slate-400">Hybrid Tier-1 Pyodide Wasm client offload (96%+ of test cycles) combined with backend Async Worker Queues and Token Bucket rate limiters per school district.</p>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded border border-amber-900/40">
                    <div className="font-bold text-amber-300 mb-1">🔒 FERPA (34 CFR Part 99) Privacy</div>
                    <p className="text-[11px] text-slate-400">Field-level AES-256-GCM encryption at rest, deterministic non-reversible pseudonyms for leaderboards, and automated Right to Erasure / Data Purge APIs.</p>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded border border-emerald-900/40">
                    <div className="font-bold text-emerald-300 mb-1">📜 SOC2 Hash-Chained Audit Trail</div>
                    <p className="text-[11px] text-slate-400">Every code evaluation, grade change, and credential minting is cryptographically hash-chained (SHA-256) into a tamper-evident audit ledger.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'multiplayer' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-cyan-400">8. Real-time Multiplayer Deliberation & Standards Assessment</h3>
                <p>
                  Epoch Nexus Academy transforms civic education into a synchronous multiplayer arena backed by verifiable academic standards:
                </p>
                <div className="grid grid-cols-2 gap-2.5 my-2">
                  <div className="bg-slate-900/90 p-3 rounded border border-cyan-900/40">
                    <div className="font-bold text-cyan-300 mb-1">🌐 Real-Time WebSockets Conclave</div>
                    <p className="text-[11px] text-slate-400">Synchronous multi-delegate chambers (Athenian Pnyx, UN Council) with live presence, speech feeds, and collective quorum progress bars.</p>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded border border-amber-900/40">
                    <div className="font-bold text-amber-300 mb-1">⚡ Quadratic Voting (Cost = V²)</div>
                    <p className="text-[11px] text-slate-400">Students cast weighted votes using voice credit budgets, protecting minority viewpoints and curbing majority tyranny in multilateral treaties.</p>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded border border-emerald-900/40">
                    <div className="font-bold text-emerald-300 mb-1">📊 Academic Standards Matrix</div>
                    <p className="text-[11px] text-slate-400">Direct alignment to AP European History, AP US Government, AP Computer Science Principles, AP CSA, and CSTA K-12 standards.</p>
                  </div>
                  <div className="bg-slate-900/90 p-3 rounded border border-rose-900/40">
                    <div className="font-bold text-rose-300 mb-1">🎓 LMS Gradebook Pipeline</div>
                    <p className="text-[11px] text-slate-400">District-level cohort analytics, student misconception diagnostic heatmaps, and one-click gradebook CSV exports for Canvas and Google Classroom.</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'educator' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-emerald-300">7. Educator Guide & Verifiable L2 Credentials</h3>
                <p>
                  Epoch Nexus Academy maps directly to high school and collegiate curricula (AP European History, AP US Government, AP Computer Science Principles, and Intro to Political Philosophy).
                </p>
                <div className="bg-slate-900 p-3 rounded border border-slate-800">
                  <div className="font-semibold text-slate-200 mb-1">Soulbound ERC-5192 Badging</div>
                  <p className="text-[11px] text-slate-400">
                    Upon passing test suites with 100% precision, an immutable cryptographic SHA-256 proof hash is minted as a non-transferable Soulbound credential on Polygon/Arbitrum. Students can export their verifiable credential portfolio directly into academic transcripts.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Epoch Nexus Academy • Tri-Pillar Education</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Manual
          </button>
        </div>
      </div>
    </div>
  );
};
