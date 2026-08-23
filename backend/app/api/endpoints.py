from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, Header, Query
from typing import List, Dict, Any, Optional
from app.models.schemas import (
    StudentProfile, TrackInfo, CodeEvaluationRequest, CodeEvaluationResponse,
    Web3MintRequest, Web3MintResponse, FERPAPurgeRequest, FERPAPurgeResponse,
    ConcurrencyMetricsResponse, CustomScenario, ClassroomStudentProgress, TeacherFeedbackDispatch,
    StandardsCompetencyReport, StandardItem, GradebookStudentRow,
    TrackGenerationRequest, CommunityTrackSummary
)
from app.services.tracks_data import ALL_TRACKS
from app.services.evaluator import SandboxedEvaluator
from app.services.web3_bridge import Web3BridgeService
from app.services.worker_queue import GLOBAL_QUEUE
from app.services.scenario_generator import ScenarioGeneratorEngine
from app.core.security import PrivacySecurityManager
from app.core.audit_logger import GLOBAL_AUDIT_LEDGER

router = APIRouter()

# In-memory community tracks registry
COMMUNITY_TRACKS_DB: List[Dict[str, Any]] = [
    {
        "id": 101,
        "title": "Ancient Egypt: Nile Flooding Hydraulics & Grain Quorum",
        "era": "2500 BCE – Old Kingdom Egypt",
        "author": "Archivist-Imhotep",
        "rating": 4.9,
        "forks_count": 142,
        "badge_icon": "🌾",
        "civics_focus": "Silo rationing laws, emergency drought relief quotas, and public granary taxation.",
        "stem_focus": "Integer division, state threshold matrices, and resource allocation loops."
    },
    {
        "id": 102,
        "title": "Feudal Japan: Shogunate Courier Cipher & Han Alliances",
        "era": "1603 CE – Tokugawa Edo Period",
        "author": "Shinobi-Tokaido",
        "rating": 4.8,
        "forks_count": 89,
        "badge_icon": "🏯",
        "civics_focus": "Sankin-kōtai hostage diplomacy, clan loyalty oaths, and checkpoint pass verifications.",
        "stem_focus": "Hash verification, character transposition ciphers, and dictionary lookups."
    },
    {
        "id": 103,
        "title": "Space Colonization: Artemis Lunar Resource Governance Accord",
        "era": "2050+ CE – Lunar South Pole & Deep Space",
        "author": "Artemis-Director",
        "rating": 5.0,
        "forks_count": 210,
        "badge_icon": "🚀",
        "civics_focus": "Outer Space Treaty non-appropriation, shared life-support oxygen grids, and automated dispute tribunals.",
        "stem_focus": "Linear programming, resource rate-limiters, and multi-signature quorum consensus."
    }
]

# In-memory student profiles
STUDENT_DB: Dict[str, Dict[str, Any]] = {
    "student-001": {
        "id": "student-001",
        "name": "Hypatia of Alexandria",
        "pseudonym": "Scholar-HYPATIA-8F",
        "civic_score": 120,
        "current_level": "Civic Architect I",
        "institution": "Agora Academy of Sciences",
        "tenant_id": "tenant-district-01",
        "wallet_address": "0x71C8364F3B84432aF5cFe1b7eF29A440D9e9149A",
        "completed_tracks": [],
        "ferpa_purged": False
    }
}

# In-memory custom scenarios registry
CUSTOM_SCENARIOS_DB: Dict[str, CustomScenario] = {}

# In-memory live classroom roster
CLASSROOM_ROSTER: List[Dict[str, Any]] = [
    {
        "student_id": "student-001",
        "name": "Hypatia of Alexandria",
        "pseudonym": "Scholar-HYPATIA-8F",
        "active_track": 3,
        "current_status": "PASSED",
        "civic_score": 320,
        "tests_passed": "4/4",
        "rubric_score_pct": 98.0,
        "last_submission_time": 1700000000.0,
        "feedback_notes": "Excellent modeling of non-linear worker satisfaction curves."
    },
    {
        "student_id": "student-002",
        "name": "Marcus Tullius Cicero",
        "pseudonym": "Scholar-CICERO-3D",
        "active_track": 1,
        "current_status": "PASSED",
        "civic_score": 200,
        "tests_passed": "5/5",
        "rubric_score_pct": 95.0,
        "last_submission_time": 1700000100.0,
        "feedback_notes": "Strong Tribunician veto precedence handling."
    },
    {
        "student_id": "student-003",
        "name": "Ada King Lovelace",
        "pseudonym": "Scholar-ADA-99",
        "active_track": 3,
        "current_status": "EVALUATING",
        "civic_score": 410,
        "tests_passed": "3/4",
        "rubric_score_pct": 88.0,
        "last_submission_time": 1700000200.0,
        "feedback_notes": "Optimizing Bernoulli polynomial sequence."
    },
    {
        "student_id": "student-004",
        "name": "Niccolò Machiavelli",
        "pseudonym": "Scholar-NICCOLO-12",
        "active_track": 2,
        "current_status": "STRUGGLING",
        "civic_score": 110,
        "tests_passed": "1/3",
        "rubric_score_pct": 65.0,
        "last_submission_time": 1700000300.0,
        "feedback_notes": "Needs assistance with Vigenère keyword modulo arithmetic."
    }
]

