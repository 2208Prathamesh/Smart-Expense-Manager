@echo off
cd /d "%~dp0"

:: Start server in background
start "" cmd /c npm install

echo Starting application...

:: Start server in background
start "" cmd /c node server.js

:: Wait for server to boot (3–5 sec)
timeout /t 3 >nul

:: Open browser
start http://localhost:3001

echo App started successfully 🚀