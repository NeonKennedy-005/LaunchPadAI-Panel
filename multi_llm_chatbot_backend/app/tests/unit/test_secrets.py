"""Unit tests for secret normalization and client-safe error messages."""

import unittest

from app.core.secrets import client_safe_error_message, normalize_secret


class NormalizeSecretTests(unittest.TestCase):
    def test_strips_whitespace(self):
        self.assertEqual(normalize_secret("  sk-abc  \n"), "sk-abc")

    def test_strips_wrapping_quotes(self):
        self.assertEqual(normalize_secret('"sk-abc"'), "sk-abc")
        self.assertEqual(normalize_secret("'sk-abc'"), "sk-abc")

    def test_empty(self):
        self.assertEqual(normalize_secret(None), "")
        self.assertEqual(normalize_secret(""), "")


class ClientSafeErrorMessageTests(unittest.TestCase):
    def test_redacts_api_key_material(self):
        raw = (
            "Error code: 401 - {'error': {'message': "
            "'Incorrect API key provided: sk-proj-ABCDEFGHIJKLMNOP. "
            "You can find your API key at https://platform.openai.com/account/api-keys.', "
            "'type': 'invalid_request_error', 'code': 'invalid_api_key'}}"
        )
        safe = client_safe_error_message(Exception(raw))
        self.assertNotIn("sk-proj-ABCDEF", safe)
        self.assertIn("OPENAI_API_KEY", safe)

    def test_passes_through_unrelated_errors(self):
        msg = "Connection timed out talking to upstream"
        self.assertEqual(client_safe_error_message(Exception(msg)), msg)


if __name__ == "__main__":
    unittest.main()
