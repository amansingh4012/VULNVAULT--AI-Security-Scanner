# Build script for unified VulnVault deployment (Windows)

Write-Host "🚀 Building VulnVault Unified Application..." -ForegroundColor Green

# Build frontend
Write-Host "📦 Building frontend..." -ForegroundColor Cyan
Set-Location frontend
npm install
npm run build
Set-Location ..

Write-Host "✅ Build completed!" -ForegroundColor Green
Write-Host "📁 Frontend built to: frontend/dist" -ForegroundColor Yellow
Write-Host "🐳 Docker will copy this to backend/static/" -ForegroundColor Yellow
