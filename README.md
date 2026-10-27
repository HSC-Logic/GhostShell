# GhostShell

**Some processes never die.** A local-first haunted terminal mystery: three acts,
seven clues, two puzzles, two explicit endings, three ghost personalities.
Every terminal command runs in a fictional filesystem. Nothing executes in your shell.
The ghost is fictional software, never a real deceased person.

## Requirements

Node.js 22.12+ (or a compatible newer release), npm, Python 3.9+ and a browser.
Python 3.11+ is recommended for new installations. Ollama and a manually installed
model are needed only for live dialogue. Dependency installation requires internet.
No model is downloaded automatically. No hosted AI API or telemetry is used.

## macOS / Linux

From the repository root:

```sh
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm --prefix frontend ci
cd backend
.venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

In a second terminal, from the repository root:

```sh
npm --prefix frontend run dev
```

## Windows PowerShell

```powershell
py -m venv backend/.venv
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env
npm --prefix frontend ci
cd backend
.venv/Scripts/python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Second terminal, repository root: `npm --prefix frontend run dev`.
These instructions avoid virtual-environment activation and execution-policy changes.

Open http://localhost:5173 (not the numeric host: CORS permits that exact origin).
Select **Scripted demo** to play without Ollama. This mode is labeled prewritten,
not AI-generated. Live mode calls your configured Ollama model after relevant actions.
Commands remain usable if inference fails; retry ghost dialogue independently.

## Live Local Dialogue

Install Ollama from https://ollama.com, then run:

```sh
ollama serve
ollama pull qwen2.5:1.5b
```

The desktop Ollama app may already provide the server; do not start a second one.
Refresh model status in GhostShell and select live mode for a new session.
See [model configuration](docs/model-guide.md) for license and resource caveats.

## Checks

```sh
cd backend
.venv/bin/python -m pytest -q
cd ..
npm --prefix frontend test
npm --prefix frontend run build
```

Windows: substitute `.venv/Scripts/python.exe` for `.venv/bin/python`.
The backend test command must run from `backend`, where `app` is importable.

## Controls And Data

`help` lists commands. Arrow keys recall commands; Tab completes basic candidates.
`whisper hint` asks for increasingly explicit, discovery-aware hints.
Use the investigation panel for clues, journal, export and progress.
Journal edits require Save. `reset` requires `reset confirm`.
Session deletion asks for confirmation and permanently removes that local session.
Browser localStorage stores only a session pointer and effects preference; SQLite
stores the investigation. Default DB: `backend/ghostshell.sqlite3` when launched as above.
Exports contain player notes and dialogue: review before sharing.

## Guides

- [Architecture and boundaries](docs/architecture.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Three-minute recording and walkthrough](docs/demo-script.md) (spoilers)
- [Challenge article draft](docs/challenge-post.md)
- [Verified checks, versions and limitations](docs/testing.md)

No deployment or publication is included. Keep both services bound to localhost;
this is a single-user local application, not an authenticated public service.