@router.get("/tracks", response_model=List[TrackInfo])
def get_all_tracks():
    return ALL_TRACKS

@router.get("/tracks/community", response_model=List[CommunityTrackSummary])
def get_community_tracks():
    return [CommunityTrackSummary(**t) for t in COMMUNITY_TRACKS_DB]

@router.post("/tracks/generate")
def generate_ai_track(req: TrackGenerationRequest):
    """
    Synthesizes a complete curriculum track based on any historical era or civics topic prompt.
    """
    new_track_id = len(ALL_TRACKS) + len(COMMUNITY_TRACKS_DB) + 100
    track_dict = ScenarioGeneratorEngine.generate_track_from_prompt(
        prompt=req.prompt,
        category=req.difficulty,
        track_id=new_track_id
    )
    GLOBAL_AUDIT_LEDGER.record_event(
        tenant_id="tenant-district-01",
        actor_id="USER-STUDIO",
        action="AI_TRACK_SYNTHESIZED",
        resource=f"track/{new_track_id}",
        status="GENERATED",
        details={"prompt": req.prompt, "title": track_dict["title"]}
    )
    return track_dict

@router.get("/tracks/{track_id}", response_model=TrackInfo)
def get_track(track_id: int):
    for track in ALL_TRACKS:
        if track.id == track_id:
            return track
    raise HTTPException(status_code=404, detail="Track not found")

@router.post("/evaluate", response_model=CodeEvaluationResponse)
async def evaluate_code(
    req: CodeEvaluationRequest,
    x_tenant_id: Optional[str] = Header(default="tenant-district-01")
):
    tenant_id = req.tenant_id or x_tenant_id or "tenant-district-01"
    student_id = req.student_id or "student-001"

    # Enqueue execution into async worker pool with token-bucket rate limiting
    try:
        response: CodeEvaluationResponse = await GLOBAL_QUEUE.execute_job(
            tenant_id,
            SandboxedEvaluator.run_track_evaluation,
            track_id=req.track_id,
            code=req.code,
            language=req.language
        )
    except RuntimeError as rate_err:
        GLOBAL_AUDIT_LEDGER.record_event(
            tenant_id=tenant_id,
            actor_id=student_id,
            action="CODE_EVALUATION_RATE_LIMITED",
            resource=f"track/{req.track_id}",
            status="RATE_LIMITED",
            details={"error": str(rate_err)}
        )
        raise HTTPException(status_code=429, detail=str(rate_err))

    # Record SOC2 Audit Entry
    status_str = "SUCCESS" if response.success else "FAILED"
    GLOBAL_AUDIT_LEDGER.record_event(
        tenant_id=tenant_id,
        actor_id=student_id,
        action="CODE_EVALUATION",
        resource=f"track/{req.track_id}",
        status=status_str,
        details={
            "tests_passed": f"{response.passed_tests}/{response.total_tests}",
            "verification_hash": response.verification_hash
        }
    )

    # If successful, record progress on student profile
    student = STUDENT_DB.get(student_id)
    if student and response.success:
        if req.track_id not in student["completed_tracks"]:
            student["completed_tracks"].append(req.track_id)
            student["civic_score"] += 100
            levels = ["Civic Novice", "Civic Architect I", "Constitutional Scholar", "Grand Chancellor"]
            student["current_level"] = levels[min(len(student["completed_tracks"]), len(levels) - 1)]

    return response

@router.get("/student/{student_id}", response_model=StudentProfile)
def get_student_profile(student_id: str):
    if student_id not in STUDENT_DB:
        STUDENT_DB[student_id] = {
            "id": student_id,
            "name": "Citizen Scholar",
            "pseudonym": PrivacySecurityManager.generate_pseudonym(student_id, "tenant-district-01"),
            "civic_score": 0,
            "current_level": "Civic Novice",
            "institution": "Epoch Nexus District Academy",
            "tenant_id": "tenant-district-01",
            "wallet_address": "0x0000000000000000000000000000000000000000",
            "completed_tracks": [],
            "ferpa_purged": False
        }
    return StudentProfile(**STUDENT_DB[student_id])

