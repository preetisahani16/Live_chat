@echo off
cd /d "%~dp0frontend"
if not exist .env copy .env.example .env >nul
if not exist node_modules (
  echo Installing frontend packages...
  npm install || goto :error
)
npm run dev
goto :eof
:error
echo.
echo Frontend setup failed. Check Node.js installation and the error above.
pause
