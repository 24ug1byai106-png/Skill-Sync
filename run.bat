@echo off
echo =========================================
echo    Starting SkillSync Backend & Frontend
echo =========================================
echo.

:: Launch Backend in a new terminal window
start "SkillSync Backend" cmd /k "cd /d %~dp0backend && .\venv\Scripts\activate && uvicorn app.main:app --reload --port 8000"

:: Launch Frontend in a new terminal window
start "SkillSync Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Backend and Frontend have been launched in separate windows!
echo Backend: http://localhost:8000/docs
echo Frontend: http://localhost:5173
