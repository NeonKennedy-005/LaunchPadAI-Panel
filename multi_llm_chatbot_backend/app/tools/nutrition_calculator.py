"""Deterministic fitness/nutrition calculations for MuscleGrowthAI advisors.

Core math is local (no API). Optional future integrations:
- USDA FoodData Central (free, API key) — food nutrient lookup
- Open Food Facts (free, no key) — barcode / product lookup
"""

from __future__ import annotations

import json
import re
from typing import Any, Dict, List, Optional, Tuple

_LB_TO_KG = 0.45359237
_KG_TO_LB = 1 / _LB_TO_KG

_G_PER_KG_MID = 1.9  # midpoint of 1.6–2.2 g/kg hypertrophy range

_PROTEIN_TOPIC_KEYWORDS = (
    "protein",
    "macro",
    "macros",
    "g/kg",
    "grams of protein",
    "how much protein",
    "protein intake",
    "protein target",
    "protein goal",
)

_WEIGHT_PATTERNS: List[Tuple[str, str]] = [
    (r"(\d+(?:\.\d+)?)\s*(?:lbs?|pounds?)\b", "lb"),
    (r"(\d+(?:\.\d+)?)\s*(?:kgs?|kilos?)\b", "kg"),
    (r"(\d+(?:\.\d+)?)\s*kg\b", "kg"),
    (r"(?:weigh(?:s)?|weight(?:\s+is)?|at)\s+(\d+(?:\.\d+)?)\b", "lb"),
    (r"^\s*(\d{2,3}(?:\.\d+)?)\s*$", "lb"),
    (r"i['']?m\s+(\d+(?:\.\d+)?)\b", "lb"),
    (r"i am\s+(\d+(?:\.\d+)?)\b", "lb"),
]


def bodyweight_to_kg(value: float, unit: str) -> float:
    """Convert body weight to kilograms."""
    unit_norm = unit.strip().lower()
    if unit_norm in {"lb", "lbs", "pound", "pounds"}:
        return round(value * _LB_TO_KG, 2)
    if unit_norm in {"kg", "kgs", "kilo", "kilos", "kilogram", "kilograms"}:
        return round(value, 2)
    raise ValueError(f"Unsupported weight unit: {unit!r}")


def protein_target_g(
    weight_kg: float,
    g_per_kg_low: float = 1.6,
    g_per_kg_high: float = 2.2,
    g_per_kg_mid: float = _G_PER_KG_MID,
) -> Dict[str, int]:
    """Return rounded daily protein range in grams for hypertrophy."""
    return {
        "protein_g_min": round(weight_kg * g_per_kg_low),
        "protein_g_mid": round(weight_kg * g_per_kg_mid),
        "protein_g_max": round(weight_kg * g_per_kg_high),
    }


def meal_split(total_g: int, meals: int = 4) -> Dict[str, Any]:
    """Split a daily protein target across meals (integer grams per meal)."""
    if meals < 1:
        raise ValueError("meals must be at least 1")
    base = total_g // meals
    remainder = total_g % meals
    per_meal = [base + (1 if i < remainder else 0) for i in range(meals)]
    return {
        "meals": meals,
        "total_g": total_g,
        "per_meal_g": per_meal,
        "per_meal_avg": round(total_g / meals, 1),
    }


def _plausible_body_weight(value: float, unit: str) -> bool:
    """Reject obvious non-body-weight numbers (age, reps, etc.)."""
    if unit == "kg":
        return 35 <= value <= 250
    return 80 <= value <= 550


def extract_weight_from_text(text: str, default_unit: str = "lb") -> Optional[Dict[str, Any]]:
    """Parse the first plausible body-weight mention from *text*."""
    for pattern, unit in _WEIGHT_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if not match:
            continue
        value = float(match.group(1))
        resolved_unit = unit or default_unit
        if not _plausible_body_weight(value, resolved_unit):
            continue
        weight_kg = bodyweight_to_kg(value, resolved_unit)
        return {
            "value": value,
            "unit": resolved_unit,
            "weight_kg": weight_kg,
            "source_text": match.group(0).strip(),
        }
    return None


def conversation_mentions_protein(text: str) -> bool:
    lowered = text.lower()
    return any(keyword in lowered for keyword in _PROTEIN_TOPIC_KEYWORDS)


