@echo off
echo ===============================
echo FitFindr Setup Script (Windows)
echo ===============================
echo.

REM Backend setup
echo Setting up Backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo [SUCCESS] .env file created. Please add your Google Maps API key!
) else (
    echo [SUCCESS] .env file already exists
)

cd ..

REM Frontend setup
echo.
echo Setting up Frontend...
cd frontend

echo Installing Node dependencies...
call npm install

if not exist ".env.local" (
    echo Creating .env.local file...
    copy .env.local.example .env.local
    echo [SUCCESS] .env.local file created
) else (
    echo [SUCCESS] .env.local file already exists
)

cd ..

echo.
echo ===============================
echo Setup complete!
echo ===============================
echo.
echo Next steps:
echo 1. Add your Google Maps API key to backend\.env
echo 2. Run the backend: cd backend ^&^& venv\Scripts\activate ^&^& uvicorn main:app --reload
echo 3. Run the frontend: cd frontend ^&^& npm run dev
echo.
echo Visit http://localhost:3000 to use FitFindr!
echo.
pause