@router.post("/credentials/mint", response_model=Web3MintResponse)
def mint_credential(req: Web3MintRequest):
    result = Web3BridgeService.mint_mastery_credential(req)
    GLOBAL_AUDIT_LEDGER.record_event(
        tenant_id="tenant-district-01",
        actor_id=req.student_address,
        action="WEB3_CREDENTIAL_MINT",
        resource=f"track/{req.track_id}",
        status="MINTED",
        details={"token_id": result.token_id, "tx_hash": result.tx_hash}
    )
    return result

# =========================================================================
# TEACHER ORCHESTRATION & SCENARIO BUILDER ENDPOINTS
# =========================================================================

@router.get("/educator/scenarios", response_model=List[CustomScenario])
def list_custom_scenarios():
    return list(CUSTOM_SCENARIOS_DB.values())

@router.post("/educator/scenarios", response_model=CustomScenario)
def create_custom_scenario(scenario: CustomScenario):
    CUSTOM_SCENARIOS_DB[scenario.id] = scenario
    GLOBAL_AUDIT_LEDGER.record_event(
        tenant_id="tenant-district-01",
        actor_id=scenario.created_by,
        action="CUSTOM_SCENARIO_CREATED",
        resource=f"scenario/{scenario.id}",
        status="PUBLISHED",
        details={"title": scenario.title, "era": scenario.era}
    )
    return scenario

@router.get("/educator/roster", response_model=List[ClassroomStudentProgress])
def get_classroom_live_roster():
    return [ClassroomStudentProgress(**s) for s in CLASSROOM_ROSTER]

@router.post("/educator/feedback")
def dispatch_teacher_feedback(dispatch: TeacherFeedbackDispatch):
    for student in CLASSROOM_ROSTER:
        if student["student_id"] == dispatch.student_id:
            student["feedback_notes"] = dispatch.teacher_note
            if dispatch.rubric_override_score is not None:
                student["rubric_score_pct"] = dispatch.rubric_override_score
            if dispatch.awarded_bonus_points > 0:
                student["civic_score"] += dispatch.awarded_bonus_points
            
            GLOBAL_AUDIT_LEDGER.record_event(
                tenant_id="tenant-district-01",
                actor_id="INSTRUCTOR-001",
                action="TEACHER_FEEDBACK_DISPATCH",
                resource=f"student/{dispatch.student_id}",
                status="FEEDBACK_SENT",
                details={"score_override": dispatch.rubric_override_score, "bonus": dispatch.awarded_bonus_points}
            )
            return {"success": True, "message": f"Feedback delivered to {student['name']}"}

    raise HTTPException(status_code=404, detail="Student not found in active roster")

# =========================================================================
# MULTIPLAYER & INSTITUTIONAL ASSESSMENT ENDPOINTS
# =========================================================================

@router.get("/multiplayer/lobbies")
def get_multiplayer_lobbies():
    from app.main import manager
    return list(manager.lobby_states.values())

@router.get("/institutional/standards", response_model=StandardsCompetencyReport)
def get_standards_competency_report():
    return StandardsCompetencyReport(
        district_name="Agora Unified School District & Global Academy Network",
        total_students_enrolled=5240,
        active_cohorts=18,
        average_civic_score=286.4,
        standards=[
            StandardItem(
                code="AP-EURO-4.2",
                course="AP European History",
                description="Commercial Revolution, mercantilism, and maritime trade balance.",
                mastery_rate_pct=94.5,
                mapped_tracks=[2]
            ),
            StandardItem(
                code="AP-GOV-1.3",
                course="AP US Government & Politics",
                description="Checks and balances, voting mechanisms, minority rights, and checks on majority tyranny.",
                mastery_rate_pct=96.2,
                mapped_tracks=[1, 4]
            ),
            StandardItem(
                code="AP-CSP-3.1",
                course="AP Computer Science Principles",
                description="Variables, assignments, Boolean logic, truth tables, and algorithm abstractions.",
                mastery_rate_pct=97.8,
                mapped_tracks=[1, 2, 3, 4]
            ),
            StandardItem(
                code="AP-CSA-2.4",
                course="AP Computer Science A",
                description="Object-Oriented class design, encapsulation, and discrete simulation loops.",
                mastery_rate_pct=91.0,
                mapped_tracks=[3, 4]
            ),
            StandardItem(
                code="CSTA-3A-AP-14",
                course="CSTA K-12 CS Standards",
                description="Construct solutions using compound conditionals, OOP methods, and security safeguards.",
                mastery_rate_pct=95.0,
                mapped_tracks=[1, 2, 3, 4]
            )
        ],
        top_misconceptions=[
            {"topic": "Vigenère Cipher Modulo Arithmetic", "failure_rate_pct": 14.2, "suggested_intervention": "Review character wrap-around using % 26"},
            {"topic": "Quadratic Voice Credit Budget Constraints", "failure_rate_pct": 11.5, "suggested_intervention": "Ensure cost calculation evaluates votes squared (V^2)"}
        ]
    )

