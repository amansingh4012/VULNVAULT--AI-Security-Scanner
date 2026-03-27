# VulnVault Quick Start Script
Write-Host "🛡️  Starting VulnVault..." -ForegroundColor Cyan
Write-Host ""

# Start Backend
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Yellow
$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$PSScriptRoot\backend`"; if (Test-Path .\venv\Scripts\Activate.ps1) { .\venv\Scripts\Activate.ps1 }; python main.py" -PassThru

Start-Sleep -Seconds 3

# Start Frontend
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
$frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$PSScriptRoot\frontend`"; npm run dev" -PassThru

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ VulnVault is running!" -ForegroundColor Green
Write-Host ""
Write-Host "📡 Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📡 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers" -ForegroundColor Gray
