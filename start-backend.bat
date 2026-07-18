@echo off
cd /d "%~dp0backend"
if not exist .venv\Scripts\python.exe (
  echo Creating Python virtual environment...
  python -m venv .venv || goto :error
)
call .venv\Scripts\activate
python -m pip install -r requirements.txt || goto :error
if not exist .env copy .env.example .env >nul
uvicorn app.main:app --host 127.0.0.1 --port 8000
goto :eof
:error
echo.
echo Backend setup failed. Check Python installation and the error above.
pause
