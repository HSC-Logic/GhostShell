# Architecture

React renders a terminal and investigation panel. FastAPI owns authoritative state.
SQLite stores JSON sessions using parameterized queries. Ollama supplies display-only
dialogue; scripted demo is a separate, explicit session mode.

## Modules

- `backend/app/story.py`: original files, seven clues, acts, hints and endings.
- `filesystem.py`: virtual paths, normalization, directory listings and act gates.
- `parser.py`: bounded shlex parsing and supported command list.
- `engine.py`: deterministic command effects, puzzle prerequisites and ending choices.
- `store.py`: SQLite connections, transactional CRUD and session persistence.
- `prompts.py`: personality instructions and bounded discovery-aware context.
- `ollama.py`: async HTTP adapter, timeouts and failure normalization.
- `main.py`: API validation, CORS and synchronization.
- `frontend/src/App.tsx`: session flow, terminal controls and recovery UI.

## API

All routes begin `/api`. `GET /health` checks Ollama tags. `/sessions` supports
GET and POST. `/sessions/{id}` supports GET and DELETE. POST `.../command` executes
a simulated action; POST `.../ghost` requests dialogue separately. PUT `.../journal`
saves notes. GET `.../export` downloads JSON. FastAPI `/docs` describes request schemas.

Commands persist before inference. Model failure therefore cannot undo discovery
or prevent filesystem exploration. State mutations use an async lock within the
single backend process. Inference runs outside the lock; changed history rejects
stale results. Run one worker. This is not a multi-user synchronization service.

## Context And Trust

The context includes the latest command, discovered clues, stage, selected persona,
up to four recently read files and four recent dialogue pairs. Context serialization
is capped at 10000 characters. Terminal history keeps 150 rows; conversation keeps
30 pairs. Hints are deterministic and supplied only when requested. Unread file
contents are omitted. Prompt instructions distinguish evidence from instructions.
This reduces spoilers and injection risk; it cannot guarantee model obedience.

No shell/subprocess execution exists in gameplay. Virtual paths cannot reach host
files. Length limits apply at API/parser boundaries. React renders generated text
as text, not HTML. SQLite queries are parameterized. Only the configured frontend
origin receives CORS access. No cloud fallback, telemetry or frontend secrets exist.

There is no authentication: local services and files inherit the machine user's
access. CORS is not authentication. Do not expose these ports on a public interface.
SQLite and JSON exports are not encrypted. Avoid entering sensitive personal data.
Stop waiting aborts the browser request; backend/Ollama work may continue until timeout.
Journal changes are explicit saves. No claim of secure erasure follows session deletion.

## Design Reference

Community reading: Nur Ahmad, *Shipping a Local LLM API with FastAPI and Ollama*:
https://dev.to/nur_ahmad_data/shipping-a-local-llm-api-with-fastapi-and-ollama-386l .
The useful principle is a thin HTTP adapter with bounded prompts and honest hardware
expectations. Its reported timings are not GhostShell benchmarks.
