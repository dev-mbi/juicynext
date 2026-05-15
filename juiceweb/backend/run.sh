#!/usr/bin/env bash
cd "$(dirname "$0")"

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q -r requirements.txt

echo "🚀 JuicyNext running at http://localhost:8000"
echo "   🏠 Home: http://localhost:8000"
echo "   📋 Admin: http://localhost:8000/admin"
echo "   📚 API Docs: http://localhost:8000/docs"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
