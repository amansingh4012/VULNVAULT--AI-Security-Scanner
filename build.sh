#!/bin/bash
# Build script for unified VulnVault deployment

echo "🚀 Building VulnVault Unified Application..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Build completed!"
echo "📁 Frontend built to: frontend/dist"
echo "🐳 Docker will copy this to backend/static/"
