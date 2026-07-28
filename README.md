---
title: LaunchPadAI
emoji: 🚀
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
app_port: 7860
---

# LaunchPadAI Panel

An AI undergraduate internship and early-career assistant built on Neon AI's
Collaborative Conversational AI (CCAI) framework. Ask about Handshake/LinkedIn
search, resume polish, interview prep, application cadence, and networking —
and get diverse perspectives from a panel of five career AI advisors.

This repository is a **complete, deployable application** — the CCAI
multi-advisor stack (FastAPI backend + React frontend) wired to the
LaunchPadAI configuration in [`launchpad_config.yaml`](launchpad_config.yaml)
and the personas in [`personas/career_advisors/`](personas/career_advisors).

## Advisors

1. **Internship Search Strategist** — roles, platforms, target lists
2. **Resume Optimizer** — ATS, bullets, skills match
3. **Interview Coach** — prep, presence, company research
4. **Application Scheduler** — cadence, deadlines, tracking
5. **Career Path Mentor** — networking, pivot, full-time transition

## Hugging Face Spaces deployment

This Space ships as a single Docker image built from the repository-root
[`Dockerfile`](Dockerfile). The container:

1. Builds the React frontend (CRA) at image-build time with `REACT_APP_API_URL=""`
   so every `fetch` issues a relative URL.
2. Serves the bundled SPA from FastAPI at `/`, with the API on `/api/...`,
   `/auth/...`, etc. — all on the same `:7860` origin.
3. Persists user data (auth, profiles, chat sessions) in **SQLite via
   `aiosqlite`** at `${DATA_DIR}/launchpad_panel.db`. Mount a Hugging Face
   Storage Bucket at `/data` to make the database survive Space rebuilds.
   There is **no MongoDB** and no third-party data plane.

### Required Space secrets

| Secret | Purpose |
|--------|---------|
| `JWT_SECRET_KEY` | Signs auth tokens. Set this to a long random string. |
| `OPENAI_API_KEY` | Powers the default OpenAI provider (`gpt-5.4-mini`). |
| `GEMINI_API_KEY` | Optional — only if you switch `llm.provider` back to `gemini`. |

Set these under **Settings → Variables and secrets** on the Space.

## Local deployment

### Option A — Docker

```bash
# From the repo root, create a .env with at least:
#   JWT_SECRET_KEY=some-long-random-string
#   OPENAI_API_KEY=your-openai-key
docker compose up --build
```

Open <http://localhost:7860>. Override the host port with `LAUNCHPAD_HOST_PORT` if
7860 is taken.

### Option B — Native (no Docker)

**Backend** (terminal 1):

```bash
cd multi_llm_chatbot_backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
CONFIG_PATH=../launchpad_config.yaml uvicorn app.main:app --reload --port 8000
```

**Frontend** (terminal 2):

```bash
cd phd-advisor-frontend
npm install
REACT_APP_API_URL=http://localhost:8000 npm start
```

Open <http://localhost:3000> — you should see **LaunchPadAI** with five career advisors.

## Configuration

App UI, login fields, chat examples, orchestrator keywords, and LLM/RAG
settings live in [`launchpad_config.yaml`](launchpad_config.yaml). The five
advisor YAMLs in `personas/career_advisors/` load automatically. Point the app at a
different config with `CONFIG_PATH`.

The workshop draft that generated this panel is saved as
[`advisor-panel-draft.json`](advisor-panel-draft.json).
