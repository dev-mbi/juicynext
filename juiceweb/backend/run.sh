#!/usr/bin/env bash
# JuicyNext Backend — Start server
cd "$(dirname "$0")"

# Create virtual env if not exists
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install -q fastapi uvicorn sqlalchemy pydantic

echo "🚀 JuicyNext API running at http://localhost:8000"
echo "   Docs: http://localhost:8000/docs"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
