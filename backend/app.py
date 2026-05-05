from __future__ import annotations

import hashlib
import os
import secrets
import sqlite3
from dataclasses import dataclass
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data", "app.db")
STATIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "dist"))

app = FastAPI(title="Figma Web Auth API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if os.path.isdir(os.path.join(STATIC_DIR, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(STATIC_DIR, "assets")), name="assets")


class RegisterRequest(BaseModel):
    username: str
    password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class DeleteAccountRequest(BaseModel):
    username: str
    password: str


@dataclass
class UserRecord:
    id: int
    username: str
    password_hash: str
    salt: str


def _ensure_db() -> None:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
            """
        )
        conn.commit()


def _hash_password(password: str, salt: Optional[bytes] = None) -> tuple[str, str]:
    if salt is None:
        salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 120000)
    return salt.hex(), digest.hex()


def _get_user_by_username(username: str) -> Optional[UserRecord]:
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute(
            "SELECT id, username, password_hash, salt FROM users WHERE username = ?",
            (username,),
        ).fetchone()
    if not row:
        return None
    return UserRecord(
        id=row["id"],
        username=row["username"],
        password_hash=row["password_hash"],
        salt=row["salt"],
    )


@app.on_event("startup")
def on_startup() -> None:
    _ensure_db()


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/api/register")
def register(payload: RegisterRequest) -> dict:
    username = payload.username.strip()
    password = payload.password

    if len(username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    salt_hex, hash_hex = _hash_password(password)
    try:
        with sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                "INSERT INTO users (username, password_hash, salt) VALUES (?, ?, ?)",
                (username, hash_hex, salt_hex),
            )
            conn.commit()
    except sqlite3.IntegrityError:
        raise HTTPException(status_code=409, detail="Username already exists")

    user = _get_user_by_username(username)
    return {"user": {"id": user.id, "username": user.username}}


@app.post("/api/login")
def login(payload: LoginRequest) -> dict:
    username = payload.username.strip()
    password = payload.password

    user = _get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    salt = bytes.fromhex(user.salt)
    _, hash_hex = _hash_password(password, salt=salt)
    if not secrets.compare_digest(hash_hex, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    session_token = secrets.token_urlsafe(32)
    return {"user": {"id": user.id, "username": user.username}, "token": session_token}


@app.post("/api/delete-account")
def delete_account(payload: DeleteAccountRequest) -> dict:
    username = payload.username.strip()
    password = payload.password

    user = _get_user_by_username(username)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    salt = bytes.fromhex(user.salt)
    _, hash_hex = _hash_password(password, salt=salt)
    if not secrets.compare_digest(hash_hex, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("DELETE FROM users WHERE id = ?", (user.id,))
        conn.commit()

    return {"status": "deleted"}


def _serve_frontend(path: str) -> FileResponse:
    if not os.path.isdir(STATIC_DIR):
        raise HTTPException(status_code=404, detail="Frontend build not found")

    if path:
        file_path = os.path.abspath(os.path.join(STATIC_DIR, path))
        if not file_path.startswith(STATIC_DIR + os.sep):
            raise HTTPException(status_code=404, detail="Not found")
        if os.path.isfile(file_path):
            return FileResponse(file_path)

    return FileResponse(os.path.join(STATIC_DIR, "index.html"))


@app.get("/")
def serve_root() -> FileResponse:
    return _serve_frontend("")


@app.get("/{path:path}")
def serve_spa(path: str) -> FileResponse:
    if path.startswith("api"):
        raise HTTPException(status_code=404, detail="Not found")

    return _serve_frontend(path)
