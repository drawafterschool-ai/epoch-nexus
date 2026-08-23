import sys
import os
import asyncio
import time

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import manager
from app.api.endpoints import get_multiplayer_lobbies, get_standards_competency_report, get_institutional_gradebook

async def test_websocket_collaborative_lobby_engine():
    print("\n--- 1. Testing Real-time Collaborative Multiplayer Lobby Engine ---")
    
    # 1. Fetch active lobbies
    lobbies = get_multiplayer_lobbies()
    assert len(lobbies) >= 2, "Should have at least 2 default historical lobbies"
    agora = next(l for l in lobbies if l["lobby_id"] == "agora-room-01")
    print(f"  [PASS] Active Lobby Found: '{agora['title']}' ({agora['topic']})")
    
    # 2. Simulate quadratic vote processing
    initial_yes = agora["total_yes_votes"]
    vote_event = {
        "type": "CAST_VOTE",
        "sender": "Hypatia",
        "delegate_id": "del-01",
        "side": "YES",
        "votes": 3 # Cost = 3^2 = 9 credits
    }
    
    await manager.process_event("agora-room-01", vote_event)
    updated_agora = manager.lobby_states["agora-room-01"]
    
    assert updated_agora["total_yes_votes"] == initial_yes + 3, "Yes votes must increment by 3"
    hypatia = next(d for d in updated_agora["delegates"] if d["delegate_id"] == "del-01")
    assert hypatia["voice_credits_remaining"] == 91 - 9, "Voice credits must deduct quadratic cost (9)"
    print(f"  [PASS] Quadratic Vote Processed: 3 votes cast -> 9 voice credits deducted (Remaining: {hypatia['voice_credits_remaining']})")

    # 3. Simulate debate speech event
    speech_event = {
        "type": "CHAT_MESSAGE",
        "sender": "Cicero",
        "text": "The Tribunes confirm that public defense warrants emergency funding."
    }
    await manager.process_event("agora-room-01", speech_event)
    last_event = manager.lobby_states["agora-room-01"]["recent_events"][-1]
    assert last_event["sender"] == "Cicero"
    print(f"  [PASS] Deliberation Broadcast Recorded: '{last_event['text'][:45]}...'")

def test_institutional_standards_assessment_report():
    print("\n--- 2. Testing Institutional Standards Alignment Matrix ---")
    report = get_standards_competency_report()
    
    assert report.total_students_enrolled == 5240
    assert len(report.standards) >= 5
    
    ap_euro = next(s for s in report.standards if s.code == "AP-EURO-4.2")
    ap_gov = next(s for s in report.standards if s.code == "AP-GOV-1.3")
    ap_csp = next(s for s in report.standards if s.code == "AP-CSP-3.1")
    
    assert ap_euro.mastery_rate_pct >= 90.0
    assert ap_gov.mastery_rate_pct >= 90.0
    assert ap_csp.mastery_rate_pct >= 90.0
    
    print(f"  [PASS] District Enrolled Scholars: {report.total_students_enrolled}")
    print(f"  [PASS] Standards Verified: AP-EURO ({ap_euro.mastery_rate_pct}%), AP-GOV ({ap_gov.mastery_rate_pct}%), AP-CSP ({ap_csp.mastery_rate_pct}%)")

def test_institutional_gradebook_and_lms_export():
    print("\n--- 3. Testing Institutional Gradebook Pipeline ---")
    gradebook = get_institutional_gradebook()
    
    assert len(gradebook) >= 4
    for row in gradebook:
        assert row.civic_mastery_points > 0
        assert row.overall_rubric_pct > 0
        assert row.credential_badge_status in ["ISSUED_L2", "PENDING_REVIEW"]
    
    print(f"  [PASS] Gradebook Verified for {len(gradebook)} Scholars with L2 Soulbound Credentials")

if __name__ == "__main__":
    asyncio.run(test_websocket_collaborative_lobby_engine())
    test_institutional_standards_assessment_report()
    test_institutional_gradebook_and_lms_export()
    print("\n>>> ALL MULTIPLAYER & ASSESSMENT PIPELINE TESTS PASSED! <<<\n")
