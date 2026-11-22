#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=== ClaimKavach Launcher ==="

# Set up python venv if needed
if [ ! -d "backend/.venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv backend/.venv
fi

source backend/.venv/bin/activate
echo "Installing backend dependencies..."
pip install -r backend/requirements.txt

# Generate samples if not present
echo "Generating synthetic sample documents..."
python -m backend.app.tools.make_samples

# Check frontend build
if [ ! -d "frontend/dist" ]; then
    echo "Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
fi

echo "Starting ClaimKavach at http://localhost:8000..."
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
