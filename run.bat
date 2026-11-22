@echo off
setlocal enabledelayedexpansion

echo ===================================
echo     ClaimKavach Launcher
echo ===================================

cd /d "%~dp0"

if not exist "backend\.venv" (
    echo Creating Python virtual environment...
    python -m venv backend\.venv
)

call backend\.venv\Scripts\activate.bat

echo Installing/checking backend dependencies...
pip install -r backend\requirements.txt

echo Generating synthetic samples...
python -m backend.app.tools.make_samples

if not exist "frontend\dist" (
    echo Building frontend...
    cd frontend
    call npm install
    call npm run build
    cd ..
)

echo Starting ClaimKavach at http://localhost:8000...
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
pause
