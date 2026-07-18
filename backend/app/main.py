from contextlib import asynccontextmanager
from uuid import uuid4

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .ai_service import answer as generate_answer
from .config import settings
from .database import (
    create_ticket,
    dashboard_stats,
    delete_session,
    init_db,
    save_conversation,
    save_feedback,
    save_session,
    session_exists,
)
from .models import (
    ChatRequest,
    ChatResponse,
    EscalationRequest,
    FeedbackRequest,
    LoginRequest,
    LoginResponse,
    Source,
)
from .rag import retriever
from .security import evaluate_safety, generate_token
from .translations import generic, offline_answer


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(title=settings.app_name, version="2.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def read_token(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing access token")
    token = authorization.removeprefix("Bearer ").strip()
    if not token or not session_exists(token):
        raise HTTPException(status_code=401, detail="Invalid or expired access token")
    return token


@app.get("/")
def root() -> dict:
    return {
        "message": "S2B AI Voice Agent backend is running",
        "health": "/api/health",
        "docs": "/docs",
    }


@app.get("/api/health")
def health() -> dict:
    return {"status": "ok", "service": settings.app_name, "version": "2.0.0", "languages": 8, "dark_mode": True}


@app.post("/api/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> LoginResponse:
    valid = (
        payload.organisation_id == "ACME001"
        and payload.user_id == "demo.user"
        and payload.password == "demo123"
    )
    if not valid:
        raise HTTPException(status_code=401, detail="Invalid demo credentials")

    token = generate_token()
    save_session(token, payload.organisation_id, payload.user_id)
    return LoginResponse(
        access_token=token,
        customer_name="Aarav Mehta",
        organisation_name="Acme Trading Pvt Ltd",
    )


@app.post("/api/logout")
def logout(authorization: str | None = Header(default=None)) -> dict:
    token = read_token(authorization)
    delete_session(token)
    return {"logged_out": True}


@app.post("/api/chat", response_model=ChatResponse)
def chat(payload: ChatRequest, authorization: str | None = Header(default=None)) -> ChatResponse:
    read_token(authorization)
    safety = evaluate_safety(payload.message)
    language = payload.language

    if safety.blocked:
        ticket_id = f"SR-{uuid4().hex[:8].upper()}"
        answer_text = generic("restricted", language)
        create_ticket(
            ticket_id,
            payload.session_id,
            safety.reason or "restricted_request",
            "Customer requested an action that must be completed in an authorised banking workflow.",
        )
        save_conversation(payload.session_id, safety.cleaned_text, answer_text, 1.0, "restricted_transaction", True)
        return ChatResponse(
            answer=answer_text,
            confidence=1.0,
            intent="restricted_transaction",
            sources=[],
            escalated=True,
            ticket_id=ticket_id,
            safe_message=generic("masked", language) if safety.sensitive else None,
        )

    result, raw_score = retriever.search(safety.cleaned_text)
    confidence = min(round(raw_score * 1.8, 2), 0.98)
    escalated = confidence < 0.18
    ticket_id = None

    if escalated:
        ticket_id = f"SR-{uuid4().hex[:8].upper()}"
        answer_text = generic("low_confidence", language)
        create_ticket(
            ticket_id,
            payload.session_id,
            "low_confidence",
            f"Low-confidence customer query about: {safety.cleaned_text[:250]}",
        )
    else:
        generated = generate_answer(safety.cleaned_text, result)
        answer_text = offline_answer(result["intent"], language, generated)

    save_conversation(payload.session_id, safety.cleaned_text, answer_text, confidence, result["intent"], escalated)
    return ChatResponse(
        answer=answer_text,
        confidence=confidence,
        intent=result["intent"],
        sources=[Source(title=result["title"], section=result["section"])],
        escalated=escalated,
        ticket_id=ticket_id,
        safe_message=generic("masked", language) if safety.sensitive else None,
    )


@app.post("/api/escalations")
def escalate(payload: EscalationRequest, authorization: str | None = Header(default=None)) -> dict:
    read_token(authorization)
    ticket_id = f"SR-{uuid4().hex[:8].upper()}"
    create_ticket(ticket_id, payload.session_id, payload.reason, payload.summary)
    return {"ticket_id": ticket_id, "status": "OPEN"}


@app.post("/api/feedback")
def feedback(payload: FeedbackRequest, authorization: str | None = Header(default=None)) -> dict:
    read_token(authorization)
    save_feedback(payload.session_id, payload.helpful)
    return {"saved": True}


@app.get("/api/dashboard")
def dashboard(authorization: str | None = Header(default=None)) -> dict:
    read_token(authorization)
    return dashboard_stats()
