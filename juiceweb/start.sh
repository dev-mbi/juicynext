#!/usr/bin/env bash
set -e

echo "🚀 Starting JuicyNext — Frontend + Backend"

# Start backend in background
echo "   Starting backend..."
cd "$(dirname "$0")/backend"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -q -r requirements.txt 2>/dev/null
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
cd ..

# Start frontend
echo "   Starting frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Admin:    http://localhost:3000/admin"
echo ""
echo "   Press Ctrl+C to stop both"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
