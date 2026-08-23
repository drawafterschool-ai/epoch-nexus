from typing import List, Dict, Any
from app.models.schemas import TrackInfo

ALL_TRACKS: List[TrackInfo] = [
    TrackInfo(
        id=1,
        title="Track 1: Classical Antiquity & Logic",
        era="508 BCE – 44 BCE (Athens & Rome)",
        historical_lore=(
            "In 508 BCE, Cleisthenes established Athenian democracy on the hill of the Pnyx, "
            "demanding a strict quorum of 6,000 citizens to pass laws or ostracize dangerous tyrants. "
            "Across the Ionian Sea, the Roman Republic instituted the Tribuni Plebis—tribunes endowed with "
            "the sacred power of 'Veto' ('I forbid') to halt Patrician Senate decrees."
        ),
        civics_focus="Direct Democracy vs. Representative Senate, Quorum Thresholds, and Tribunician Veto Checks.",
        stem_focus="Boolean Logic, Truth Tables, Compound Conditionals (and/or/not), State Registers.",
        language="python",
        starter_code="""# ==========================================================
# Track 1: Classical Antiquity & Civic Logic Engine
# Challenge: Implement Athenian Agora Voting & Roman Veto Rules
# ==========================================================

def tally_civic_vote(votes: dict, quorum: int, veto_active: bool) -> str:
    \"\"\"
    Determines if a civic decree passes or fails.
    
    Rules:
    1. If `veto_active` is True -> Decree is immediately blocked -> return 'VETOED'
    2. Total votes cast = votes['yes'] + votes['no']
    3. If total votes < quorum -> return 'QUORUM_FAILED'
    4. If votes['yes'] > votes['no'] -> return 'PASSED'
    5. Otherwise -> return 'REJECTED'
    \"\"\"
    # TODO: Implement the civic voting logic using Boolean operations
    pass


def evaluate_ostracism(shard_votes: dict, total_threshold: int = 6000) -> str:
    \"\"\"
    Evaluates Athenian ostracism (potsherd shard voting).
    If sum of all shards >= total_threshold, the individual with 
    the highest votes is exiled for 10 years. Otherwise return 'NO_EXILE'.
    \"\"\"
    # TODO: Implement ostracism tally
    pass
""",
        solution_code="""def tally_civic_vote(votes: dict, quorum: int, veto_active: bool) -> str:
    if veto_active:
        return "VETOED"
    total_votes = votes.get("yes", 0) + votes.get("no", 0)
    if total_votes < quorum:
        return "QUORUM_FAILED"
    if votes.get("yes", 0) > votes.get("no", 0):
        return "PASSED"
    return "REJECTED"

def evaluate_ostracism(shard_votes: dict, total_threshold: int = 6000) -> str:
    total = sum(shard_votes.values())
    if total < total_threshold:
        return "NO_EXILE"
    return max(shard_votes, key=shard_votes.get)
""",
        hints=[
            "Check for the Tribunician Veto first before checking numbers.",
            "Total turnout must meet or exceed the Athenian quorum.",
            "In Python, max(dict, key=dict.get) returns the key with the highest value."
        ]
    ),
    TrackInfo(
        id=2,
        title="Track 2: The Age of Discovery & Cryptography",
        era="1453 CE – 1600 CE (Venice, Lisbon & Constantinople)",
        historical_lore=(
            "Following the fall of Constantinople in 1453, European merchants scrambled to chart oceanic spice routes. "
            "Venetian doges and Portuguese navigators transmitted encrypted diplomatic cables to protect trade treaties, "
            "relying on Caesar shift substitution and Blaise de Vigenère's polyalphabetic cipher disk."
        ),
        civics_focus="Maritime Trade Alliances, Diplomatic Espionage, and Tariff Regulation.",
        stem_focus="String Manipulation, Character Encoding (ASCII/ord/chr), Polyalphabetic Ciphers, Dictionaries.",
        language="python",
        starter_code="""# ==========================================================
# Track 2: The Age of Discovery & Cryptography
# Challenge: Decrypt Intercepted Cables & Optimize Trade Tariffs
# ==========================================================

def decrypt_diplomatic_cable(ciphertext: str, cipher_type: str, key) -> str:
    \"\"\"
    Decrypts diplomatic cables using either 'caesar' or 'vigenere' ciphers.
    
    1. For 'caesar' (key is integer shift):
       Shift uppercase letters backwards by key. (A-Z wrap-around, preserve spaces).
    2. For 'vigenere' (key is string e.g. 'LEMON'):
       Shift uppercase letters backwards according to repeating key letters (A=0, B=1, ... Z=25).
    \"\"\"
    # TODO: Implement Caesar and Vigenère decryption
    pass


def balance_trade_manifest(manifest: dict, tariffs: dict) -> float:
    \"\"\"
    Calculates net fleet revenue after tariffs.
    Formula for each good: amount * (1.0 - tariff_rate)
    Return the sum of net values rounded to 2 decimal places.
    \"\"\"
    # TODO: Calculate net trade manifest value
    pass
""",
        solution_code="""def decrypt_diplomatic_cable(ciphertext: str, cipher_type: str, key) -> str:
    result = []
    if cipher_type == "caesar":
        shift = int(key)
        for ch in ciphertext:
            if 'A' <= ch <= 'Z':
                result.append(chr((ord(ch) - ord('A') - shift) % 26 + ord('A')))
            else:
                result.append(ch)
    elif cipher_type == "vigenere":
        key_str = str(key).upper()
        key_idx = 0
        for ch in ciphertext:
            if 'A' <= ch <= 'Z':
                k_shift = ord(key_str[key_idx % len(key_str)]) - ord('A')
                result.append(chr((ord(ch) - ord('A') - k_shift) % 26 + ord('A')))
                key_idx += 1
            else:
                result.append(ch)
    return "".join(result)

def balance_trade_manifest(manifest: dict, tariffs: dict) -> float:
    total = 0.0
    for good, amount in manifest.items():
        rate = tariffs.get(good, 0.0)
        total += amount * (1.0 - rate)
    return round(total, 2)
""",
        hints=[
            "Use ord(ch) and chr(num) to convert characters to ASCII numbers and back.",
            "Modulo 26 handles wrap-around from A to Z.",
            "Remember to only advance the Vigenère key index when encrypting alphabetic letters."
        ]
    ),
    TrackInfo(
        id=3,
        title="Track 3: The Industrial & Digital Revolutions (Complete Curriculum Pack Series)",
        era="1780 CE – 1900 CE (Manchester & London)",
        historical_lore=(
            "The Industrial Revolution represents humanity's greatest technological and social transformation. "
            "This comprehensive 4-stage curriculum pack explores: "
            "(1) The 1811 Luddite Loom Automation dilemma, (2) The 1847 Ten Hours Act and labor equilibrium, "
            "(3) The 1875 Public Health Act and urban smog abatement grid, and (4) Ada Lovelace's 1843 Bernoulli loop on the Analytical Engine."
        ),
        civics_focus="Labor Movements, The 8-Hour Workday, Factory Acts, Environmental Sanitation, and Algorithmic Stewardship.",
        stem_focus="Object-Oriented Programming (OOP), Discrete-Time Simulation Loops, Non-Linear Dynamics, and Sequence Algorithms.",
        language="python",
        starter_code="""# ==========================================================
# Track 3: The Industrial & Digital Revolutions (Curriculum Pack)
# Modules: (1) IndustrialEconomySim, (2) AdaLovelaceAnalyticalLoop
# ==========================================================

class IndustrialEconomySim:
    \"\"\"
    Models the Victorian factory city economy, worker satisfaction, and strike risks.
    \"\"\"
    def __init__(self, workers: int, wage: float, hours_per_day: float, factory_capacity: int):
        self.workers = workers
        self.wage = wage
        self.hours = hours_per_day
        self.factory_capacity = factory_capacity
        self.capital = 1000.0
        self.output = 0.0
        self.worker_satisfaction = 70.0
        self.strike_risk = 0.10
        self.smog_index = 25.0

    def tick(self):
        \"\"\"
        Advances the city by 1 day:
        1. daily_output = min(self.workers * self.hours * 0.5, self.factory_capacity)
        2. revenue = daily_output * 2.0; labor_cost = self.workers * self.wage
        3. self.capital += (revenue - labor_cost); self.output += daily_output
        4. satisfaction: +1.0 if wage >= 6.0 and hours <= 8.0; -1.5 if hours > 9.0 (clamped 0-100)
        5. strike_risk = max(0.0, (100.0 - self.worker_satisfaction) / 100.0)
        6. smog_index increases by daily_output * 0.05
        \"\"\"
        # TODO: Implement daily simulation cycle
        pass

    def apply_factory_act(self, wage_bonus: float, max_hours: float):
        \"\"\"
        Applies Parliamentary Factory Act reforms:
        - wage += wage_bonus; hours = min(hours, max_hours)
        - satisfaction += 15.0; update strike_risk
        \"\"\"
        # TODO: Apply labor legislation
        pass

    def install_smog_scrubbers(self, investment_cost: float):
        \"\"\"
        Applies Public Health Act 1875 environmental upgrades:
        - Deducts investment_cost from self.capital
        - Reduces self.smog_index by 50%
        - Boosts worker_satisfaction by +5.0
        \"\"\"
        # TODO: Apply environmental sanitation
        pass

    def get_state(self) -> dict:
        return {
            "capital": self.capital,
            "output": self.output,
            "worker_satisfaction": self.worker_satisfaction,
            "strike_risk": self.strike_risk,
            "smog_index": self.smog_index
        }


def compute_ada_analytical_sequence(n_terms: int) -> list:
    \"\"\"
    Computes Ada Lovelace's 1843 foundational Bernoulli/polynomial sequence
    for Babbage's Analytical Engine:
    Sequence term B(n) = sum(k**2 for k in range(1, n+1))
    Returns a list of the first n_terms.
    \"\"\"
    # TODO: Compute Lovelace Analytical Sequence
    pass
""",
        solution_code="""class IndustrialEconomySim:
    def __init__(self, workers: int, wage: float, hours_per_day: float, factory_capacity: int):
        self.workers = workers
        self.wage = wage
        self.hours = hours_per_day
        self.factory_capacity = factory_capacity
        self.capital = 1000.0
        self.output = 0.0
        self.worker_satisfaction = 70.0
        self.strike_risk = 0.10
        self.smog_index = 25.0

    def tick(self):
        daily_output = min(self.workers * self.hours * 0.5, self.factory_capacity)
        revenue = daily_output * 2.0
        labor_cost = self.workers * self.wage
        self.capital += (revenue - labor_cost)
        self.output += daily_output

        if self.wage >= 6.0 and self.hours <= 8.0:
            self.worker_satisfaction = min(100.0, self.worker_satisfaction + 1.0)
        elif self.hours > 9.0:
            self.worker_satisfaction = max(0.0, self.worker_satisfaction - 1.5)

        self.strike_risk = max(0.0, (100.0 - self.worker_satisfaction) / 100.0)
        self.smog_index += daily_output * 0.05

    def apply_factory_act(self, wage_bonus: float, max_hours: float):
        self.wage += wage_bonus
        self.hours = min(self.hours, max_hours)
        self.worker_satisfaction = min(100.0, self.worker_satisfaction + 15.0)
        self.strike_risk = max(0.0, (100.0 - self.worker_satisfaction) / 100.0)

    def install_smog_scrubbers(self, investment_cost: float):
        self.capital -= investment_cost
        self.smog_index = max(0.0, self.smog_index * 0.5)
        self.worker_satisfaction = min(100.0, self.worker_satisfaction + 5.0)
        self.strike_risk = max(0.0, (100.0 - self.worker_satisfaction) / 100.0)

    def get_state(self) -> dict:
        return {
            "capital": self.capital,
            "output": self.output,
            "worker_satisfaction": self.worker_satisfaction,
            "strike_risk": self.strike_risk,
            "smog_index": self.smog_index
        }

def compute_ada_analytical_sequence(n_terms: int) -> list:
    return [sum(k * k for k in range(1, i + 1)) for i in range(1, n_terms + 1)]
""",
        hints=[
            "Store simulation properties on 'self' to maintain state across iterative cycles.",
            "Use min() and max() functions to clamp satisfaction between 0.0 and 100.0.",
            "In compute_ada_analytical_sequence, use list comprehension to sum squares from 1 to n."
        ]
    ),
    TrackInfo(
        id=4,
        title="Track 4: Modern Governance & Decentralized Systems",
        era="1945 CE – 2030+ (Geneva, United Nations & Web3 Protocols)",
        historical_lore=(
            "From the post-WWII Geneva Conventions to 21st-century decentralized autonomous organizations (DAOs), "
            "modern multilateral diplomacy relies on cryptographic consensus and game-theoretic mechanisms. "
            "Quadratic Voting enables international delegates to express intensity of preference while curbing the tyranny of the majority."
        ),
        civics_focus="Institutional Checks and Balances, Multilateral Treaty Ratifications, Algorithmic Fairness.",
        stem_focus="Smart Contracts, Cryptographic Proofs, Quadratic Voting Cost Models (Cost = V^2), Merkle Verification.",
        language="python",
        starter_code="""# ==========================================================
# Track 4: Modern Governance & Decentralized Systems
# Challenge: Build a Quadratic Voting Treaty Consensus Protocol
# ==========================================================

class QuadraticVotingProtocol:
    def __init__(self, initial_credits: int = 100):
        self.initial_credits = initial_credits
        self.delegate_balances = {} # delegate -> remaining_credits
        self.proposals = {} # proposal_id -> {"total_votes": int, "voters": dict}

    def cast_vote(self, delegate: str, proposal_id: str, votes: int) -> int:
        \"\"\"
        Casts `votes` on `proposal_id`.
        1. Quadratic cost formula: Cost = votes^2
        2. Initialize delegate balance if not already present.
        3. If delegate remaining credits < cost -> raise ValueError('Insufficient voice credits')
        4. Deduct cost from delegate balance.
        5. Add `votes` to proposal total.
        6. Return the cost paid.
        \"\"\"
        # TODO: Implement quadratic vote casting
        pass

    def tally_proposal(self, proposal_id: str) -> dict:
        \"\"\"
        Returns summary of proposal: {"proposal_id": id, "total_votes": total}
        \"\"\"
        # TODO: Return proposal tally
        pass

    def verify_treaty_consensus(self, proposal_id: str, quorum_threshold: int) -> bool:
        \"\"\"
        Verifies if treaty has reached global consensus:
        Returns True if total quadratic votes >= quorum_threshold, else False.
        \"\"\"
        # TODO: Verify multilateral consensus
        pass
""",
        solution_code="""class QuadraticVotingProtocol:
    def __init__(self, initial_credits: int = 100):
        self.initial_credits = initial_credits
        self.delegate_balances = {}
        self.proposals = {}

    def cast_vote(self, delegate: str, proposal_id: str, votes: int) -> int:
        if delegate not in self.delegate_balances:
            self.delegate_balances[delegate] = self.initial_credits

        cost = votes * votes
        if self.delegate_balances[delegate] < cost:
            raise ValueError("Insufficient voice credits")

        self.delegate_balances[delegate] -= cost

        if proposal_id not in self.proposals:
            self.proposals[proposal_id] = {"total_votes": 0, "voters": {}}

        self.proposals[proposal_id]["total_votes"] += votes
        self.proposals[proposal_id]["voters"][delegate] = self.proposals[proposal_id]["voters"].get(delegate, 0) + votes
        return cost

    def tally_proposal(self, proposal_id: str) -> dict:
        prop = self.proposals.get(proposal_id, {"total_votes": 0, "voters": {}})
        return {
            "proposal_id": proposal_id,
            "total_votes": prop["total_votes"]
        }

    def verify_treaty_consensus(self, proposal_id: str, quorum_threshold: int) -> bool:
        prop = self.proposals.get(proposal_id, {"total_votes": 0})
        return prop["total_votes"] >= quorum_threshold
""",
        hints=[
            "Quadratic cost is always votes squared (votes ** 2).",
            "Maintain independent voice credit balances for each sovereign delegate.",
            "Verify quorum thresholds to simulate multilateral consensus."
        ]
    )
]
