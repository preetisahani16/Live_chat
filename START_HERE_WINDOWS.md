# Start S2B AI Voice Agent v2 on Windows

## Prerequisites

```cmd
python --version
node -v
npm -v
```

Use Python 3.11/3.12 and Node.js 20.19+ or 22.12+.

## Backend — Terminal 1

```cmd
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Keep this terminal open.

Verify:

```text
http://127.0.0.1:8000/api/health
```

## Frontend — Terminal 2

```cmd
cd frontend
copy .env.example .env
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Demo login

```text
Organisation ID: ACME001
User ID: demo.user
Password: demo123
```

## Dark mode

Use the moon/sun button in the top-right corner. The choice is saved automatically.

## Eight languages

Use the language selector. Supported languages:

English, Hindi, French, Spanish, German, Chinese, Japanese and Arabic.

The selected language controls the interface, microphone recognition and spoken response.

## Voice test

Use Chrome or Edge, allow microphone access, select a language, click the microphone button and speak.

## Every later run

Backend:

```cmd
cd backend
.venv\Scripts\activate
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Frontend:

```cmd
cd frontend
npm run dev
```
