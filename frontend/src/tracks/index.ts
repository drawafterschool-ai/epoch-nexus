export interface DialogueNode {
  speaker: string;
  avatar: string;
  role: string;
  era: string;
  text: string;
  options: {
    label: string;
    nextId?: string;
    civicAlignment?: string;
    feedback: string;
  }[];
}

export interface TrackData {
  id: number;
  title: string;
  subtitle: string;
  era: string;
  historicalFigure: {
    name: string;
    title: string;
    avatar: string;
  };
  civicsFocus: string;
  stemFocus: string;
  lore: string;
  instructions: string[];
  starterCode: string;
  solutionCode: string;
  hints: string[];
  dialogue: DialogueNode[];
  badgeName: string;
  badgeIcon: string;
}

export const TRACKS: TrackData[] = [
  {
    id: 1,
    title: "Classical Antiquity & Logic",
    subtitle: "Athenian Direct Democracy vs. Roman Senate",
    era: "508 BCE – 44 BCE",
    historicalFigure: {
      name: "Pericles & Cicero",
      title: "Strategos of Athens & Roman Consul",
      avatar: "🏛️"
    },
    civicsFocus: "Athenian Ekklesia quorum constraints (6,000 citizens), Boule agenda formation, and Roman Tribunician Veto power.",
    stemFocus: "Boolean Logic (AND, OR, NOT), Conditional Branching (if/elif/else), State Registers & Voting Tallies.",
    lore: "In 508 BCE, Cleisthenes instituted direct democracy atop the Pnyx in Athens. To safeguard against mob rule, decrees required strict citizen quorum, and dangerous tyrants could be banished via Ostracism potsherds. In republican Rome, the Tribunes of the Plebs wielded the sacred 'Veto' to shield commoners from patrician overreach.",
    instructions: [
      "Implement `tally_civic_vote(votes, quorum, veto_active)` using Boolean conditional evaluation.",
      "Check if `veto_active` is True; if so, immediately return 'VETOED'.",
      "Calculate total turnout (`yes` + `no`). If below `quorum`, return 'QUORUM_FAILED'.",
      "If `yes` > `no`, return 'PASSED'; otherwise return 'REJECTED'.",
      "Implement `evaluate_ostracism(shard_votes, total_threshold)`: if sum of shards >= threshold, exile the citizen with the highest votes."
    ],
    starterCode: `# ==========================================================
# Track 1: Classical Antiquity & Civic Logic Engine
# Challenge: Implement Athenian Agora Voting & Roman Veto Rules
# ==========================================================

def tally_civic_vote(votes: dict, quorum: int, veto_active: bool) -> str:
    """
    Determines if a civic decree passes or fails.
    
    Rules:
    1. If veto_active is True -> return 'VETOED'
    2. Total votes = votes['yes'] + votes['no']
    3. If total votes < quorum -> return 'QUORUM_FAILED'
    4. If votes['yes'] > votes['no'] -> return 'PASSED'
    5. Otherwise -> return 'REJECTED'
    """
    # TODO: Implement civic voting logic
    pass


def evaluate_ostracism(shard_votes: dict, total_threshold: int = 6000) -> str:
    """
    Evaluates Athenian ostracism.
    If total shards >= total_threshold, returns the name of the 
    citizen with the most votes. Otherwise return 'NO_EXILE'.
    """
    # TODO: Implement ostracism tally
    pass
`,
    solutionCode: `def tally_civic_vote(votes: dict, quorum: int, veto_active: bool) -> str:
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
`,
    hints: [
      "Evaluate the Tribunician Veto first before checking numerical counts.",
      "Use `sum(shard_votes.values())` to sum all ostracism votes.",
      "Use `max(shard_votes, key=shard_votes.get)` to extract the citizen with the highest vote count."
    ],
    badgeName: "Pnyx Civic Orator & Logician",
    badgeIcon: "⚖️",
    dialogue: [
      {
        speaker: "Pericles of Athens",
        avatar: "🏛️",
        role: "Strategos of the Athenian Democracy",
        era: "Golden Age of Athens",
        text: "Greetings, citizen-coder. The Assembly gathers upon the Pnyx. Six thousand citizens must be present before any law can be enacted. How shall our algorithm balance popular will against rash passion?",
        options: [
          {
            label: "Enforce strict quorum: numbers guarantee legitimacy before majority.",
            civicAlignment: "Procedural Democrat",
            feedback: "Pericles nods: 'Wisely spoken. Without a quorum of 6,000, factions would hijack decrees in empty chambers.'"
          },
          {
            label: "Grant Tribunes absolute veto power to halt oppressive decrees.",
            civicAlignment: "Republican Constitutionalist",
            feedback: "Cicero chimes in: 'Indeed! The Tribunician Veto is the shield of the Republic against tyranny.'"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "The Age of Discovery & Cryptography",
    subtitle: "Renaissance Maritime Diplomacy & Espionage",
    era: "1453 CE – 1600 CE",
    historicalFigure: {
      name: "Niccolò Machiavelli",
      title: "Diplomatic Secretary of Florence",
      avatar: "📜"
    },
    civicsFocus: "Maritime trade alliances, Venetian-Ottoman diplomacy, intelligence interception, and tariff balancing.",
    stemFocus: "String manipulation, ASCII character encodings (ord/chr), Caesar shift & Vigenère polyalphabetic ciphers.",
    lore: "Following the capture of Constantinople in 1453, sea powers across the Mediterranean and Atlantic fought for trade hegemony. Venetian doges and Portuguese caravels communicated via encrypted dispatches. Only logicians capable of breaking shifting ciphers could safeguard diplomatic pacts and preserve economic peace.",
    instructions: [
      "Implement `decrypt_diplomatic_cable(ciphertext, cipher_type, key)`.",
      "Support `'caesar'` cipher with an integer shift: shift letters backwards, preserve uppercase and spaces.",
      "Support `'vigenere'` cipher with a keyword (e.g. `'LEMON'`): shift letters backwards by matching key index.",
      "Implement `balance_trade_manifest(manifest, tariffs)`: net = `sum(amount * (1.0 - tariff_rate))`, rounded to 2 decimals."
    ],
    starterCode: `# ==========================================================
# Track 2: The Age of Discovery & Cryptography
# Challenge: Decrypt Intercepted Cables & Optimize Trade Tariffs
# ==========================================================

def decrypt_diplomatic_cable(ciphertext: str, cipher_type: str, key) -> str:
    """
    Decrypts diplomatic cables using 'caesar' or 'vigenere'.
    
    1. 'caesar': shift uppercase letters backwards by key (wrap-around A-Z).
    2. 'vigenere': shift uppercase letters backwards by key string letters.
    """
    # TODO: Implement Caesar and Vigenère decryption
    pass


def balance_trade_manifest(manifest: dict, tariffs: dict) -> float:
    """
    Calculates net fleet revenue after tariffs.
    Formula: sum of amount * (1.0 - tariff_rate)
    """
    # TODO: Calculate net manifest value
    pass
`,
    solutionCode: `def decrypt_diplomatic_cable(ciphertext: str, cipher_type: str, key) -> str:
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
`,
    hints: [
      "Use `ord(ch) - ord('A')` to convert letters to 0..25 coordinates.",
      "Modulo `% 26` handles backwards wrap-around cleanly.",
      "Remember to advance the Vigenère key index only when alphabetic characters are decrypted."
    ],
    badgeName: "Venetian Diplomatic Cryptographer",
    badgeIcon: "🗝️",
    dialogue: [
      {
        speaker: "Niccolò Machiavelli",
        avatar: "📜",
        role: "Florentine Diplomat & Political Philosopher",
        era: "Italian Renaissance",
        text: "The Lion of Venice and the Ottoman Sultan communicate in shadows. An intercepted dispatch reveals movements in the Aegean. He who controls information commands the balance of power.",
        options: [
          {
            label: "Decrypt the cables immediately to warn our naval allies.",
            civicAlignment: "Strategic Diplomat",
            feedback: "Machiavelli smirks: 'Prudence dictates that swift intelligence preserves sovereign treaties.'"
          },
          {
            label: "Audit the maritime tariff manifests to ensure fair trade quotas.",
            civicAlignment: "Mercantile Governor",
            feedback: "Machiavelli nods: 'Wealth is the sinew of statecraft. Sound accounting prevents rebellions.'"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "The Industrial & Digital Revolutions",
    subtitle: "Complete 4-Stage Curriculum Pack: Luddites, Factory Acts, Smog Grid & Lovelace Loops",
    era: "1780 CE – 1900 CE",
    historicalFigure: {
      name: "Ada Lovelace & Robert Owen",
      title: "Pioneering Computer Scientist & Social Reformer",
      avatar: "⚙️"
    },
    civicsFocus: "Industrialization, Factory Acts, 8-hour workday movements, urban sanitation grids, and algorithmic stewardship.",
    stemFocus: "Object-Oriented Programming (OOP), Discrete-Time Simulation Loops, Non-Linear Dynamics, and Sequence Algorithms.",
    lore: "The Industrial Revolution represents humanity's greatest technological and social transformation. This comprehensive 4-stage curriculum pack explores: (1) The 1811 Luddite Loom Automation dilemma, (2) The 1847 Ten Hours Act and labor equilibrium, (3) The 1875 Public Health Act and urban smog abatement grid, and (4) Ada Lovelace's 1843 Bernoulli loop on the Analytical Engine.",
    instructions: [
      "Implement `IndustrialEconomySim` class with state variables: `capital`, `output`, `worker_satisfaction`, `strike_risk`, `smog_index`.",
      "In `tick()`: Daily output = `min(workers * hours * 0.5, factory_capacity)`. Revenue = `daily_output * 2.0`. Labor cost = `workers * wage`.",
      "Add `(revenue - labor_cost)` to `capital` and increment `output`. Smog index increases by `daily_output * 0.05`.",
      "Adjust worker satisfaction: +1.0 if `wage >= 6.0` and `hours <= 8.0`; -1.5 if `hours > 9.0`. Clamp to [0, 100].",
      "Calculate `strike_risk = max(0.0, (100.0 - worker_satisfaction) / 100.0)`.",
      "Implement `apply_factory_act(wage_bonus, max_hours)`: increase wage, cap hours, boost satisfaction by +15%.",
      "Implement `install_smog_scrubbers(investment_cost)`: deduct cost from capital, reduce smog by 50%, boost satisfaction by +5%.",
      "Implement `compute_ada_analytical_sequence(n_terms)`: return list where B(n) = sum(k² for k in 1..n)."
    ],
    starterCode: `# ==========================================================
# Track 3: The Industrial & Digital Revolutions (Curriculum Pack)
# Modules: (1) IndustrialEconomySim, (2) AdaLovelaceAnalyticalLoop
# ==========================================================

class IndustrialEconomySim:
    """
    Models the Victorian factory city economy, worker satisfaction, and strike risks.
    """
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
        """
        Advances the city by 1 day:
        1. daily_output = min(self.workers * self.hours * 0.5, self.factory_capacity)
        2. revenue = daily_output * 2.0; labor_cost = self.workers * self.wage
        3. self.capital += (revenue - labor_cost); self.output += daily_output
        4. satisfaction: +1.0 if wage >= 6.0 and hours <= 8.0; -1.5 if hours > 9.0 (clamped 0-100)
        5. strike_risk = max(0.0, (100.0 - self.worker_satisfaction) / 100.0)
        6. smog_index increases by daily_output * 0.05
        """
        # TODO: Implement daily simulation cycle
        pass

    def apply_factory_act(self, wage_bonus: float, max_hours: float):
        """
        Applies Parliamentary Factory Act reforms:
        - wage += wage_bonus; hours = min(hours, max_hours)
        - satisfaction += 15.0; update strike_risk
        """
        # TODO: Apply labor legislation
        pass

    def install_smog_scrubbers(self, investment_cost: float):
        """
        Applies Public Health Act 1875 environmental upgrades:
        - Deducts investment_cost from self.capital
        - Reduces self.smog_index by 50%
        - Boosts worker_satisfaction by +5.0
        """
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
    """
    Computes Ada Lovelace's 1843 foundational polynomial sequence
    for Babbage's Analytical Engine: B(n) = sum(k**2 for k in 1..n)
    """
    # TODO: Compute Lovelace Analytical Sequence
    pass
`,
    solutionCode: `class IndustrialEconomySim:
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
`,
    hints: [
      "Store properties on self to retain state across iterative tick() cycles.",
      "Use min() and max() to enforce realistic factory capacity, satisfaction, and smog levels.",
      "For Ada Lovelace's sequence, calculate [sum(k*k for k in range(1, i+1)) for i in range(1, n_terms+1)]."
    ],
    badgeName: "Industrial System Architect & Reformer",
    badgeIcon: "🏭",
    dialogue: [
      {
        speaker: "Ada Lovelace",
        avatar: "⚙️",
        role: "Pioneer of Algorithmic Science",
        era: "Victorian Era, 1842",
        text: "The Analytical Engine weaves algebraic patterns just as the Jacquard loom weaves flowers and leaves. But an industrial society must compute human dignity alongside mechanical horsepower.",
        options: [
          {
            label: "Enact the 8-Hour Workday Act & install environmental scrubbers.",
            civicAlignment: "Humanitarian Reformer",
            feedback: "Robert Owen smiles: 'Eight hours labor, eight hours recreation, eight hours rest—the foundation of true prosperity.'"
          },
          {
            label: "Maximize capital reinvestment into steam engine throughput.",
            civicAlignment: "Industrial Capitalist",
            feedback: "Ada cautions: 'Remember: high output without worker satisfaction breeds unrest and systemic breakdown.'"
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Modern Governance & Decentralized Systems",
    subtitle: "Multilateral Treaties, Quadratic Voting & Web3 Civics",
    era: "1945 CE – 2030+ CE",
    historicalFigure: {
      name: "Eleanor Roosevelt & Satoshi",
      title: "Architect of Universal Rights & Cypherpunk Pioneer",
      avatar: "🌐"
    },
    civicsFocus: "Multilateral diplomacy, institutional checks and balances, quadratic voice credits, and sybil-resistant consensus.",
    stemFocus: "Smart Contracts, Cryptographic Proofs, Quadratic Voting Cost Functions (Cost = V^2), Merkle Verification.",
    lore: "From the Universal Declaration of Human Rights in 1948 to modern decentralized treaty networks, governance requires mechanisms that respect minority intensity of preference while maintaining democratic consensus. Quadratic voting empowers global communities to ratify environmental, human rights, and technological compacts fairly.",
    instructions: [
      "Implement the `QuadraticVotingProtocol` class.",
      "Each delegate begins with `initial_credits` (default 100).",
      "In `cast_vote(delegate, proposal_id, votes)`: calculate `cost = votes * votes`. If delegate credits < cost, raise `ValueError`.",
      "Deduct cost, increment proposal vote tally, record delegate vote.",
      "In `tally_proposal(proposal_id)`: return `{'proposal_id': proposal_id, 'total_votes': total}`.",
      "In `verify_treaty_consensus(proposal_id, quorum_threshold)`: return `total_votes >= quorum_threshold`."
    ],
    starterCode: `# ==========================================================
# Track 4: Modern Governance & Decentralized Systems
# Challenge: Build a Quadratic Voting Treaty Consensus Protocol
# ==========================================================

class QuadraticVotingProtocol:
    def __init__(self, initial_credits: int = 100):
        self.initial_credits = initial_credits
        self.delegate_balances = {}
        self.proposals = {}

    def cast_vote(self, delegate: str, proposal_id: str, votes: int) -> int:
        """
        Casts votes on a treaty proposal.
        Quadratic cost = votes^2 voice credits.
        Raise ValueError('Insufficient voice credits') if over budget.
        """
        # TODO: Implement quadratic vote casting
        pass

    def tally_proposal(self, proposal_id: str) -> dict:
        """
        Returns proposal summary dict.
        """
        # TODO: Return proposal tally
        pass

    def verify_treaty_consensus(self, proposal_id: str, quorum_threshold: int) -> bool:
        """
        Returns True if total quadratic votes >= quorum_threshold.
        """
        # TODO: Verify multilateral consensus
        pass
`,
    solutionCode: `class QuadraticVotingProtocol:
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
`,
    hints: [
      "Quadratic voting formula: 1 vote costs 1 credit, 2 votes cost 4, 3 votes cost 9, 5 votes cost 25 credits.",
      "Check `delegate_balances` before deducting credits to prevent overdrafts.",
      "Consensus is reached when total accumulated quadratic votes satisfy the treaty quorum."
    ],
    badgeName: "Global Consensus & Web3 Sovereign",
    badgeIcon: "🌐",
    dialogue: [
      {
        speaker: "Eleanor Roosevelt",
        avatar: "🌐",
        role: "Chair of UN Commission on Human Rights",
        era: "Paris Assembly, 1948",
        text: "Where, after all, do universal rights begin? In small places, close to home. In modern digital networks, we must ensure every nation and community has voice credits to defend what matters most without being silenced by brute majorities.",
        options: [
          {
            label: "Deploy Quadratic Voting to let delegates express intensity of preference.",
            civicAlignment: "Multilateral Pluralist",
            feedback: "Eleanor nods warmly: 'Quadratic voting protects minority passions and crafts enduring peace.'"
          },
          {
            label: "Anchor treaty ratifications to an immutable decentralized ledger.",
            civicAlignment: "Cypherpunk Federalist",
            feedback: "Consensus reached: 'Cryptographic proof guarantees that no sovereign signature can be forged or erased.'"
          }
        ]
      }
    ]
  }
];
