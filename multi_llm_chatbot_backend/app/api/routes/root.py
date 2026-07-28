from fastapi import APIRouter
from app.config import get_settings
from app.core.secrets import normalize_secret
from app.version import __version__

import logging
import os

logger = logging.getLogger(__name__)

router = APIRouter()

# NB: keep this OFF the bare "/" path. In the single-container / Hugging Face
# Spaces deployment the React SPA is mounted at "/" as a catch-all, and any
# API route registered at exactly "/" would shadow the SPA's index.html and
# leave users staring at this JSON banner instead of the app.
@router.get("/api/health")
def root():
    settings = get_settings()
    title = settings.app.title
    openai_key_configured = bool(
        normalize_secret(settings.llm.openai.api_key)
        or normalize_secret(os.getenv("OPENAI_API_KEY", ""))
    )
    return {
        "message": f"{title} Backend is up and running",
        "version": __version__,
        "llm_provider": settings.llm.provider,
        "openai_api_key_configured": openai_key_configured,
        "features": [
            "Configurable Personas",
            "Improved Session Management",
            "Unified Context Handling",
            "Ollama Support",
            "Gemini API Support",
            "Provider Switching"
        ]
    }
