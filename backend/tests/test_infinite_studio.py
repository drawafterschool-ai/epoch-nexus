import sys
import os
import time

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.scenario_generator import ScenarioGeneratorEngine
from app.api.endpoints import generate_ai_track, get_community_tracks
from app.models.schemas import TrackGenerationRequest
from app.services.evaluator import SandboxedEvaluator

def test_ai_scenario_generator_engine():
    print("\n--- 1. Testing AI Scenario Synthesizer Engine ---")
    
    # 1. Egypt Nile Track Synthesis
    egypt_track = ScenarioGeneratorEngine.generate_track_from_prompt("Ancient Egypt Nile Flooding Hydraulics", "Intermediate", 101)
    assert "Egypt" in egypt_track["title"]
    assert "calculate_nile_grain_reserve" in egypt_track["solutionCode"]
    print(f"  [PASS] Synthesized Egypt Track: '{egypt_track['title']}'")

    # 2. Feudal Japan Track Synthesis
    japan_track = ScenarioGeneratorEngine.generate_track_from_prompt("Feudal Japan Shogunate Cipher Networks", "Intermediate", 102)
    assert "Japan" in japan_track["title"]
    assert "verify_checkpoint_token" in japan_track["solutionCode"]
    print(f"  [PASS] Synthesized Japan Track: '{japan_track['title']}'")

    # 3. Space Race Track Synthesis
    space_track = ScenarioGeneratorEngine.generate_track_from_prompt("Space Colonization Artemis Lunar Resource Accord", "Advanced", 103)
    assert "Space" in space_track["title"] or "Lunar" in space_track["title"]
    assert "allocate_life_support" in space_track["solutionCode"]
    print(f"  [PASS] Synthesized Space Track: '{space_track['title']}'")

    # 4. Arbitrary User Prompt Synthesis
    custom_track = ScenarioGeneratorEngine.generate_track_from_prompt("French Revolution Bastille & National Assembly Quorum", "Beginner", 104)
    assert len(custom_track["starterCode"]) > 20
    assert len(custom_track["solutionCode"]) > 20
    print(f"  [PASS] Synthesized Custom User Prompt Track: '{custom_track['title']}'")

def test_tracks_api_and_community_hub():
    print("\n--- 2. Testing Track Studio API & Community Hub Endpoints ---")
    
    # 1. Test POST /api/tracks/generate
    req = TrackGenerationRequest(prompt="Apollo 11 Moon Landing Trajectory Logic", difficulty="Advanced")
    gen_result = generate_ai_track(req)
    assert "title" in gen_result
    assert "solutionCode" in gen_result
    print(f"  [PASS] Endpoint POST /api/tracks/generate returned valid track: '{gen_result['title']}'")

    # 2. Test GET /api/tracks/community
    comm_tracks = get_community_tracks()
    assert len(comm_tracks) >= 3
    print(f"  [PASS] Endpoint GET /api/tracks/community listed {len(comm_tracks)} published community packs")

def test_custom_track_sandbox_execution():
    print("\n--- 3. Testing Dynamic Code Evaluation of Synthesized Track ---")
    
    # Generate an Egypt track and execute its solution code
    egypt_track = ScenarioGeneratorEngine.generate_track_from_prompt("Ancient Egypt Nile Flooding", "Intermediate", 101)
    
    # Test execution in AST sandbox
    scope = {}
    exec(egypt_track["solutionCode"], scope)
    calc_fn = scope.get("calculate_nile_grain_reserve")
    assert callable(calc_fn), "Synthesized solution function must be callable"
    
    # Test drought condition (< 12 cubits)
    drought_res = calc_fn(flood_cubits=10.0, demand=1000, reserve_pct=0.20)
    assert drought_res == 300, f"Expected 300 bushels in drought, got {drought_res}"
    print(f"  [PASS] Nile Grain Calculation Test in Drought: {drought_res} bushels allocated")

    # Test normal flood
    normal_res = calc_fn(flood_cubits=15.0, demand=1000, reserve_pct=0.20)
    assert normal_res == 260, f"Expected 260 bushels in normal harvest, got {normal_res}"
    print(f"  [PASS] Nile Grain Calculation Test in Normal Year: {normal_res} bushels allocated")

if __name__ == "__main__":
    test_ai_scenario_generator_engine()
    test_tracks_api_and_community_hub()
    test_custom_track_sandbox_execution()
    print("\n>>> ALL INFINITE STUDIO & DYNAMIC TRACK TESTS PASSED! <<<\n")
