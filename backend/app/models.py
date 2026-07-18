from typing import Literal
from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    organisation_id: str
    user_id: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    customer_name: str
    organisation_name: str


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)
    session_id: str
    channel: Literal["text", "voice"] = "text"
    language: Literal["en", "hi", "fr", "es", "de", "zh", "ja", "ar"] = "en"


class Source(BaseModel):
    title: str
    section: str


class ChatResponse(BaseModel):
    answer: str
    confidence: float
    intent: str
    sources: list[Source]
    escalated: bool
    ticket_id: str | None = None
    safe_message: str | None = None


class EscalationRequest(BaseModel):
    session_id: str
    reason: str
    summary: str


class FeedbackRequest(BaseModel):
    session_id: str
    helpful: bool
