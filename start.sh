#!/usr/bin/env bash

echo "==================================================="
echo "          SkillForge - AI Career Platform"
echo "==================================================="
echo ""

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed. Please install Node.js v18+ from https://nodejs.org"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "[INFO] Creating .env file from .env.example..."
    cp .env.example .env
fi

if [ ! -d "node_modules" ]; then
    echo "[INFO] Installing dependencies..."
    npm install
fi

echo "[SUCCESS] Starting SkillForge on http://localhost:3000..."

# Open browser depending on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    open "http://localhost:3000" &
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open "http://localhost:3000" &
fi

npm run dev
