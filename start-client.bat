@echo off
echo ========================================
echo   Smart Travel Companion - Client Only
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

cd client

REM Install frontend dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating client environment configuration...
    echo REACT_APP_API_URL=http://localhost:5000 > .env
    echo Created .env file.
)

echo.
echo Starting React development server on http://localhost:3000
echo Press Ctrl+C to stop
echo.

call npm start

pause
