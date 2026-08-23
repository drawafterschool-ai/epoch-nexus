import random
import time
from typing import Dict, Any, List
from app.models.schemas import TrackInfo

class ScenarioGeneratorEngine:
    """
    AI-powered & rule-based Scenario Synthesizer that generates complete, runnable
    Tri-Pillar curriculum tracks from natural language prompts or theme specifications.
    """

    TEMPLATES = {
        "egypt": {
            "title": "Ancient Egypt: Nile Flooding Hydraulics & Grain Quorum",
            "era": "2500 BCE – Old Kingdom Egypt",
            "historical_figure": "Imhotep & Pharaoh Djoser",
            "civics_focus": "Silo rationing laws, emergency drought relief quotas, and public granary taxation.",
            "stem_focus": "Integer division, state threshold matrices, and resource allocation loops.",
            "lore": (
                "During the Old Kingdom of Egypt, annual inundations of the Nile (Akhet) determined the harvest. "
                "Royal viziers like Imhotep designed hydraulic measuring nilometers and automated grain reserve formulas "
                "to prevent starvation across Upper and Lower Egypt."
            ),
            "instructions": [
                "Implement calculate_nile_grain_reserve(flood_cubits, population_demand, reserve_pct)",
                "If flood_cubits < 12 (Drought), allocate 1.5x reserve multiplier from emergency silos.",
                "If flood_cubits > 18 (Destructive Flood), deduct 20% crop loss before storing reserves.",
                "Return final stored bushels rounded to nearest integer."
            ],
            "starter_code": (
                "def calculate_nile_grain_reserve(flood_cubits: float, demand: int, reserve_pct: float) -> int:\n"
                "    # TODO: Implement Nile hydraulic harvest and silo allocation logic\n"
                "    pass\n"
            ),
            "solution_code": (
                "def calculate_nile_grain_reserve(flood_cubits: float, demand: int, reserve_pct: float) -> int:\n"
                "    base_harvest = demand * 1.3\n"
                "    if flood_cubits < 12.0:\n"
                "        return int(demand * reserve_pct * 1.5)\n"
                "    elif flood_cubits > 18.0:\n"
                "        base_harvest *= 0.8\n"
                "    return int(base_harvest * reserve_pct)\n"
            ),
            "hints": [
                "Droughts trigger the emergency 1.5x reserve multiplier.",
                "Excessive floods above 18 cubits destroy dykes, lowering crop output by 20%."
            ],
            "badge_name": "Vizier of the Nile Granaries",
            "badge_icon": "🌾"
        },
        "japan": {
            "title": "Feudal Japan: Shogunate Courier Cipher & Han Alliances",
            "era": "1603 CE – Tokugawa Shogunate (Edo Period)",
            "historical_figure": "Tokugawa Ieyasu & Hattori Hanzō",
            "civics_focus": "Sankin-kōtai hostage diplomacy, clan loyalty oaths, and checkpoint pass verifications.",
            "stem_focus": "Hash verification, character transposition ciphers, and dictionary lookups.",
            "lore": (
                "To maintain peace across the 300 Han domains, the Tokugawa Shogunate established the Tokaido road "
                "with strict barrier checkpoints (Sekisho). Shinobi and official couriers transmitted encrypted wooden tally tokens (Wappu) "
                "to authenticate authorized daimyo travel."
            ),
            "instructions": [
                "Implement verify_checkpoint_token(token_code, expected_clan_seal, valid_clans)",
                "Extract the clan seal prefix and numerical security hash.",
                "Return 'PERMITTED' if clan in valid_clans and seal matches, else return 'DETAINED'."
            ],
            "starter_code": (
                "def verify_checkpoint_token(token_code: str, clan_seal: str, valid_clans: list) -> str:\n"
                "    # TODO: Implement Edo checkpoint authentication\n"
                "    pass\n"
            ),
            "solution_code": (
                "def verify_checkpoint_token(token_code: str, clan_seal: str, valid_clans: list) -> str:\n"
                "    if clan_seal not in valid_clans:\n"
                "        return 'DETAINED'\n"
                "    if token_code.startswith(clan_seal):\n"
                "        return 'PERMITTED'\n"
                "    return 'DETAINED'\n"
            ),
            "hints": [
                "Verify clan presence in the valid_clans roster first.",
                "Use str.startswith() to match security seal prefixes."
            ],
            "badge_name": "Tokugawa Master of Seals",
            "badge_icon": "🏯"
        },
        "space": {
            "title": "Space Colonization: Artemis Lunar Resource Governance Accord",
            "era": "2050+ CE – Lunar South Pole & Deep Space",
            "historical_figure": "Lunar Planetary Director & Robotics Envoys",
            "civics_focus": "Outer Space Treaty non-appropriation, shared life-support oxygen grids, and automated dispute tribunals.",
            "stem_focus": "Linear programming, resource rate-limiters, and multi-signature quorum consensus.",
            "lore": (
                "In 2050, permanent habitats across Shackleton Crater require automated life-support allocation. "
                "Under the Lunar Charter, base commanders pool solar wattage and water-ice extractors via decentralized algorithms "
                "that prevent resource monopolies."
            ),
            "instructions": [
                "Implement allocate_life_support(bases: dict, total_oxygen_kg: float, min_per_base: float)",
                "Ensure every base receives at least min_per_base before dividing surplus proportionately.",
                "Return a dictionary mapping base_name -> allocated_kg (rounded to 1 decimal place)."
            ],
            "starter_code": (
                "def allocate_life_support(bases: dict, total_oxygen_kg: float, min_per_base: float) -> dict:\n"
                "    # TODO: Allocate baseline oxygen and distribute surplus proportionally to population\n"
                "    pass\n"
            ),
            "solution_code": (
                "def allocate_life_support(bases: dict, total_oxygen_kg: float, min_per_base: float) -> dict:\n"
                "    allocated = {}\n"
                "    num_bases = len(bases)\n"
                "    total_pop = sum(bases.values())\n"
                "    baseline_total = num_bases * min_per_base\n"
                "    surplus = max(0.0, total_oxygen_kg - baseline_total)\n"
                "    \n"
                "    for base, pop in bases.items():\n"
                "        share = (pop / total_pop) * surplus if total_pop > 0 else 0\n"
                "        allocated[base] = round(min_per_base + share, 1)\n"
                "    return allocated\n"
            ),
            "hints": [
                "First allocate min_per_base to all bases to guarantee survival.",
                "Distribute remaining surplus according to base population weight."
            ],
            "badge_name": "Lunar Charter Consular",
            "badge_icon": "🚀"
        }
    }

    @classmethod
    def generate_track_from_prompt(cls, prompt: str, category: str = "custom", track_id: int = 101) -> Dict[str, Any]:
        """
        Synthesizes a complete curriculum track object from a user prompt.
        """
        prompt_lower = prompt.lower()
        
        # Match topic template or generate dynamic customized scenario
        if "egypt" in prompt_lower or "nile" in prompt_lower or "pharaoh" in prompt_lower:
            data = cls.TEMPLATES["egypt"].copy()
        elif "japan" in prompt_lower or "samurai" in prompt_lower or "shogun" in prompt_lower or "edo" in prompt_lower:
            data = cls.TEMPLATES["japan"].copy()
        elif "space" in prompt_lower or "moon" in prompt_lower or "lunar" in prompt_lower or "mars" in prompt_lower or "future" in prompt_lower:
            data = cls.TEMPLATES["space"].copy()
        else:
            # Dynamic synthesized scenario based on prompt
            cleaned_title = prompt.strip().title() if len(prompt) < 40 else "Custom Historical Civics & Coding Challenge"
            data = {
                "title": f"Custom Track: {cleaned_title}",
                "era": "Custom Historical Era & Civic Inflection Point",
                "historical_figure": "Historical Civic Scholar & Architect",
                "civics_focus": "Institutional consensus, civic equilibrium, and legal constraints.",
                "stem_focus": "Algorithmic decision trees, discrete state functions, and unit validation.",
                "lore": f"In this custom simulation based on '{prompt}', students investigate how technological constraints intersect with human rights and governance.",
                "instructions": [
                    "Implement `solve_custom_civic_challenge(inputs, constraints, threshold)`.",
                    "Verify all constraint conditions before approving state transition.",
                    "Return 'APPROVED' if conditions are met, otherwise return 'REJECTED'."
                ],
                "starter_code": (
                    "def solve_custom_civic_challenge(inputs: list, constraints: dict, threshold: int) -> str:\n"
                    "    # TODO: Implement custom civic logic rule\n"
                    "    pass\n"
                ),
                "solution_code": (
                    "def solve_custom_civic_challenge(inputs: list, constraints: dict, threshold: int) -> str:\n"
                    "    if sum(inputs) >= threshold and constraints.get('legal_quorum', False):\n"
                    "        return 'APPROVED'\n"
                    "    return 'REJECTED'\n"
                ),
                "hints": [
                    "Inspect constraints dictionary for the 'legal_quorum' boolean flag.",
                    "Sum inputs to confirm threshold compliance."
                ],
                "badge_name": f"Master of {cleaned_title[:20]}",
                "badge_icon": "⚡"
            }

        return {
            "id": track_id,
            "title": data["title"],
            "subtitle": f"AI-Synthesized Module • {data['stem_focus'][:45]}",
            "era": data["era"],
            "historicalFigure": {
                "name": data["historical_figure"],
                "title": "Historical Advisor & Civics Mentor",
                "avatar": data["badge_icon"]
            },
            "civicsFocus": data["civics_focus"],
            "stemFocus": data["stem_focus"],
            "lore": data["lore"],
            "instructions": data["instructions"],
            "starterCode": data["starter_code"],
            "solutionCode": data["solution_code"],
            "hints": data["hints"],
            "badgeName": data["badge_name"],
            "badgeIcon": data["badge_icon"],
            "simulationType": "dynamic_canvas",
            "dialogue": [
                {
                    "speaker": data["historical_figure"],
                    "avatar": data["badge_icon"],
                    "role": "Civic Guide",
                    "era": data["era"],
                    "text": f"Welcome, scholar. In this challenge, your algorithmic solutions determine the prosperity of our civilization.",
                    "options": [
                        {
                            "label": "Implement the optimal civic logic solution.",
                            "feedback": "Your analytical clarity protects the realm."
                        }
                    ]
                }
            ]
        }
