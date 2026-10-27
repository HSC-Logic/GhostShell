# Validation Record

Development date: October 27, 2026. macOS, Python 3.9.6, Node 26.8.2, npm 11.19.1.

## Verified

- `cd backend && .venv/bin/python -m pytest -q`: 29 passed.
- `npm --prefix frontend test`: 3 passed under Vitest 4.1.12/jsdom.
- `npm --prefix frontend run build`: TypeScript and Vite production build pass.
- `npm --prefix frontend audit --json`: zero reported vulnerabilities after
  upgrading Vite to 7.3.7 and Vitest to 4.1.12. This is not a full security audit.
- Official Ollama tag page confirms `qwen2.5:1.5b` (986 MB); the official Qwen
  1.5B model card declares `apache-2.0`. References are in `model-guide.md`.
- API integration tests use httpx ASGI transport, not a real browser.
- Both complete story branches and SQLite reopen persistence are covered.
- Ollama success, empty output, malformed JSON, timeout, connection failure and
  HTTP failure use mock transport. Generated dialogue cannot mutate puzzle state.
- Frontend tests use an isolated Storage-compatible test object because Node 26's
  native localStorage interferes with jsdom. Production uses browser localStorage.

## Installed Versions

Frontend direct dependencies (exact pins; transitive tree in `frontend/package-lock.json`):
React/react-dom 19.2.0, TypeScript 5.9.3, Vite 7.3.7, Vitest 4.1.12,
@vitejs/plugin-react 5.0.4, jsdom 26.1.0, @types/react 19.2.2,
@types/react-dom 19.2.2, @testing-library/react 16.3.0,
@testing-library/user-event 14.6.1.

Backend: FastAPI 0.118.3, uvicorn 0.38.0, httpx 0.28.1,
python-dotenv 1.2.1, pytest 8.4.2. Installed transitive versions:
annotated-types 0.7.0, anyio 4.12.1, certifi 2026.10.23, click 8.1.8,
exceptiongroup 1.3.1, h11 0.16.0, httpcore 1.0.9, idna 3.20,
iniconfig 2.1.0, packaging 26.3, pluggy 1.6.0, pydantic 2.13.5,
pydantic_core 2.46.5, Pygments 2.21.0, starlette 0.48.0, tomli 2.5.0,
typing-inspection 0.4.2, typing_extensions 4.16.0.
Backend direct requirements are pinned; transitive versions can differ on reinstall.

## Not Verified

No responding Ollama service was available at 127.0.0.1:11434. Live inference remains
unverified; mock tests are not a substitute for running the configured model.
No real-browser visual/mobile/keyboard or screen-reader validation was completed.
Responsive CSS, semantic controls and reduced-motion CSS are implemented but need
manual inspection. No Windows/Linux installation run, offline test, performance
benchmark, screenshot, user study or measured gameplay duration is claimed.

Manual checklist: start a demo; finish both endings; reload/continue; save journal;
delete a disposable session; test arrows/Tab; inspect at 375px and desktop widths;
enable OS reduced motion; check focus visibility; stop/retry live generation;
disconnect networking only after dependencies/model are installed to test offline use.
