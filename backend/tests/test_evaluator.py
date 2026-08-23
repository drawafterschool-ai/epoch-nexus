import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.evaluator import SandboxedEvaluator
from app.services.tracks_data import ALL_TRACKS

def test_all_tracks_evaluation():
    print("\n--- Testing ChronosCode Track Evaluation Engines ---")
    for track in ALL_TRACKS:
        print(f"\n[Evaluating Track {track.id}: {track.title}]")
        resp = SandboxedEvaluator.run_track_evaluation(
            track_id=track.id,
            code=track.solution_code,
            language=track.language
        )
        print(f"  Success: {resp.success}")
        print(f"  Tests Passed: {resp.passed_tests}/{resp.total_tests}")
        for r in resp.results:
            status = "PASS" if r.passed else "FAIL"
            print(f"    - [{status}] {r.name} ({r.execution_time_ms:.2f}ms)")
            if not r.passed:
                print(f"      Expected: {r.expected}, Got: {r.actual}, Error: {r.error}")
        
        assert resp.success, f"Track {track.id} solution failed evaluation!"
        assert resp.verification_hash is not None, f"Track {track.id} proof hash missing!"
        print(f"  Verification Hash: {resp.verification_hash}")

    print("\n>>> ALL 4 TRACK EVALUATION ENGINES PASSED PERFECTLY! <<<")

if __name__ == "__main__":
    test_all_tracks_evaluation()
