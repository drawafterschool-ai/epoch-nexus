from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class StudentProfile(BaseModel):
    id: str = Field(default="student-001")
    name: str = Field(default="Hypatia of Alexandria")
    pseudonym: str = Field(default="Scholar-HYPATIA-8F")
    civic_score: int = Field(default=120)
    current_level: str = Field(default="Civic Architect I")
    institution: str = Field(default="Agora Academy of Sciences")
    tenant_id: str = Field(default="tenant-district-01")
    wallet_address: Optional[str] = Field(default="0x71C...49A")
    completed_tracks: List[int] = Field(default_factory=list)
    ferpa_purged: bool = Field(default=False)

class TrackInfo(BaseModel):
    id: int
    title: str
    era: str
    historical_lore: str
    civics_focus: str
    stem_focus: str
    language: str
    starter_code: str
    solution_code: str
    hints: List[str]

class TestCaseResult(BaseModel):
    name: str
    passed: bool
    expected: Any
    actual: Any
    error: Optional[str] = None
    execution_time_ms: float

class CodeEvaluationRequest(BaseModel):
    track_id: int
    language: str = "python"
    code: str
    student_id: Optional[str] = "student-001"
    tenant_id: Optional[str] = "tenant-district-01"
    custom_test_cases: Optional[List[Dict[str, Any]]] = None

class CodeEvaluationResponse(BaseModel):
    success: bool
    track_id: int
    total_tests: int
    passed_tests: int
    results: List[TestCaseResult]
    stdout: str
    stderr: Optional[str] = None
    simulation_state: Dict[str, Any]
    credential_eligible: bool
    verification_hash: Optional[str] = None
    security_scan: Optional[Dict[str, Any]] = None

class Web3MintRequest(BaseModel):
    student_address: str
    track_id: int
    track_title: str
    score: int
    verification_hash: str

class Web3MintResponse(BaseModel):
    success: bool
    tx_hash: str
    token_id: int
    network: str
    contract_address: str
    explorer_url: str
    metadata_uri: str

# =========================================================================
# INFINITE TRACK STUDIO & AI GENERATOR SCHEMAS
# =========================================================================

class TrackGenerationRequest(BaseModel):
    prompt: str = Field(..., example="Ancient Egypt Nile Flooding Hydraulics")
    difficulty: str = Field(default="Intermediate", example="Beginner | Intermediate | Advanced")
    language: str = Field(default="python", example="python | javascript")
    target_standards: Optional[List[str]] = Field(default_factory=list)

class CommunityTrackSummary(BaseModel):
    id: int
    title: str
    era: str
    author: str
    rating: float
    forks_count: int
    badge_icon: str
    civics_focus: str
    stem_focus: str

# =========================================================================
# MULTIPLAYER & REAL-TIME WEBSOCKET MODELS
# =========================================================================

class DelegatePresence(BaseModel):
    delegate_id: str
    name: str
    role: str # "Athenian Orator", "Plebeian Tribune", "Venetian Ambassador", "UN Delegate"
    nation: str
    avatar: str
    votes_cast: int = 0
    voice_credits_remaining: int = 100

class MultiplayerLobbyState(BaseModel):
    lobby_id: str
    title: str
    era: str
    topic: str
    active_delegates_count: int
    required_quorum: int
    total_yes_votes: int
    total_no_votes: int
    consensus_reached: bool
    delegates: List[DelegatePresence]
    recent_events: List[Dict[str, Any]]

class DelegateVoteEvent(BaseModel):
    lobby_id: str
    delegate_id: str
    vote_type: str # "YES", "NO", "VETO", "AMEND"
    votes_count: int = 1
    voice_credit_cost: int = 1

# =========================================================================
# INSTITUTIONAL ASSESSMENT & STANDARDS MODELS
# =========================================================================

class StandardItem(BaseModel):
    code: str # e.g. "AP-EURO-4.2", "AP-GOV-1.3", "AP-CSP-3.1"
    course: str # "AP European History", "AP US Government", "AP CSP", "AP CSA", "CSTA K-12"
    description: str
    mastery_rate_pct: float
    mapped_tracks: List[int]

class GradebookStudentRow(BaseModel):
    student_id: str
    name: str
    pseudonym: str
    institution: str
    completed_tracks: List[int]
    civic_mastery_points: int
    overall_rubric_pct: float
    time_on_task_minutes: int
    last_active: str
    credential_badge_status: str

class StandardsCompetencyReport(BaseModel):
    district_name: str
    total_students_enrolled: int
    active_cohorts: int
    average_civic_score: float
    standards: List[StandardItem]
    top_misconceptions: List[Dict[str, Any]]

# =========================================================================
# EDUCATOR & SCENARIO SCHEMAS
# =========================================================================

class GradingCriterion(BaseModel):
    name: str
    weight_pct: float = 25.0
    description: str
    mastery_threshold: str = "Passes all algorithmic assertions with clean execution"

class GradingRubric(BaseModel):
    id: str = "rubric-default"
    title: str = "Standard STEM & Civics Algorithmic Mastery Rubric"
    criteria: List[GradingCriterion] = Field(default_factory=lambda: [
        GradingCriterion(name="Civic Logic & Constraints", weight_pct=30.0, description="Correctly models historical legal and procedural constraints"),
        GradingCriterion(name="Algorithmic Correctness", weight_pct=40.0, description="Passes all functional test vectors and edge cases"),
        GradingCriterion(name="Code Quality & Structure", weight_pct=15.0, description="Clean variable naming, robust state management, and idiomatic logic"),
        GradingCriterion(name="Equilibrium & Simulation Stability", weight_pct=15.0, description="Maintains simulation stability and avoids catastrophic failures")
    ])

class CustomScenario(BaseModel):
    id: str
    title: str
    subtitle: str
    era: str
    historical_figure: str
    civics_focus: str
    stem_focus: str
    lore: str
    instructions: List[str]
    starter_code: str
    solution_code: str
    hints: List[str]
    rubric: GradingRubric
    created_by: str = "INSTRUCTOR-001"
    created_at: float = Field(default_factory=lambda: datetime.now().timestamp())

class ClassroomStudentProgress(BaseModel):
    student_id: str
    name: str
    pseudonym: str
    active_track: int
    current_status: str
    civic_score: int
    tests_passed: str
    rubric_score_pct: float
    last_submission_time: float
    feedback_notes: Optional[str] = None

class TeacherFeedbackDispatch(BaseModel):
    student_id: str
    scenario_id: str
    rubric_override_score: Optional[float] = None
    teacher_note: str
    awarded_bonus_points: int = 0

class FERPAPurgeRequest(BaseModel):
    student_id: str
    tenant_id: str
    reason: str = "Parent / Student Right to Erasure Request"
    requested_by: str = "DISTRICT_ADMIN"

class FERPAPurgeResponse(BaseModel):
    success: bool
    student_id: str
    status: str
    anonymized_pseudonym: str
    audit_hash: str

class ConcurrencyMetricsResponse(BaseModel):
    max_concurrent_workers: int
    active_workers: int
    available_worker_slots: int
    total_jobs_submitted: int
    total_jobs_completed: int
    total_rate_limited: int
    p95_latency_ms: float
    estimated_capacity_supported_clients: int
    hybrid_wasm_client_offload_pct: float
    status: str
