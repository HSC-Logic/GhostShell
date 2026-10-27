import json
import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone


class Store:
    def __init__(self, path):
        self.path = path
        with self.connect() as db:
            db.execute("CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, updated TEXT NOT NULL, state TEXT NOT NULL)")

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.path, timeout=10)
        try:
            with db:
                yield db
        finally:
            db.close()

    def save(self, session_id, state):
        with self.connect() as db:
            db.execute("INSERT INTO sessions VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET updated=excluded.updated,state=excluded.state", (session_id, datetime.now(timezone.utc).isoformat(), json.dumps(state)))

    def create(self, state):
        session_id = str(uuid.uuid4())
        self.save(session_id, state)
        return session_id

    def get(self, session_id):
        with self.connect() as db:
            row = db.execute("SELECT state FROM sessions WHERE id=?", (session_id,)).fetchone()
        return json.loads(row[0]) if row else None

    def list(self):
        with self.connect() as db:
            return [dict(id=row[0], updated=row[1], personality=json.loads(row[2])["personality"], stage=json.loads(row[2])["stage"], mode=json.loads(row[2])["mode"], ending=json.loads(row[2])["ending"]) for row in db.execute("SELECT id,updated,state FROM sessions ORDER BY updated DESC")]

    def delete(self, session_id):
        with self.connect() as db:
            db.execute("DELETE FROM sessions WHERE id=?", (session_id,))
