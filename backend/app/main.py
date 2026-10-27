import anyio
import os
from pathlib import Path
from typing import Literal
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from .engine import execute, initial
from .filesystem import DIRECTORIES, listing, required_act
from .ollama import ModelError, Ollama
from .parser import COMMANDS
from .prompts import messages, scripted
from .store import Store
from .story import CLUES

load_dotenv(Path(__file__).resolve().parents[1] / ".env")


class NewSession(BaseModel):
    personality: Literal["archivist", "trickster", "debugger"] = "archivist"
    mode: Literal["live", "demo"] = "live"


class Command(BaseModel):
    command: str = Field(min_length=1, max_length=1000)


class Journal(BaseModel):
    text: str = Field(max_length=10000)


def create_app(database=None, model=None):
    app = FastAPI(title="GhostShell", docs_url="/docs")
    app.add_middleware(CORSMiddleware, allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")], allow_methods=["GET", "POST", "PUT", "DELETE"], allow_headers=["Content-Type"])
    store = Store(database or os.getenv("DATABASE_PATH", str(Path(__file__).resolve().parents[1] / "ghostshell.sqlite3")))
    ghost = model or Ollama(os.getenv("OLLAMA_URL", "http://127.0.0.1:11434"), os.getenv("OLLAMA_MODEL", "qwen2.5:1.5b"), float(os.getenv("OLLAMA_TIMEOUT", "45")))
    lock = anyio.Lock()

    def get(session_id):
        state = store.get(session_id)
        if state is None:
            raise HTTPException(404, "Investigation not found.")
        return state

    def public(session_id, state):
        return dict(id=session_id, **state, clue_details={key: CLUES[key] for key in state["clues"]}, completions=list(COMMANDS) + [path for path in DIRECTORIES if required_act(path) <= state["stage"]] + listing(state["cwd"], state["stage"]).replace(" [locked]", "").splitlines())

    @app.get("/api/health")
    async def health():
        return dict(status="ok", model=await ghost.status())

    @app.get("/api/sessions")
    def sessions():
        return store.list()

    @app.post("/api/sessions", status_code=201)
    async def create(body: NewSession):
        async with lock:
            state = initial(body.personality, body.mode)
            return public(store.create(state), state)

    @app.get("/api/sessions/{session_id}")
    def read(session_id: str):
        return public(session_id, get(session_id))

    @app.delete("/api/sessions/{session_id}", status_code=204)
    async def delete(session_id: str):
        async with lock:
            get(session_id)
            store.delete(session_id)

    @app.post("/api/sessions/{session_id}/command")
    async def command(session_id: str, body: Command):
        async with lock:
            state = get(session_id)
            try:
                result = execute(state, body.command)
            except ValueError as error:
                raise HTTPException(422, str(error))
            store.save(session_id, state)
            return dict(**result, session=public(session_id, state))

    @app.post("/api/sessions/{session_id}/ghost")
    async def dialogue(session_id: str):
        state = get(session_id)
        if not state["history"]:
            raise HTTPException(409, "Execute a command first.")
        history = state["history"]
        command = history[-1]["command"]
        try:
            text = scripted(state) if state["mode"] == "demo" else await ghost.generate(messages(state, command))
        except ModelError as error:
            return JSONResponse(status_code=503, content=dict(detail=str(error)))
        async with lock:
            current = get(session_id)
            if current["history"] != history:
                raise HTTPException(409, "Investigation changed during inference. Retry for current evidence.")
            current["conversation"] = (current["conversation"] + [dict(command=command, text=text, source="scripted demo" if state["mode"] == "demo" else "local model")])[-30:]
            store.save(session_id, current)
        return dict(text=text, source="scripted demo" if state["mode"] == "demo" else "local model", session=public(session_id, current))

    @app.put("/api/sessions/{session_id}/journal")
    async def journal(session_id: str, body: Journal):
        async with lock:
            state = get(session_id)
            state["journal"] = body.text
            store.save(session_id, state)
            return public(session_id, state)

    @app.get("/api/sessions/{session_id}/export")
    def export(session_id: str):
        return JSONResponse(dict(id=session_id, **get(session_id)), headers={"Content-Disposition": 'attachment; filename="ghostshell-investigation.json"'})

    return app


app = create_app()
