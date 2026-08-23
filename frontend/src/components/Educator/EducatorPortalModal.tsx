import React, { useState } from 'react';
import { X, GraduationCap, PlusCircle, Users, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export interface ClassroomStudentProgress {
  student_id: string;
  name: string;
  pseudonym: string;
  active_track: number;
  current_status: 'PASSED' | 'EVALUATING' | 'STRUGGLING';
  civic_score: number;
  tests_passed: string;
  rubric_score_pct: number;
  last_submission_time: number;
  feedback_notes?: string;
}

interface EducatorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeployCustomScenario?: (scenario: any) => void;
}

export const EducatorPortalModal: React.FC<EducatorPortalModalProps> = ({
  isOpen,
  onClose,
  onDeployCustomScenario
}) => {
  const [activeTab, setActiveTab] = useState<'builder' | 'classroom'>('builder');

  // Custom Scenario Builder Form State
  const [title, setTitle] = useState("The Hanseatic League Maritime Guilds");
  const [subtitle] = useState("Northern European Trade Charters & Monopolies");
  const [era, setEra] = useState("1356 CE – 1669 CE (Baltic & North Sea)");
  const [figure, setFigure] = useState("Alderman of the Steelyard");
  const [civicsFocus, setCivicsFocus] = useState("Chartered mercantile assemblies, toll exemptions, and trade boycotts.");
  const [stemFocus, setStemFocus] = useState("Hash tables, tariff lookups, and graph route optimization.");
  const [lore, setLore] = useState("The Hanseatic League united guild cities across Lübeck, Hamburg, and Danzig. Merchants utilized decentralized kontor networks to enforce trade embargoes against oppressive feudal princes.");
  const [instructions] = useState("1. Implement calculate_guild_tariffs(goods, city_charter)\n2. Implement resolve_trade_boycott(member_cities, embargo_active)");
  const [starterCode, setStarterCode] = useState("def calculate_guild_tariffs(goods: dict, charter: str) -> float:\n    # TODO: Implement Hanseatic guild tariff rules\n    pass\n");
  const [solutionCode, setSolutionCode] = useState("def calculate_guild_tariffs(goods: dict, charter: str) -> float:\n    rate = 0.05 if charter == 'Hanseatic' else 0.15\n    return round(sum(goods.values()) * rate, 2)\n");

  // Rubric weights
  const [rubricWeights] = useState({
    civicLogic: 30,
    correctness: 40,
    codeQuality: 15,
    stability: 15
  });

  // Mock Live Classroom Roster
  const [roster, setRoster] = useState<ClassroomStudentProgress[]>([
    {
      student_id: "student-001",
      name: "Hypatia of Alexandria",
      pseudonym: "Scholar-HYPATIA-8F",
      active_track: 3,
      current_status: "PASSED",
      civic_score: 320,
      tests_passed: "4/4",
      rubric_score_pct: 98.0,
      last_submission_time: Date.now() - 1000 * 60 * 5,
      feedback_notes: "Excellent modeling of non-linear worker satisfaction curves."
    },
    {
      student_id: "student-002",
      name: "Marcus Tullius Cicero",
      pseudonym: "Scholar-CICERO-3D",
      active_track: 1,
      current_status: "PASSED",
      civic_score: 200,
      tests_passed: "5/5",
      rubric_score_pct: 95.0,
      last_submission_time: Date.now() - 1000 * 60 * 12,
      feedback_notes: "Strong Tribunician veto precedence handling."
    },
    {
      student_id: "student-003",
      name: "Ada King Lovelace",
      pseudonym: "Scholar-ADA-99",
      active_track: 3,
      current_status: "EVALUATING",
      civic_score: 410,
      tests_passed: "3/4",
      rubric_score_pct: 88.0,
      last_submission_time: Date.now() - 1000 * 60 * 2,
      feedback_notes: "Optimizing Bernoulli polynomial sequence."
    },
    {
      student_id: "student-004",
      name: "Niccolò Machiavelli",
      pseudonym: "Scholar-NICCOLO-12",
      active_track: 2,
      current_status: "STRUGGLING",
      civic_score: 110,
      tests_passed: "1/3",
      rubric_score_pct: 65.0,
      last_submission_time: Date.now() - 1000 * 60 * 20,
      feedback_notes: "Needs assistance with Vigenère keyword modulo arithmetic."
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<string>("student-004");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  if (!isOpen) return null;

  const handlePublishScenario = () => {
    const customObj = {
      id: 99,
      title: title,
      subtitle: subtitle,
      era: era,
      historicalFigure: { name: figure, title: "Historical Advisor", avatar: "📜" },
      civicsFocus: civicsFocus,
      stemFocus: stemFocus,
      lore: lore,
      instructions: instructions.split('\n').filter(Boolean),
      starterCode: starterCode,
      solutionCode: solutionCode,
      hints: ["Verify tariff rates against city charters.", "Round monetary floats to 2 decimal places."],
      dialogue: [{
        speaker: figure,
        avatar: "📜",
        role: "Guildmaster",
        era: era,
        text: "The merchants of the Hanseatic League require algorithmic certainty in our toll agreements.",
        options: [{ label: "Enforce uniform member tariffs.", feedback: "The Kontor approves." }]
      }],
      badgeName: "Hanseatic Guild Logician",
      badgeIcon: "⚓"
    };

    if (onDeployCustomScenario) {
      onDeployCustomScenario(customObj);
    }
    alert(`Scenario '${title}' deployed successfully to active student terminal!`);
  };

  const handleSendFeedback = () => {
    setFeedbackSent(true);
    setTimeout(() => setFeedbackSent(false), 2500);
    setRoster(prev => prev.map(s => s.student_id === selectedStudent ? { ...s, feedback_notes: feedbackText } : s));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f1422] border border-slate-700 rounded-xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>EPOCH NEXUS — TEACHER ORCHESTRATION SUITE</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  Educator Portal
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Custom Scenario Builder, Live Classroom Telemetry & Instant Rubric Grading</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('builder')}
                className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'builder' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Scenario Builder</span>
              </button>
              <button
                onClick={() => setActiveTab('classroom')}
                className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'classroom' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Live Classroom ({roster.length})</span>
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
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'builder' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold">Scenario Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold">Historical Era / Date</label>
                  <input
                    type="text"
                    value={era}
                    onChange={(e) => setEra(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold">Historical Advisor Persona</label>
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
                  <label className="text-[11px] text-blue-400 font-bold">🏛️ Political Science & Civics Framework</label>
                  <textarea
                    rows={2}
                    value={civicsFocus}
                    onChange={(e) => setCivicsFocus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-amber-400 font-bold">💻 STEM Coding & Algorithm Mastery</label>
                  <textarea
                    rows={2}
                    value={stemFocus}
                    onChange={(e) => setStemFocus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-bold">Historical Narrative Lore</label>
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
                  <label className="text-[11px] text-slate-400 font-bold">Student Starter Code Template (Python)</label>
                  <textarea
                    rows={5}
                    value={starterCode}
                    onChange={(e) => setStarterCode(e.target.value)}
                    className="w-full bg-slate-950 font-mono text-[11px] border border-slate-800 rounded p-2 text-blue-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 font-bold">Reference Solution Code (Grading Vector)</label>
                  <textarea
                    rows={5}
                    value={solutionCode}
                    onChange={(e) => setSolutionCode(e.target.value)}
                    className="w-full bg-slate-950 font-mono text-[11px] border border-slate-800 rounded p-2 text-emerald-200"
                  />
                </div>
              </div>

              {/* Instant Grading Rubric Matrix Builder */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-amber-300">
                  <span>📊 Automated Rubric Weightings Matrix</span>
                  <span className="text-[10px] text-slate-400">Total: 100%</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px]">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-slate-400">Civic Logic ({rubricWeights.civicLogic}%)</div>
                    <div className="text-slate-300 mt-1">Legal constraints & checks</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-slate-400">Correctness ({rubricWeights.correctness}%)</div>
                    <div className="text-slate-300 mt-1">Test assertion assertions</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-slate-400">Code Quality ({rubricWeights.codeQuality}%)</div>
                    <div className="text-slate-300 mt-1">Idiomatic naming & state</div>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <div className="text-slate-400">Sim Stability ({rubricWeights.stability}%)</div>
                    <div className="text-slate-300 mt-1">Equilibrium & zero-crashes</div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={handlePublishScenario}
                  className="px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Custom Scenario to Terminal</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'classroom' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              {/* Roster list */}
              <div className="lg:col-span-2 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300 mb-1">
                  <span>ACTIVE STUDENT ROSTER (DISTRICT 01)</span>
                  <span className="text-[11px] text-emerald-400">4 Active Terminals</span>
                </div>

                <div className="space-y-1.5">
                  {roster.map((s) => (
                    <div
                      key={s.student_id}
                      onClick={() => setSelectedStudent(s.student_id)}
                      className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                        selectedStudent === s.student_id
                          ? 'bg-blue-950/40 border-blue-500 shadow-md'
                          : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100">{s.name}</span>
                          <span className="font-mono text-[10px] text-slate-400">({s.pseudonym})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Track {s.active_track} • Civic Score: <span className="text-amber-300 font-bold">{s.civic_score} PTS</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-mono font-bold text-emerald-400">{s.rubric_score_pct}%</div>
                          <div className="text-[10px] text-slate-400">{s.tests_passed} Tests</div>
                        </div>

                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.current_status === 'PASSED'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : s.current_status === 'EVALUATING'
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {s.current_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Student Feedback & Rubric Inspector */}
              <div className="bg-slate-900/90 rounded-lg border border-slate-800 p-3.5 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-300 mb-2 pb-1 border-b border-slate-800 flex items-center justify-between">
                    <span>Student Assessment & Feedback</span>
                    <span className="font-mono text-[10px] text-slate-400">{selectedStudent}</span>
                  </div>

                  {/* Rubric metrics breakdown */}
                  <div className="space-y-1.5 mb-3 text-[11px]">
                    <div className="flex justify-between text-slate-300">
                      <span>Civic Logic Accuracy:</span>
                      <span className="font-mono text-emerald-400 font-bold">30 / 30</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Algorithmic Tests:</span>
                      <span className="font-mono text-emerald-400 font-bold">40 / 40</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>State Encapsulation:</span>
                      <span className="font-mono text-amber-400 font-bold">14 / 15</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Simulation Equilibrium:</span>
                      <span className="font-mono text-emerald-400 font-bold">14 / 15</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-300">Teacher Direct Feedback Dispatch</label>
                    <textarea
                      rows={4}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="Enter pedagogical guidance, historical context hints, or rubric feedback..."
                      className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSendFeedback}
                    className="w-full py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition"
                  >
                    {feedbackSent ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        <span>Feedback Dispatched to Student!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Feedback to Terminal</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Epoch Nexus Academy • Instructor Console</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
