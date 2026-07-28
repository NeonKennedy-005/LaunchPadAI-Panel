import asyncio
import unittest

from app.tools.nutrition_calculator import TOOL_DEFINITION, execute


class TestNutritionCalculatorTool(unittest.TestCase):
    def test_tool_definition_shape(self):
        self.assertEqual(TOOL_DEFINITION["type"], "function")
        self.assertEqual(
            TOOL_DEFINITION["function"]["name"],
            "calculate_protein_target",
        )

    def test_execute_230_lbs(self):
        result = asyncio.run(execute(weight=230, unit="lb", meals=4))
        self.assertEqual(result["weight_kg"], 104.33)
        self.assertEqual(result["protein_g_min"], 167)
        self.assertEqual(result["protein_g_mid"], 198)
        self.assertEqual(result["protein_g_max"], 230)
        self.assertEqual(sum(result["meal_split_min_g"]), 167)

    def test_execute_missing_args(self):
        result = asyncio.run(execute())
        self.assertIn("error", result)
