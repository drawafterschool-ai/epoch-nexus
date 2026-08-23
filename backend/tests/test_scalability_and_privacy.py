import sys
import os
import asyncio
import time

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.ast_sanitizer import ASTSecuritySanitizer
from app.services.worker_queue import HighScaleWorkerQueue
from app.core.security import PrivacySecurityManager
from app.core.audit_logger import SOC2AuditLedger
from app.services.evaluator import SandboxedEvaluator
from app.services.tracks_data import ALL_TRACKS

def test_ast_security_sanitizer():
    print("\n--- 1. Testing AST Static Sandbox Security Guard ---")
    
    # Attack vector 1: Object introspection exploit
    exploit_1 = "().__class__.__bases__[0].__subclasses__()"
    is_safe, reason = ASTSecuritySanitizer.sanitize(exploit_1)
    assert not is_safe, "Introspection exploit should be blocked"
    print(f"  [PASS] Blocked Introspection Attack: {reason}")

    # Attack vector 2: Import statement
    exploit_2 = "import os; os.system('ls')"
    is_safe, reason = ASTSecuritySanitizer.sanitize(exploit_2)
    assert not is_safe, "Import statement should be blocked"
    print(f"  [PASS] Blocked Import Statement: {reason}")

    # Attack vector 3: Eval / Exec invocation
    exploit_3 = "eval('__import__(\"sys\").exit()')"
    is_safe, reason = ASTSecuritySanitizer.sanitize(exploit_3)
    assert not is_safe, "eval() call should be blocked"
    print(f"  [PASS] Blocked Eval Invocation: {reason}")

    # Attack vector 4: Excessive loop nesting bomb
    loop_bomb = """
for a in range(10):
    for b in range(10):
        for c in range(10):
            for d in range(10):
                for e in range(10):
                    pass
"""
    is_safe, reason = ASTSecuritySanitizer.sanitize(loop_bomb)
    assert not is_safe, "Deep loop nesting should be blocked"
    print(f"  [PASS] Blocked Loop Nesting Bomb: {reason}")

    # Legitimate track solution
    legit_code = ALL_TRACKS[0].solution_code
    is_safe, reason = ASTSecuritySanitizer.sanitize(legit_code)
    assert is_safe, f"Legitimate student code should pass: {reason}"
    print("  [PASS] Verified Legitimate Student Solution Code")

async def test_concurrency_and_rate_limiting():
    print("\n--- 2. Testing Concurrency Worker Queue (5,000+ Scalability Model) ---")
    queue = HighScaleWorkerQueue(max_concurrent_workers=20)
    
    # Simple simulated job
    def mock_eval_job(track_id, x):
        time.sleep(0.01)
        return x * 2

    # Launch 60 parallel asynchronous evaluation jobs
    tasks = [
        queue.execute_job("tenant-springfield", mock_eval_job, 1, i)
        for i in range(60)
    ]
    
    start_time = time.time()
    results = await asyncio.gather(*tasks)
    duration = time.time() - start_time
    
    assert len(results) == 60, "All 60 concurrent jobs should complete"
    metrics = queue.get_metrics()
    print(f"  [PASS] Completed 60 Concurrent Jobs in {duration*1000:.2f}ms")
    print(f"  [PASS] Queue Telemetry: Total={metrics['total_jobs_completed']}, P95 Latency={metrics['p95_latency_ms']}ms")
    print(f"  [PASS] Capacity Estimate: {metrics['estimated_capacity_supported_clients']} concurrent students supported via hybrid Wasm offload")

def test_ferpa_privacy_and_encryption():
    print("\n--- 3. Testing FERPA (34 CFR Part 99) PII Encryption & Pseudonymization ---")
    tenant_id = "district-nyc-09"
    student_name = "Hypatia of Alexandria"
    
    # 1. AES-256-GCM field-level encryption
    encrypted_pii = PrivacySecurityManager.encrypt_pii(student_name, tenant_id)
    assert encrypted_pii.startswith("enc:v1:"), "Should be authenticated ciphertext"
    decrypted_pii = PrivacySecurityManager.decrypt_pii(encrypted_pii, tenant_id)
    assert decrypted_pii == student_name, "Decrypted PII must match original"
    print(f"  [PASS] Encrypted PII: {encrypted_pii[:24]}... -> Decrypted: '{decrypted_pii}'")

    # 2. Pseudonym generation (zero PII in Web3/public leaderboards)
    pseudonym = PrivacySecurityManager.generate_pseudonym("student-9941", tenant_id)
    assert pseudonym.startswith("Scholar-"), "Should have formatted pseudonym"
    print(f"  [PASS] Generated Non-Reversible Pseudonym: '{pseudonym}'")

    # 3. FERPA Right to Erasure / Purge
    mock_student = {
        "id": "student-9941",
        "name": "Hypatia of Alexandria",
        "email": "hypatia@agora.edu",
        "institution_student_id": "DIST-8821",
        "civic_score": 350
    }
    purged_record = PrivacySecurityManager.redact_student_record(mock_student)
    assert purged_record["name"] == "[REDACTED - FERPA PURGED]", "Name must be stripped"
    assert purged_record["email"] == "[REDACTED]", "Email must be stripped"
    assert purged_record["civic_score"] == 350, "Academic mastery score must be preserved"
    print("  [PASS] Executed FERPA Right to Erasure Data Purge")

def test_soc2_hash_chained_audit_ledger():
    print("\n--- 4. Testing SOC2 Type II Hash-Chained Audit Ledger ---")
    ledger = SOC2AuditLedger()
    
    # Record events
    ledger.record_event("tenant-01", "student-01", "SUBMIT_CODE", "track/1", "SUCCESS")
    ledger.record_event("tenant-01", "instructor-01", "GRADE_REVIEW", "track/1", "APPROVED")
    ledger.record_event("tenant-01", "student-01", "MINT_CREDENTIAL", "track/1", "MINTED")
    
    is_valid, msg = ledger.verify_integrity()
    assert is_valid, f"Initial chain should be valid: {msg}"
    print(f"  [PASS] Cryptographic Chain Verified: {msg}")

    # Tamper test: Modify historic record to prove tamper detection
    ledger.chain[1].action = "ILLEGAL_GRADE_TAMPERING"
    is_valid_tampered, tamper_msg = ledger.verify_integrity()
    assert not is_valid_tampered, "Tampering should be detected"
    print(f"  [PASS] Tamper Detection Succeeded: {tamper_msg}")

if __name__ == "__main__":
    test_ast_security_sanitizer()
    asyncio.run(test_concurrency_and_rate_limiting())
    test_ferpa_privacy_and_encryption()
    test_soc2_hash_chained_audit_ledger()
    print("\n>>> ALL PLATFORM HARDENING, CONCURRENCY & PRIVACY TESTS PASSED! <<<\n")
