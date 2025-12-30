@echo off
cd /d "%~dp0"
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    echo Installing dependencies...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)
echo Starting embedding service on port 8002...
uvicorn main:app --host 0.0.0.0 --port 8002 --reload
