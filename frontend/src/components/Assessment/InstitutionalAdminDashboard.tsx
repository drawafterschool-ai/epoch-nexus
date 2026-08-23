import React, { useState } from 'react';
import { X, BarChart3, BookOpen, Download, Search, AlertTriangle, Users } from 'lucide-react';

interface StandardItem {
  code: string;
  course: string;
  description: string;
  mastery_rate_pct: number;
  mapped_tracks: number[];
}

interface StudentRow {
  student_id: string;
  name: string;
  pseudonym: string;
  institution: string;
  completed_tracks: number[];
  civic_mastery_points: number;
  overall_rubric_pct: number;
  time_on_task_minutes: number;
  last_active: string;
  credential_badge_status: string;
}

interface InstitutionalAdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstitutionalAdminDashboard: React.FC<InstitutionalAdminDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'standards' | 'gradebook' | 'diagnostics'>('standards');
  const [searchTerm, setSearchTerm] = useState<string>("");

  const standards: StandardItem[] = [
    {
      code: "AP-EURO-4.2",
      course: "AP European History",
      description: "Commercial Revolution, mercantilism, and maritime trade balance.",
      mastery_rate_pct: 94.5,
      mapped_tracks: [2]
    },
    {
      code: "AP-GOV-1.3",
      course: "AP US Government & Politics",
      description: "Checks and balances, voting mechanisms, minority rights, and checks on majority tyranny.",
      mastery_rate_pct: 96.2,
      mapped_tracks: [1, 4]
    },
    {
      code: "AP-CSP-3.1",
      course: "AP Computer Science Principles",
      description: "Variables, assignments, Boolean logic, truth tables, and algorithm abstractions.",
      mastery_rate_pct: 97.8,
      mapped_tracks: [1, 2, 3, 4]
    },
    {
      code: "AP-CSA-2.4",
      course: "AP Computer Science A",
      description: "Object-Oriented class design, encapsulation, and discrete simulation loops.",
      mastery_rate_pct: 91.0,
      mapped_tracks: [3, 4]
    },
    {
      code: "CSTA-3A-AP-14",
      course: "CSTA K-12 CS Standards",
      description: "Construct solutions using compound conditionals, OOP methods, and security safeguards.",
      mastery_rate_pct: 95.0,
      mapped_tracks: [1, 2, 3, 4]
    }
  ];

  const students: StudentRow[] = [
    {
      student_id: "student-001",
      name: "Hypatia of Alexandria",
      pseudonym: "Scholar-HYPATIA-8F",
      institution: "Agora Academy of Sciences",
      completed_tracks: [1, 2, 3],
      civic_mastery_points: 320,
      overall_rubric_pct: 98.0,
      time_on_task_minutes: 145,
      last_active: "2026-08-22 19:40",
      credential_badge_status: "ISSUED_L2"
    },
    {
      student_id: "student-002",
      name: "Marcus Tullius Cicero",
      pseudonym: "Scholar-CICERO-3D",
      institution: "Agora Academy of Sciences",
      completed_tracks: [1],
      civic_mastery_points: 200,
      overall_rubric_pct: 95.0,
      time_on_task_minutes: 90,
      last_active: "2026-08-22 19:15",
      credential_badge_status: "ISSUED_L2"
    },
    {
      student_id: "student-003",
      name: "Ada King Lovelace",
      pseudonym: "Scholar-ADA-99",
      institution: "Agora Academy of Sciences",
      completed_tracks: [1, 2, 3, 4],
      civic_mastery_points: 410,
      overall_rubric_pct: 99.5,
      time_on_task_minutes: 210,
      last_active: "2026-08-22 20:01",
      credential_badge_status: "ISSUED_L2"
    },
    {
      student_id: "student-004",
      name: "Niccolò Machiavelli",
      pseudonym: "Scholar-NICCOLO-12",
      institution: "Agora Academy of Sciences",
      completed_tracks: [1, 2],
      civic_mastery_points: 110,
      overall_rubric_pct: 82.0,
      time_on_task_minutes: 115,
      last_active: "2026-08-22 18:50",
      credential_badge_status: "PENDING_REVIEW"
    }
  ];

  if (!isOpen) return null;

  const handleExportCSV = () => {
    const headers = "Student ID,Pseudonym,Institution,Tracks Completed,Civic Mastery Points,Rubric Score,Time on Task (min),L2 Badge Status\n";
    const rows = students.map(s =>
      `"${s.student_id}","${s.pseudonym}","${s.institution}","${s.completed_tracks.join(';')}",${s.civic_mastery_points},${s.overall_rubric_pct}%,${s.time_on_task_minutes},"${s.credential_badge_status}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "EpochNexus_District_Gradebook.csv";
    a.click();
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.pseudonym.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f1422] border border-slate-700 rounded-xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>EPOCH NEXUS — INSTITUTIONAL ASSESSMENT & STANDARDS DASHBOARD</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  District Admin
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">AP Standards Alignment, Cohort Progress, and LMS Gradebook Pipeline</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('standards')}
                className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'standards' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Standards Mastery</span>
              </button>
              <button
                onClick={() => setActiveTab('gradebook')}
                className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'gradebook' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Cohort Gradebook</span>
              </button>
              <button
                onClick={() => setActiveTab('diagnostics')}
                className={`px-3 py-1 rounded font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'diagnostics' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Misconception Heatmap</span>
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
          {activeTab === 'standards' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Enrolled Scholars</div>
                  <div className="text-xl font-mono font-bold text-slate-100 mt-1">5,240</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">Across 18 Campus Cohorts</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[11px]">District Avg Civic Mastery</div>
                  <div className="text-xl font-mono font-bold text-amber-300 mt-1">286.4 PTS</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Top Decile: 400+ PTS</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[11px]">AP Standard Pass Rate</div>
                  <div className="text-xl font-mono font-bold text-emerald-400 mt-1">95.4%</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">+8.2% vs Statewide Norm</div>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[11px]">L2 Digital Credentials</div>
                  <div className="text-xl font-mono font-bold text-cyan-400 mt-1">4,812</div>
                  <div className="text-[10px] text-cyan-300 mt-0.5">Soulbound ERC-5192 Badges</div>
                </div>
              </div>

              {/* Standards Breakdown List */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-slate-300">ACADEMIC STANDARDS COMPETENCY MAPPINGS</div>
                <div className="space-y-2">
                  {standards.map((std) => (
                    <div key={std.code} className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 text-[10px]">
                            {std.code}
                          </span>
                          <span className="font-bold text-slate-200">{std.course}</span>
                          <span className="text-[10px] text-slate-400">({std.mapped_tracks.map(t => `Track ${t}`).join(', ')})</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{std.description}</p>
                      </div>

                      <div className="text-right min-w-[120px] pl-4">
                        <div className="font-mono font-bold text-emerald-400 text-sm">{std.mastery_rate_pct}%</div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div className="bg-emerald-500 h-full" style={{ width: `${std.mastery_rate_pct}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gradebook' && (
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by student name or pseudonym..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200"
                  />
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Export LMS Gradebook (CSV)</span>
                </button>
              </div>

              {/* Gradebook Table */}
              <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-950/80">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
                      <th className="p-2.5">Scholar / Pseudonym</th>
                      <th className="p-2.5">Institution</th>
                      <th className="p-2.5">Completed Tracks</th>
                      <th className="p-2.5 text-right">Civic Score</th>
                      <th className="p-2.5 text-right">Rubric %</th>
                      <th className="p-2.5 text-right">Time on Task</th>
                      <th className="p-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s) => (
                      <tr key={s.student_id} className="border-b border-slate-800/60 hover:bg-slate-900/40 transition">
                        <td className="p-2.5">
                          <div className="font-bold text-slate-200">{s.name}</div>
                          <div className="font-mono text-[9.5px] text-slate-500">{s.pseudonym}</div>
                        </td>
                        <td className="p-2.5 text-slate-400">{s.institution}</td>
                        <td className="p-2.5">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4].map(trackId => (
                              <span
                                key={trackId}
                                className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center ${
                                  s.completed_tracks.includes(trackId)
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                                }`}
                              >
                                {trackId}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-2.5 text-right font-mono font-bold text-amber-300">{s.civic_mastery_points} PTS</td>
                        <td className="p-2.5 text-right font-mono font-bold text-emerald-400">{s.overall_rubric_pct}%</td>
                        <td className="p-2.5 text-right font-mono text-slate-400">{s.time_on_task_minutes} min</td>
                        <td className="p-2.5 text-center">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold ${
                            s.credential_badge_status === 'ISSUED_L2'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {s.credential_badge_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'diagnostics' && (
            <div className="space-y-3 text-xs">
              <div className="text-xs font-bold text-slate-300">ALGORITHMIC MISCONCEPTION HEATMAP & INTERVENTION PROTOCOLS</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-950/90 p-3.5 rounded-lg border border-rose-900/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-rose-300">Vigenère Modulo Wrap-Around Arithmetic</span>
                    <span className="font-mono text-xs text-rose-400 font-bold">14.2% Error Rate</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Students frequently neglect advancing the keyword pointer only on alphabetic characters, causing shifted alignments.</p>
                  <div className="bg-slate-900 p-2 rounded text-[10px] text-amber-300 border border-slate-800">
                    <strong>Recommended Teacher Intervention:</strong> Review ASCII shift formula: <code>(ord(c) - ord('A') - k_shift) % 26</code>.
                  </div>
                </div>

                <div className="bg-slate-950/90 p-3.5 rounded-lg border border-amber-900/40 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-300">Quadratic Voice Credit Budget Overdraft</span>
                    <span className="font-mono text-xs text-amber-400 font-bold">11.5% Error Rate</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Students frequently calculate linear vote costs rather than quadratic exponentiation (Cost = V²).</p>
                  <div className="bg-slate-900 p-2 rounded text-[10px] text-amber-300 border border-slate-800">
                    <strong>Recommended Teacher Intervention:</strong> Emphasize Sybil resistance and mathematical rationale behind quadratic voting in Track 4.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Epoch Nexus Academy • District Standards Compliance Portal</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
