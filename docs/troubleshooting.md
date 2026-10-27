# Troubleshooting

- **Machine silent:** run the backend from `backend`; inspect terminal errors.
  Visit http://127.0.0.1:8000/api/health .
- **CORS/network error:** open http://localhost:5173 . `127.0.0.1:5173` is a different
  origin. Change `FRONTEND_ORIGIN` deliberately if using another origin; restart backend.
- **Port occupied:** stop the existing process or change ports and both environment
  files consistently. Vite uses strictPort rather than silently changing origin.
- **Model unavailable:** run `ollama list`, verify exact `OLLAMA_MODEL`, start Ollama,
  pull the model manually and retry status. Installed tags do not prove successful inference.
- **Timeout/empty response:** retry, use a smaller model, free memory or increase
  `OLLAMA_TIMEOUT`. Exploration still works. No silent demo/cloud substitution occurs.
- **Node installation/build error:** use Node 22.12+ and `npm --prefix frontend ci`.
  If npm blocks esbuild installation scripts, review npm's warning and approve only
  the dependency you trust using that npm version's install-scripts workflow.
- **Python import error:** execute tests and uvicorn from `backend`, not repository root.
  Use the virtual environment's Python, not a globally installed uvicorn.
- **Missing saved session:** browser storage is only a pointer. Preserve the SQLite
  file and keep `DATABASE_PATH` stable; relative paths follow backend working directory.
- **Journal lost:** click Save before closing the page. Save & exit warns about changes;
  closing the browser does not guarantee an unsaved-changes warning.
- **Reduced motion:** operating-system reduced-motion preference disables animations;
  Effects off also removes optional CRT effects. The panel toggles on narrow screens.

Back up the SQLite file while the backend is stopped. To erase an investigation,
use its Delete action; this does not promise forensic erasure from disk or backups.
