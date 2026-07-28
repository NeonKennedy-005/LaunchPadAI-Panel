"""Helpers for loading secrets and redacting them from client-facing errors."""

from __future__ import annotations

import re

_SK_RE = re.compile(r"sk-(?:proj-)?[A-Za-z0-9_\-]{6,}")


def normalize_secret(value: str | None) -> str:
    """Strip whitespace and accidental surrounding quotes from a secret value.

    Hugging Face Space secret pastes sometimes include trailing newlines or
    wrapping quotes; either produces an otherwise-valid-looking key that
    OpenAI rejects with 401 invalid_api_key.
    """
    text = (value or "").strip()
    if len(text) >= 2 and text[0] == text[-1] and text[0] in ("'", '"'):
        text = text[1:-1].strip()
    return text


def client_safe_error_message(exc: BaseException) -> str:
    """Return an error string safe to show end users (no API key material)."""
    text = str(exc)
    lowered = text.lower()
    if "invalid_api_key" in lowered or "incorrect api key" in lowered:
        return (
            "OpenAI rejected the API key. Update the OPENAI_API_KEY secret under "
            "Hugging Face Space Settings → Variables and secrets, then restart "
            "the Space."
        )
    if "authenticationerror" in type(exc).__name__.lower() or (
        "401" in text and "api" in lowered
    ):
        return (
            "OpenAI authentication failed. Check that OPENAI_API_KEY is set "
            "correctly in Space secrets and that the key is still valid."
        )
    return _SK_RE.sub("sk-***", text)
