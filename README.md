# S2B AI Voice Agent v2

## New in v2

- Light and dark mode with saved preference
- 8-language interface: English, Hindi, French, Spanish, German, Chinese, Japanese and Arabic
- Language-aware microphone recognition
- Language-aware spoken responses
- RTL layout support for Arabic
- Offline multilingual answers for key banking intents
- Persistent login, safety controls, RAG, dashboard and escalation

# S2B AI Voice Agent — Updated Hackathon Demo

End-to-end React + FastAPI prototype for a secure 24×7 corporate-banking support assistant.

## Included

- Text chat
- Browser speech-to-text and text-to-speech
- Approved-knowledge retrieval (RAG-style)
- Optional OpenAI answer generation
- PII masking and transaction-action guardrails
- Persistent login sessions in SQLite
- Human escalation and ticket ID
- Dashboard and audit data
- Robust frontend error handling
- Windows launch scripts

## Fastest Windows start

Read `START_HERE_WINDOWS.md`, or double-click these in separate windows:

1. `start-backend.bat`
2. `start-frontend.bat`

Then open `http://localhost:5173`.

Demo login:

- Organisation ID: `ACME001`
- User ID: `demo.user`
- Password: `demo123`

The backend root is `http://127.0.0.1:8000/` and API docs are at `http://127.0.0.1:8000/docs`.

This is a hackathon prototype and does not execute real banking transactions or connect to production customer data.
