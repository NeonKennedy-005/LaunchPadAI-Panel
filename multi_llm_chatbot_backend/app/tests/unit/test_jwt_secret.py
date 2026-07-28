import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from app.config import resolve_jwt_secret


class TestResolveJwtSecret(unittest.TestCase):
    def test_prefers_explicit_config_value(self):
        self.assertEqual(resolve_jwt_secret("from-config"), "from-config")

    @patch.dict(os.environ, {"JWT_SECRET_KEY": "from-env"}, clear=False)
    def test_uses_env_when_config_empty(self):
        self.assertEqual(resolve_jwt_secret(""), "from-env")

    def test_persists_generated_secret_to_data_dir(self):
        with tempfile.TemporaryDirectory() as tmp:
            with patch.dict(os.environ, {"DATA_DIR": tmp, "JWT_SECRET_KEY": ""}, clear=False):
                first = resolve_jwt_secret("")
                second = resolve_jwt_secret("")
                secret_path = Path(tmp) / "jwt_secret"
                self.assertTrue(secret_path.is_file())
                self.assertEqual(first, second)
                self.assertGreater(len(first), 20)


if __name__ == "__main__":
    unittest.main()
