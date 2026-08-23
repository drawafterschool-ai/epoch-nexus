import sys
import os
import time

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.evaluator import SandboxedEvaluator
from app.services.tracks_data import ALL_TRACKS
from app.models.schemas import CustomScenario, GradingRubric, GradingCriterion, TeacherFeedbackDispatch
from app.api.endpoints import create_custom_scenario, list_custom_scenarios, get_classroom_live_roster, dispatch_teacher_feedback

def test_track3_complete_curriculum_pack():
    print("\n--- 1. Testing Complete Track 3 Curriculum Pack Series ---")
    track3 = next(t for t in ALL_TRACKS if t.id == 3)
    
    resp = SandboxedEvaluator.run_track_evaluation(
        track_id=3,
        code=track3.solution_code,
        language="python"
    )
    
    print(f"  Success: {resp.success}")
    print(f"  Tests Passed: {resp.passed_tests}/{resp.total_tests}")
    for r in resp.results:
        status = "PASS" if r.passed else "FAIL"
        print(f"    - [{status}] {r.name} ({r.execution_time_ms:.2f}ms)")
        if not r.passed:
            print(f"      Expected: {r.expected}, Got: {r.actual}, Error: {r.error}")

    assert resp.success, "Track 3 full curriculum pack solution must pass all 4 stages!"
    assert resp.passed_tests == 4, "Track 3 should have 4 verification tests (State, Factory Act, Smog Scrubber, Lovelace Loop)"
    print("  [PASS] Track 3 Complete 4-Stage Curriculum Pack Verified!")

def test_educator_scenario_builder_and_rubrics():
    print("\n--- 2. Testing Educator Custom Scenario Builder & Rubrics ---")
    
    rubric = GradingRubric(
        id="rubric-hanseatic",
        title="Hanseatic League Tariff Mastery",
        criteria=[
            GradingCriterion(name="Civic Logic", weight_pct=30.0, description="Correctly models Hanseatic vs foreign merchant tariffs"),
            GradingCriterion(name="Algorithmic Accuracy", weight_pct=40.0, description="Passes functional float calculations"),
            GradingCriterion(name="Code Quality", weight_pct=15.0, description="Clean syntax"),
            GradingCriterion(name="Stability", weight_pct=15.0, description="Zero crashes")
        ]
    )

    scenario = CustomScenario(
        id="scenario-hanseatic-01",
        title="The Hanseatic League Maritime Guilds",
        subtitle="Northern European Trade Charters",
        era="1356 CE – 1669 CE",
        historical_figure="Alderman of the Steelyard",
        civics_focus="Chartered mercantile assemblies & toll exemptions",
        stem_focus="Hash tables & tariff lookups",
        lore="The Hanseatic League united guild cities across Lübeck, Hamburg, and Danzig.",
        instructions=["Implement calculate_guild_tariffs(goods, charter)"],
        starter_code="def calculate_guild_tariffs(goods: dict, charter: str) -> float:\n    pass\n",
        solution_code="def calculate_guild_tariffs(goods: dict, charter: str) -> float:\n    rate = 0.05 if charter == 'Hanseatic' else 0.15\n    return round(sum(goods.values()) * rate, 2)\n",
        hints=["Hanseatic charter members receive preferential 5% rates."],
        rubric=rubric
    )

    # 1. Publish scenario
    published = create_custom_scenario(scenario)
    assert published.id == "scenario-hanseatic-01"
    print(f"  [PASS] Created Custom Educator Scenario: '{published.title}'")

    # 2. List scenarios
    scenarios = list_custom_scenarios()
    assert len(scenarios) >= 1
    print(f"  [PASS] Registered Scenarios Count: {len(scenarios)}")

def test_classroom_live_roster_and_feedback():
    print("\n--- 3. Testing Live Classroom Roster & Feedback Dispatch ---")
    
    # 1. Get live roster
    roster = get_classroom_live_roster()
    assert len(roster) == 4, "Should have 4 active students in live roster"
    print(f"  [PASS] Live Classroom Roster Verified: {len(roster)} connected terminals")

    # 2. Dispatch feedback to student-004 (Machiavelli)
    dispatch_req = TeacherFeedbackDispatch(
        student_id="student-004",
        scenario_id="track-2",
        rubric_override_score=75.0,
        teacher_note="Consider how the repeating key resets when advancing through non-letter characters.",
        awarded_bonus_points=15
    )
    res = dispatch_teacher_feedback(dispatch_req)
    assert res["success"] is True
    print(f"  [PASS] Dispatched Teacher Feedback: '{dispatch_req.teacher_note[:40]}...'")

if __name__ == "__main__":
    test_track3_complete_curriculum_pack()
    test_educator_scenario_builder_and_rubrics()
    test_classroom_live_roster_and_feedback()
    print("\n>>> ALL EDUCATOR SUITE & TRACK 3 TESTS PASSED! <<<\n")
