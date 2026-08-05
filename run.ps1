# Start SkillSync Backend & Frontend in separate process windows
$rootDir = $PSScriptRoot

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "   Starting SkillSync Backend & Frontend " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\backend'; .\venv\Scripts\activate; uvicorn app.main:app --reload --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$rootDir\frontend'; npm run dev"

Write-Host "`nBackend and Frontend launched!" -ForegroundColor Green
Write-Host "Backend API:  http://localhost:8000/docs" -ForegroundColor Yellow
Write-Host "Frontend App: http://localhost:5173" -ForegroundColor Yellow
