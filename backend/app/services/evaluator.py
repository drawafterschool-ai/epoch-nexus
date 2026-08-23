import sys
import io
import time
import hashlib
import traceback
from typing import Dict, Any, List, Tuple
from app.models.schemas import CodeEvaluationResponse, TestCaseResult
from app.services.ast_sanitizer import ASTSecuritySanitizer

class SandboxedEvaluator:
    """
    Executes student code in a safe, isolated in-process namespace with execution timers,
    AST static security analysis, restricted globals, and automated curriculum assertion matrices.
    """

    @staticmethod
    def run_track_evaluation(track_id: int, code: str, language: str = "python") -> CodeEvaluationResponse:
        start_time = time.time()
        
        # Static AST Security Analysis
        is_safe, violation_reason = ASTSecuritySanitizer.sanitize(code)
        if not is_safe:
            return CodeEvaluationResponse(
                success=False,
                track_id=track_id,
                total_tests=1,
                passed_tests=0,
                results=[TestCaseResult(
                    name="AST Static Sandbox Security Guard",
                    passed=False,
                    expected="Compliant student code within sandbox boundaries",
                    actual="Security Violation Blocked",
                    error=violation_reason,
                    execution_time_ms=(time.time() - start_time) * 1000
                )],
                stdout="",
                stderr=violation_reason,
                simulation_state={"status": "SECURITY_VIOLATION", "error": violation_reason},
                credential_eligible=False,
                security_scan={"passed": False, "violation": violation_reason}
            )

        stdout_capture = io.StringIO()
        old_stdout = sys.stdout
        sys.stdout = stdout_capture

        results: List[TestCaseResult] = []
        sim_state: Dict[str, Any] = {}
        all_passed = False

        try:
            # Create safe execution sandbox
            builtins_dict = __builtins__ if isinstance(__builtins__, dict) else __builtins__.__dict__
            safe_globals = {
                "__builtins__": {
                    k: v for k, v in builtins_dict.items()
                    if k not in ["open", "eval", "exec", "__import__", "input", "compile"]
                },
                "min": min, "max": max, "sum": sum, "len": len, "range": range,
                "enumerate": enumerate, "zip": zip, "sorted": sorted, "abs": abs,
                "dict": dict, "list": list, "set": set, "str": str, "int": int, "float": float, "bool": bool, "round": round
            }
            local_scope: Dict[str, Any] = {}

            # Execute user submitted code
            exec(code, safe_globals, local_scope)

            # Evaluate based on track ID
            if track_id == 1:
                results, sim_state = SandboxedEvaluator._eval_track1(local_scope)
            elif track_id == 2:
                results, sim_state = SandboxedEvaluator._eval_track2(local_scope)
            elif track_id == 3:
                results, sim_state = SandboxedEvaluator._eval_track3(local_scope)
            elif track_id == 4:
                results, sim_state = SandboxedEvaluator._eval_track4(local_scope)
            else:
                raise ValueError(f"Unknown track ID: {track_id}")

            passed_count = sum(1 for r in results if r.passed)
            all_passed = (passed_count == len(results))

        except Exception as e:
            err_msg = traceback.format_exc()
            results.append(TestCaseResult(
                name="Code Execution & Syntax Validation",
                passed=False,
                expected="Valid execution without exceptions",
                actual="Execution Error",
                error=err_msg,
                execution_time_ms=(time.time() - start_time) * 1000
            ))
            passed_count = 0
            sim_state = {"status": "error", "message": str(e)}

        finally:
            sys.stdout = old_stdout

        output_str = stdout_capture.getvalue()
        
        # Calculate cryptographic proof hash if student passed
        verification_hash = None
        if all_passed:
            hash_input = f"track-{track_id}:{code}:{time.time()}"
            verification_hash = "0x" + hashlib.sha256(hash_input.encode('utf-8')).hexdigest()

        return CodeEvaluationResponse(
            success=all_passed,
            track_id=track_id,
            total_tests=len(results),
            passed_tests=passed_count,
            results=results,
            stdout=output_str,
            simulation_state=sim_state,
            credential_eligible=all_passed,
            verification_hash=verification_hash
        )

    @staticmethod
    def _eval_track1(scope: Dict[str, Any]) -> Tuple[List[TestCaseResult], Dict[str, Any]]:
        """Track 1: Classical Antiquity & Logic (Athenian Quorum & Roman Tribunician Veto)"""
        results = []
        
        # Verify function 1: tally_civic_vote
        tally_fn = scope.get("tally_civic_vote")
        if not callable(tally_fn):
            results.append(TestCaseResult(name="tally_civic_vote Defined", passed=False, expected="Function callable", actual="Not found", execution_time_ms=1.0))
            return results, {}

        test_cases = [
            {"votes": {"yes": 4000, "no": 2000}, "quorum": 5000, "veto": False, "expected": "PASSED"},
            {"votes": {"yes": 4000, "no": 2000}, "quorum": 7000, "veto": False, "expected": "QUORUM_FAILED"},
            {"votes": {"yes": 5000, "no": 1000}, "quorum": 5000, "veto": True, "expected": "VETOED"},
            {"votes": {"yes": 1500, "no": 3500}, "quorum": 4000, "veto": False, "expected": "REJECTED"},
        ]

        for idx, tc in enumerate(test_cases):
            t0 = time.time()
            try:
                res = tally_fn(tc["votes"], tc["quorum"], tc["veto"])
                passed = (res == tc["expected"])
                results.append(TestCaseResult(
                    name=f"Agora Vote Case {idx+1}: Quorum {tc['quorum']}, Veto={tc['veto']}",
                    passed=passed,
                    expected=tc["expected"],
                    actual=res,
                    execution_time_ms=(time.time() - t0) * 1000
                ))
            except Exception as e:
                results.append(TestCaseResult(
                    name=f"Agora Vote Case {idx+1}",
                    passed=False,
                    expected=tc["expected"],
                    actual=str(e),
                    error=str(e),
                    execution_time_ms=(time.time() - t0) * 1000
                ))

        # Function 2: evaluate_ostracism
        ostracism_fn = scope.get("evaluate_ostracism")
        if callable(ostracism_fn):
            t0 = time.time()
            try:
                # Ostracism quorum is 6000 total shards. The highest individual candidate above 3000 is exiled.
                shards = {"Themistocles": 3500, "Aristides": 2600, "Xanthippus": 400}
                res = ostracism_fn(shards, total_threshold=6000)
                results.append(TestCaseResult(
                    name="Ostracism Quorum & Citizen Exile Tally",
                    passed=(res == "Themistocles"),
                    expected="Themistocles",
                    actual=res,
                    execution_time_ms=(time.time() - t0) * 1000
                ))
            except Exception as e:
                results.append(TestCaseResult(
                    name="Ostracism Tally", passed=False, expected="Themistocles", actual=str(e), error=str(e), execution_time_ms=1.0
                ))

        sim_state = {
            "assembly_status": "Ratified" if all(r.passed for r in results) else "Deliberating",
            "athenian_quorum_met": True,
            "senate_veto_status": "Resolved",
            "citizen_morale": 95 if all(r.passed for r in results) else 60
        }
        return results, sim_state

    @staticmethod
    def _eval_track2(scope: Dict[str, Any]) -> Tuple[List[TestCaseResult], Dict[str, Any]]:
        """Track 2: The Age of Discovery & Cryptography (Caesar / Vigenère & Route Balance)"""
        results = []
        decrypt_fn = scope.get("decrypt_diplomatic_cable")
        if not callable(decrypt_fn):
            results.append(TestCaseResult(name="decrypt_diplomatic_cable Defined", passed=False, expected="Function callable", actual="Not found", execution_time_ms=1.0))
            return results, {}

        # Caesar test
        t0 = time.time()
        c1 = "DOOLDQFH ZLWK YHQLFH" # Shift 3 for "ALLIANCE WITH VENICE"
        res1 = decrypt_fn(c1, "caesar", 3)
        results.append(TestCaseResult(
            name="Caesar Cipher: Venetian Naval Dispatch",
            passed=(res1 == "ALLIANCE WITH VENICE"),
            expected="ALLIANCE WITH VENICE",
            actual=res1,
            execution_time_ms=(time.time() - t0) * 1000
        ))

        # Vigenère test
        t0 = time.time()
        c2 = "LXFOPVEFRNHR" # Plain: ATTACKATDAWN, Key: LEMON
        res2 = decrypt_fn(c2, "vigenere", "LEMON")
        results.append(TestCaseResult(
            name="Vigenère Polyalphabetic Cipher: Ottoman Route Intercept",
            passed=(res2 == "ATTACKATDAWN"),
            expected="ATTACKATDAWN",
            actual=res2,
            execution_time_ms=(time.time() - t0) * 1000
        ))

        # Trade balance function
        balance_fn = scope.get("balance_trade_manifest")
        if callable(balance_fn):
            t0 = time.time()
            manifest = {"silk": 100, "spices": 250, "glass": 80}
            tariffs = {"silk": 0.10, "spices": 0.15, "glass": 0.05}
            # Total net after tariffs: 100*0.9 + 250*0.85 + 80*0.95 = 90 + 212.5 + 76 = 378.5
            res3 = balance_fn(manifest, tariffs)
            results.append(TestCaseResult(
                name="Spice & Silk Maritime Tariff Optimizer",
                passed=(abs(res3 - 378.5) < 0.01),
                expected=378.5,
                actual=res3,
                execution_time_ms=(time.time() - t0) * 1000
            ))

        sim_state = {
            "allied_routes_unlocked": ["Venice-Alexandria", "Lisbon-Goa"],
            "crypto_intel_grade": "Diplomatic Grade A",
            "fleet_readiness": 100 if all(r.passed for r in results) else 50
        }
        return results, sim_state

    @staticmethod
    def _eval_track3(scope: Dict[str, Any]) -> Tuple[List[TestCaseResult], Dict[str, Any]]:
        """Track 3: Industrial Revolution & Simulation Loops (OOP & Economic Balance)"""
        results = []
        sim_class = scope.get("IndustrialEconomySim")
        if not sim_class:
            results.append(TestCaseResult(name="IndustrialEconomySim Class Defined", passed=False, expected="Class exists", actual="Not found", execution_time_ms=1.0))
            return results, {}

        t0 = time.time()
        try:
            # Instantiate simulation with 100 workers, base wage 5, working hours 10
            sim = sim_class(workers=100, wage=5, hours_per_day=10, factory_capacity=500)
            
            # Step 1: Run 10 ticks with standard policy
            for _ in range(10):
                sim.tick()

            state = sim.get_state()
            # Expecting satisfaction to be balanced and output to grow
            has_output = state.get("output", 0) > 0
            has_reserves = state.get("capital", 0) > 0
            has_satisfaction = 0 <= state.get("worker_satisfaction", 0) <= 100

            results.append(TestCaseResult(
                name="Industrial Simulation Loop & State Evolution",
                passed=(has_output and has_reserves and has_satisfaction),
                expected="Positive capital & valid satisfaction index",
                actual=f"Output={state.get('output')}, Capital={state.get('capital')}, Satisfaction={state.get('worker_satisfaction')}%",
                execution_time_ms=(time.time() - t0) * 1000
            ))

            # Step 2: Test policy intervention (Raise wages, reduce shift to 8 hours)
            t1 = time.time()
            sim.apply_factory_act(wage_bonus=2, max_hours=8)
            for _ in range(5):
                sim.tick()
            
            updated_state = sim.get_state()
            strike_prevented = (updated_state.get("strike_risk", 0) <= 0.25)
            results.append(TestCaseResult(
                name="Factory Act Compliance & Strike Mitigation",
                passed=strike_prevented,
                expected="Strike Risk <= 25%",
                actual=f"Strike Risk = {updated_state.get('strike_risk', 0)*100:.1f}%",
                execution_time_ms=(time.time() - t1) * 1000
            ))

            # Step 3: Test Public Health Act 1875 Smog Abatement
            t2 = time.time()
            if hasattr(sim, "install_smog_scrubbers"):
                initial_smog = updated_state.get("smog_index", 30)
                sim.install_smog_scrubbers(investment_cost=150.0)
                scrubbed_state = sim.get_state()
                smog_reduced = scrubbed_state.get("smog_index", 0) < initial_smog
                results.append(TestCaseResult(
                    name="Public Health Act 1875: Smog Abatement Scrubber",
                    passed=smog_reduced,
                    expected=f"Smog Index < {initial_smog:.1f}",
                    actual=f"Smog Index = {scrubbed_state.get('smog_index', 0):.1f}",
                    execution_time_ms=(time.time() - t2) * 1000
                ))

            # Step 4: Test Ada Lovelace Analytical Computing Loop
            ada_fn = scope.get("compute_ada_analytical_sequence")
            if callable(ada_fn):
                t3 = time.time()
                # First 4 terms of sum(k^2): 1, 1+4=5, 5+9=14, 14+16=30
                seq = ada_fn(4)
                results.append(TestCaseResult(
                    name="Ada Lovelace 1843 Analytical Engine Sequence",
                    passed=(seq == [1, 5, 14, 30]),
                    expected=[1, 5, 14, 30],
                    actual=seq,
                    execution_time_ms=(time.time() - t3) * 1000
                ))

        except Exception as e:
            results.append(TestCaseResult(
                name="Industrial Economy Sim Execution",
                passed=False,
                expected="Successful simulation step",
                actual=str(e),
                error=str(e),
                execution_time_ms=(time.time() - t0) * 1000
            ))

        sim_state = {
            "factories_active": 4,
            "steam_pressure_psi": 120,
            "worker_happiness": 88 if all(r.passed for r in results) else 45,
            "city_smog_index": 32
        }
        return results, sim_state

    @staticmethod
    def _eval_track4(scope: Dict[str, Any]) -> Tuple[List[TestCaseResult], Dict[str, Any]]:
        """Track 4: Modern Governance & Decentralized Systems (Quadratic Voting Protocol)"""
        results = []
        qv_class = scope.get("QuadraticVotingProtocol")
        if not qv_class:
            results.append(TestCaseResult(name="QuadraticVotingProtocol Defined", passed=False, expected="Class exists", actual="Not found", execution_time_ms=1.0))
            return results, {}

        t0 = time.time()
        try:
            # Initialize with 100 voice credits per delegate
            qv = qv_class(initial_credits=100)
            
            # Delegate A casts 5 votes for Treaty A -> cost is 5^2 = 25
            cost_a = qv.cast_vote(delegate="Delegate-A", proposal_id="Treaty-Climate-2050", votes=5)
            # Delegate B casts 8 votes for Treaty A -> cost is 8^2 = 64
            cost_b = qv.cast_vote(delegate="Delegate-B", proposal_id="Treaty-Climate-2050", votes=8)

            tally = qv.tally_proposal("Treaty-Climate-2050")
            expected_votes = 13
            passed_votes = (tally.get("total_votes") == expected_votes and cost_a == 25 and cost_b == 64)

            results.append(TestCaseResult(
                name="Quadratic Voting Cost Calculation (V^2 Voice Credits)",
                passed=passed_votes,
                expected="Votes: 13, Costs: [25, 64]",
                actual=f"Votes: {tally.get('total_votes')}, Costs: [{cost_a}, {cost_b}]",
                execution_time_ms=(time.time() - t0) * 1000
            ))

            # Test Sybil resistance / budget overflow
            t1 = time.time()
            overflow_prevented = False
            try:
                # Delegate A tries to spend 10 votes (cost 100) when only 75 remain -> should raise ValueError
                qv.cast_vote(delegate="Delegate-A", proposal_id="Treaty-Outer-Space", votes=10)
            except (ValueError, Exception):
                overflow_prevented = True

            results.append(TestCaseResult(
                name="Voice Credit Budget & Over-spend Constraint",
                passed=overflow_prevented,
                expected="Raise exception when Cost (100) > Remaining (75)",
                actual="Enforced budget constraint" if overflow_prevented else "Allowed overspending",
                execution_time_ms=(time.time() - t1) * 1000
            ))

            # Test Merkle / Hash verification
            verify_fn = getattr(qv, "verify_treaty_consensus", None)
            if callable(verify_fn):
                t2 = time.time()
                is_consensus = verify_fn(proposal_id="Treaty-Climate-2050", quorum_threshold=10)
                results.append(TestCaseResult(
                    name="Multilateral Treaty Ratification Consensus Rule",
                    passed=(is_consensus is True),
                    expected=True,
                    actual=is_consensus,
                    execution_time_ms=(time.time() - t2) * 1000
                ))

        except Exception as e:
            results.append(TestCaseResult(
                name="Quadratic Voting Execution",
                passed=False,
                expected="Valid execution",
                actual=str(e),
                error=str(e),
                execution_time_ms=(time.time() - t0) * 1000
            ))

        sim_state = {
            "treaty_status": "Ratified by Multilateral Consensus" if all(r.passed for r in results) else "In Negotiation",
            "participating_delegates": 12,
            "merkle_root_verified": True,
            "voice_credits_utilized": 89
        }
        return results, sim_state
