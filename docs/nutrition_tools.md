# Nutrition calculation tools (MuscleGrowthAI)

Deterministic fitness/nutrition math for advisor responses. LLM personas receive pre-computed values instead of doing arithmetic themselves.

## Tools in use

| Source | Cost | Status | Purpose |
|--------|------|--------|---------|
| **Local Python formulas** | Free | **Active** | lbs↔kg, protein g/kg (1.6–2.2), meal splits |
| **USDA FoodData Central** | Free (API key) | Planned | Food nutrient lookup by name/barcode |
| **Open Food Facts** | Free (no key) | Planned | Product/barcode nutrient data |

## Core formulas (local)

- **Weight:** `kg = lbs × 0.45359237`
- **Protein (hypertrophy):** `protein_g_min = round(weight_kg × 1.6)`, `protein_g_mid = round(weight_kg × 1.9)`, `protein_g_max = round(weight_kg × 2.2)`
- **Meal split:** even distribution with remainder assigned to first meals

Example: **230 lb** → **104.33 kg** → **167–230 g protein/day**; midpoint at **1.9 g/kg** ≈ **~198 g/day** (4 meals ≈ 50/50/49/49 g at the midpoint).

## How calculations reach advisors

1. **Context injection (primary):** When chat history mentions protein and a body weight is present, `compute_protein_advisory_context()` runs in `_build_enhanced_context_for_persona()` and adds a `PRE-COMPUTED NUTRITION VALUES` JSON block to each persona system prompt.
2. **LLM tool calling (optional):** `calculate_protein_target` is registered in `app/tools/nutrition_calculator.py` and enabled via `muscle_growth_config.yaml` → `tools.nutrition_calculator.enabled: true`. The orchestrator may call it for direct tool responses when appropriate.

## Files

- `multi_llm_chatbot_backend/app/tools/nutrition_calculator.py` — formulas + tool definition
- `multi_llm_chatbot_backend/app/core/improved_orchestrator.py` — injects computed context into persona prompts
- `muscle_growth_config.yaml` — enables `nutrition_calculator` tool

## USDA / Open Food Facts (later)

- USDA: register at [https://fdc.nal.usda.gov/api-key-signup](https://fdc.nal.usda.gov/api-key-signup), set `USDA_API_KEY` env var.
- Open Food Facts: `https://world.openfoodfacts.org/api/v2/product/{barcode}` — no key required.
