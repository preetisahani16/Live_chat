import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from .config import settings


def database_file() -> Path:
    configured = Path(settings.database_path)
    if configured.is_absolute():
        return configured
    return Path(__file__).resolve().parent.parent / configured


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(database_file())
    conn.row_factory = sqlite3.Row
    return conn


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def init_db() -> None:
    with connect() as conn:
        conn.executescript(
            '''
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                organisation_id TEXT NOT NULL,
                user_id TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                user_message TEXT NOT NULL,
                assistant_message TEXT NOT NULL,
                confidence REAL NOT NULL,
                intent TEXT NOT NULL,
                escalated INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS tickets (
                ticket_id TEXT PRIMARY KEY,
                session_id TEXT NOT NULL,
                reason TEXT NOT NULL,
                summary TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                helpful INTEGER NOT NULL,
                created_at TEXT NOT NULL
            );
            '''
        )


def save_session(token: str, organisation_id: str, user_id: str) -> None:
    with connect() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO sessions(token, organisation_id, user_id, created_at) VALUES (?, ?, ?, ?)",
            (token, organisation_id, user_id, now_iso()),
        )


def session_exists(token: str) -> bool:
    with connect() as conn:
        row = conn.execute("SELECT 1 FROM sessions WHERE token = ?", (token,)).fetchone()
        return row is not None


def delete_session(token: str) -> None:
    with connect() as conn:
        conn.execute("DELETE FROM sessions WHERE token = ?", (token,))


def save_conversation(session_id: str, user_message: str, assistant_message: str, confidence: float, intent: str, escalated: bool) -> None:
    with connect() as conn:
        conn.execute(
            '''
            INSERT INTO conversations
            (session_id, user_message, assistant_message, confidence, intent, escalated, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''',
            (session_id, user_message, assistant_message, confidence, intent, int(escalated), now_iso()),
        )


def create_ticket(ticket_id: str, session_id: str, reason: str, summary: str) -> None:
    with connect() as conn:
        conn.execute(
            '''
            INSERT INTO tickets(ticket_id, session_id, reason, summary, status, created_at)
            VALUES (?, ?, ?, ?, 'OPEN', ?)
            ''',
            (ticket_id, session_id, reason, summary, now_iso()),
        )


def save_feedback(session_id: str, helpful: bool) -> None:
    with connect() as conn:
        conn.execute(
            "INSERT INTO feedback(session_id, helpful, created_at) VALUES (?, ?, ?)",
            (session_id, int(helpful), now_iso()),
        )


def dashboard_stats() -> dict:
    with connect() as conn:
        total = conn.execute("SELECT COUNT(*) c FROM conversations").fetchone()["c"]
        escalated = conn.execute("SELECT COUNT(*) c FROM conversations WHERE escalated = 1").fetchone()["c"]
        avg_conf = conn.execute("SELECT COALESCE(AVG(confidence), 0) c FROM conversations").fetchone()["c"]
        helpful = conn.execute("SELECT COALESCE(AVG(helpful), 0) c FROM feedback").fetchone()["c"]
        intents = [dict(row) for row in conn.execute(
            "SELECT intent, COUNT(*) count FROM conversations GROUP BY intent ORDER BY count DESC LIMIT 5"
        ).fetchall()]
        recent = [dict(row) for row in conn.execute(
            '''
            SELECT session_id, user_message, confidence, intent, escalated, created_at
            FROM conversations ORDER BY id DESC LIMIT 8
            '''
        ).fetchall()]

    return {
        "total_queries": total,
        "automated_resolutions": max(total - escalated, 0),
        "escalations": escalated,
        "average_confidence": round(float(avg_conf), 2),
        "helpful_rate": round(float(helpful), 2),
        "top_intents": intents,
        "recent_queries": recent,
    }