@router.get("/institutional/gradebook", response_model=List[GradebookStudentRow])
def get_institutional_gradebook():
    return [
        GradebookStudentRow(
            student_id="student-001",
            name="Hypatia of Alexandria",
            pseudonym="Scholar-HYPATIA-8F",
            institution="Agora Academy of Sciences",
            completed_tracks=[1, 2, 3],
            civic_mastery_points=320,
            overall_rubric_pct=98.0,
            time_on_task_minutes=145,
            last_active="2026-08-22 19:40",
            credential_badge_status="ISSUED_L2"
        ),
        GradebookStudentRow(
            student_id="student-002",
            name="Marcus Tullius Cicero",
            pseudonym="Scholar-CICERO-3D",
            institution="Agora Academy of Sciences",
            completed_tracks=[1],
            civic_mastery_points=200,
            overall_rubric_pct=95.0,
            time_on_task_minutes=90,
            last_active="2026-08-22 19:15",
            credential_badge_status="ISSUED_L2"
        ),
        GradebookStudentRow(
            student_id="student-003",
            name="Ada King Lovelace",
            pseudonym="Scholar-ADA-99",
            institution="Agora Academy of Sciences",
            completed_tracks=[1, 2, 3, 4],
            civic_mastery_points=410,
            overall_rubric_pct=99.5,
            time_on_task_minutes=210,
            last_active="2026-08-22 20:01",
            credential_badge_status="ISSUED_L2"
        ),
        GradebookStudentRow(
            student_id="student-004",
            name="Niccolò Machiavelli",
            pseudonym="Scholar-NICCOLO-12",
            institution="Agora Academy of Sciences",
            completed_tracks=[1, 2],
            civic_mastery_points=110,
            overall_rubric_pct=82.0,
            time_on_task_minutes=115,
            last_active="2026-08-22 18:50",
            credential_badge_status="PENDING_REVIEW"
        )
    ]

# =========================================================================
# SOC2 & FERPA PRIVACY / COMPLIANCE ENDPOINTS
# =========================================================================

@router.post("/privacy/ferpa-purge", response_model=FERPAPurgeResponse)
def purge_student_ferpa_data(req: FERPAPurgeRequest):
    student = STUDENT_DB.get(req.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student record not found.")

    updated = PrivacySecurityManager.redact_student_record(student)
    updated["ferpa_purged"] = True
    STUDENT_DB[req.student_id] = updated

    audit_entry = GLOBAL_AUDIT_LEDGER.record_event(
        tenant_id=req.tenant_id,
        actor_id=req.requested_by,
        action="FERPA_RIGHT_TO_ERASURE_PURGE",
        resource=f"student/{req.student_id}",
        status="PURGED_SUCCESS",
        details={"reason": req.reason}
    )

    return FERPAPurgeResponse(
        success=True,
        student_id=req.student_id,
        status="FERPA_PURGED_ANONYMIZED",
        anonymized_pseudonym=student.get("pseudonym", "Scholar-ANON"),
        audit_hash=audit_entry.current_hash
    )

@router.get("/compliance/audit-trail")
def get_audit_trail(
    tenant_id: str = Query(default="tenant-district-01"),
    limit: int = Query(default=20)
):
    is_valid, msg = GLOBAL_AUDIT_LEDGER.verify_integrity()
    trail = GLOBAL_AUDIT_LEDGER.get_tenant_trail(tenant_id, limit=limit)
    return {
        "integrity_verified": is_valid,
        "integrity_status": msg,
        "tenant_id": tenant_id,
        "records_returned": len(trail),
        "audit_trail": trail
    }

@router.get("/metrics/concurrency", response_model=ConcurrencyMetricsResponse)
def get_concurrency_telemetry():
    metrics = GLOBAL_QUEUE.get_metrics()
    return ConcurrencyMetricsResponse(**metrics)
