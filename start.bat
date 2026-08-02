@echo off
title SkillForge - 1-Click Launcher
color 0B

echo ===================================================
echo           SkillForge - AI Career Platform
echo ===================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js v18+ from https://nodejs.org
    pause
    exit /b
)

:: Check .env
if not exist ".env" (
    echo [INFO] Creating .env file from .env.example...
    copy .env.example .env >nul
)

:: Check node_modules
if not exist "node_modules" (
    echo [INFO] Installing project dependencies (first run only)...
    call npm.cmd install
)

echo.
echo [SUCCESS] Starting SkillForge Server on http://localhost:3000...
echo [INFO] Opening browser in 3 seconds...
echo.

start "" "http://localhost:3000"
call npm.cmd run dev
pause
