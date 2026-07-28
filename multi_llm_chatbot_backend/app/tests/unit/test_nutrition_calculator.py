import unittest

from app.tools.nutrition_calculator import (
    bodyweight_to_kg,
    compute_protein_advisory_context,
    conversation_mentions_protein,
    extract_weight_from_text,
    meal_split,
    protein_target_g,
)


class TestBodyweightConversion(unittest.TestCase):
    def test_230_lbs_to_kg(self):
        self.assertEqual(bodyweight_to_kg(230, "lb"), 104.33)

    def test_kg_passthrough(self):
        self.assertEqual(bodyweight_to_kg(104.33, "kg"), 104.33)

    def test_unsupported_unit_raises(self):
        with self.assertRaises(ValueError):
            bodyweight_to_kg(100, "stone")


class TestProteinTarget(unittest.TestCase):
    def test_230_lbs_protein_range(self):
        weight_kg = bodyweight_to_kg(230, "lb")
        protein = protein_target_g(weight_kg)
        self.assertEqual(weight_kg, 104.33)
        self.assertEqual(protein["protein_g_min"], 167)
        self.assertEqual(protein["protein_g_mid"], 198)
        self.assertEqual(protein["protein_g_max"], 230)


class TestMealSplit(unittest.TestCase):
    def test_splits_evenly_with_remainder(self):
        result = meal_split(167, meals=4)
        self.assertEqual(result["per_meal_g"], [42, 42, 42, 41])
        self.assertEqual(sum(result["per_meal_g"]), 167)

    def test_requires_positive_meals(self):
        with self.assertRaises(ValueError):
            meal_split(100, meals=0)


class TestWeightExtraction(unittest.TestCase):
    def test_extracts_lbs(self):
        info = extract_weight_from_text("I weigh 230 lbs")
        self.assertIsNotNone(info)
        self.assertEqual(info["value"], 230)
        self.assertEqual(info["unit"], "lb")
        self.assertEqual(info["weight_kg"], 104.33)

    def test_extracts_kg(self):
        info = extract_weight_from_text("about 104.33 kg")
        self.assertIsNotNone(info)
        self.assertEqual(info["weight_kg"], 104.33)

    def test_standalone_number_defaults_to_lb(self):
        info = extract_weight_from_text("230")
        self.assertIsNotNone(info)
        self.assertEqual(info["unit"], "lb")


class TestProteinAdvisoryContext(unittest.TestCase):
    def test_computes_from_conversation(self):
        messages = [
            {"role": "user", "content": "how much protein should I consume?"},
            {"role": "nutrition_strategist", "content": "What is your body weight?"},
            {"role": "user", "content": "230 lbs"},
        ]
        computed = compute_protein_advisory_context(messages)
        self.assertIsNotNone(computed)
        self.assertEqual(computed["weight_kg"], 104.33)
        self.assertEqual(computed["protein_g_min"], 167)
        self.assertEqual(computed["protein_g_mid"], 198)
        self.assertEqual(computed["protein_g_max"], 230)
        self.assertEqual(len(computed["meal_split_min_g"]), 4)

    def test_returns_none_without_protein_topic(self):
        messages = [{"role": "user", "content": "230 lbs"}]
        self.assertIsNone(compute_protein_advisory_context(messages))

    def test_returns_none_without_weight(self):
        messages = [{"role": "user", "content": "how much protein per day?"}]
        self.assertIsNone(compute_protein_advisory_context(messages))

    def test_conversation_mentions_protein(self):
        self.assertTrue(conversation_mentions_protein("How much protein should I eat?"))
        self.assertFalse(conversation_mentions_protein("best chest exercises"))


if __name__ == "__main__":
    unittest.main()