def compute_protein_advisory_context(
    messages: List[Dict[str, str]],
    *,
    g_per_kg_low: float = 1.6,
    g_per_kg_high: float = 2.2,
    meals: int = 4,
) -> Optional[Dict[str, Any]]:
    """When protein is discussed and weight is known, return structured facts."""
    combined_text = "\n".join(
        msg.get("content", "")
        for msg in messages
        if msg.get("role") != "system"
    )
    if not conversation_mentions_protein(combined_text):
        return None

    weight_info: Optional[Dict[str, Any]] = None
    for msg in reversed(messages):
        if msg.get("role") == "system":
            continue
        weight_info = extract_weight_from_text(msg.get("content", ""))
        if weight_info:
            break

    if not weight_info:
        return None

    weight_kg = weight_info["weight_kg"]
    protein = protein_target_g(weight_kg, g_per_kg_low, g_per_kg_high)
    split_min = meal_split(protein["protein_g_min"], meals=meals)
    split_mid = meal_split(protein["protein_g_mid"], meals=meals)
    split_max = meal_split(protein["protein_g_max"], meals=meals)

    return {
        "topic": "protein",
        "weight_input": {
            "value": weight_info["value"],
            "unit": weight_info["unit"],
            "source_text": weight_info["source_text"],
        },
        "weight_kg": weight_kg,
        "protein_g_min": protein["protein_g_min"],
        "protein_g_mid": protein["protein_g_mid"],
        "protein_g_max": protein["protein_g_max"],
        "g_per_kg_range": [g_per_kg_low, g_per_kg_high],
        "g_per_kg_mid": _G_PER_KG_MID,
        "meal_split_min_g": split_min["per_meal_g"],
        "meal_split_mid_g": split_mid["per_meal_g"],
        "meal_split_max_g": split_max["per_meal_g"],
        "meals": meals,
        "formula": "protein_g = weight_kg × g_per_kg (Mifflin-independent; hypertrophy range 1.6–2.2 g/kg)",
    }


def format_computed_context_block(computed: Dict[str, Any]) -> str:
    """Serialize computed values for injection into persona system prompts."""
    return (
        "PRE-COMPUTED NUTRITION VALUES (deterministic Python; use these exact "
        "numbers — do not recalculate or guess):\n"
        f"{json.dumps(computed, indent=2)}"
    )


# ---------------------------------------------------------------------------
# LLM tool surface (optional direct orchestrator path)
# ---------------------------------------------------------------------------

TOOL_DEFINITION = {
    "type": "function",
    "function": {
        "name": "calculate_protein_target",
        "description": (
            "Compute daily protein targets in grams from body weight using the "
            "hypertrophy range 1.6–2.2 g/kg. Use when the user asks about protein "
            "intake and provides or implies body weight."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "weight": {
                    "type": "number",
                    "description": "Body weight numeric value.",
                },
                "unit": {
                    "type": "string",
                    "enum": ["lb", "kg"],
                    "description": "Unit for weight (lb or kg).",
                },
                "meals": {
                    "type": "integer",
                    "description": "Number of meals to split protein across (default 4).",
                },
            },
            "required": ["weight", "unit"],
        },
    },
}


async def execute(
    name: str = "",
    weight: float | None = None,
    unit: str | None = None,
    meals: int = 4,
    **_: Any,
) -> Dict[str, Any]:
    if weight is None or unit is None:
        return {"error": "weight and unit are required"}

    try:
        weight_kg = bodyweight_to_kg(float(weight), unit)
        protein = protein_target_g(weight_kg)
        split_min = meal_split(protein["protein_g_min"], meals=max(1, int(meals)))
        split_mid = meal_split(protein["protein_g_mid"], meals=max(1, int(meals)))
        split_max = meal_split(protein["protein_g_max"], meals=max(1, int(meals)))
    except (TypeError, ValueError) as exc:
        return {"error": str(exc)}

    return {
        "weight_kg": weight_kg,
        "protein_g_min": protein["protein_g_min"],
        "protein_g_mid": protein["protein_g_mid"],
        "protein_g_max": protein["protein_g_max"],
        "g_per_kg_range": [1.6, 2.2],
        "g_per_kg_mid": _G_PER_KG_MID,
        "meal_split_min_g": split_min["per_meal_g"],
        "meal_split_mid_g": split_mid["per_meal_g"],
        "meal_split_max_g": split_max["per_meal_g"],
        "meals": max(1, int(meals)),
    }
