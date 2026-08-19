"""Seed LaunchPad's bundled knowledge/*.md files into a shared Chroma session.

User uploads still work per-chat. This pack makes the shipped career corpus
searchable without requiring every guest to re-upload markdown files.
"""

from __future__ import annotations

import logging
import os
from pathlib import Path
from typing import Iterable, List

logger = logging.getLogger(__name__)

KNOWLEDGE_PACK_SESSION_ID = "__launchpad_knowledge_pack__"


def _candidate_knowledge_roots() -> List[Path]:
    roots: List[Path] = []
    explicit = os.environ.get("KNOWLEDGE_DIR", "").strip()
    if explicit:
        roots.append(Path(explicit))
    # Docker / HF image layout: /home/user/app/knowledge
    roots.append(Path("/home/user/app/knowledge"))
    # Repo layout relative to this file: <repo>/knowledge
    roots.append(Path(__file__).resolve().parents[3] / "knowledge")
    # Backend cwd sibling
    roots.append(Path.cwd().parent / "knowledge")
    roots.append(Path.cwd() / "knowledge")
    # Duplicate corpus kept under docs/career_knowledge
    roots.append(Path("/home/user/app/docs/career_knowledge"))
    roots.append(Path(__file__).resolve().parents[3] / "docs" / "career_knowledge")
    return roots


def resolve_knowledge_dir() -> Path | None:
    for root in _candidate_knowledge_roots():
        if root.is_dir():
            return root
    return None


def iter_knowledge_markdown(knowledge_dir: Path) -> Iterable[Path]:
    for path in sorted(knowledge_dir.rglob("*.md")):
        if path.name.upper() in {"README.MD", "SOURCES.MD"}:
            continue
        yield path


def seed_bundled_knowledge_pack() -> dict:
    """Idempotently ingest bundled knowledge markdown into Chroma."""
    from app.core.rag_manager import get_rag_manager

    knowledge_dir = resolve_knowledge_dir()
    if knowledge_dir is None:
        logger.warning("Knowledge directory not found; skipping pack seed")
        return {"seeded": 0, "skipped": 0, "error": "knowledge_dir_missing"}

    rag = get_rag_manager()
    stats = rag.get_document_stats(KNOWLEDGE_PACK_SESSION_ID)
    existing = {
        (d.get("filename") or "")
        for d in (stats.get("documents") or [])
    }

    seeded = 0
    skipped = 0
    errors = 0
    for path in iter_knowledge_markdown(knowledge_dir):
        rel = path.relative_to(knowledge_dir).as_posix()
        filename = f"knowledge/{rel}"
        if filename in existing or path.name in existing:
            skipped += 1
            continue
        try:
            content = path.read_text(encoding="utf-8", errors="replace")
            if not content.strip():
                skipped += 1
                continue
            result = rag.add_document(
                content=content,
                filename=filename,
                session_id=KNOWLEDGE_PACK_SESSION_ID,
                file_type="markdown",
            )
            if result.get("success"):
                seeded += 1
            else:
                errors += 1
                logger.warning("Failed to seed %s: %s", filename, result.get("error"))
        except Exception as exc:
            errors += 1
            logger.warning("Error seeding %s: %s", path, exc)

    summary = {
        "knowledge_dir": str(knowledge_dir),
        "seeded": seeded,
        "skipped": skipped,
        "errors": errors,
        "session_id": KNOWLEDGE_PACK_SESSION_ID,
    }
    logger.info("Knowledge pack seed complete: %s", summary)
    return summary
