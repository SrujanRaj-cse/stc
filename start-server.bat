@echo off
echo ========================================
echo   Smart Travel Companion - Server Only
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install backend dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating environment configuration...
    (
        echo MONGO_URI=mongodb://localhost:27017/smart-travel-companion
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo NODE_ENV=development
        echo PORT=5000
        echo WEATHER_API_KEY=your-weather-api-key
        echo MAPS_API_KEY=your-maps-api-key
    ) > .env
    echo Created .env file. Please update the configuration as needed.
)

echo.
echo Starting backend server on http://localhost:5000
echo Press Ctrl+C to stop
echo.

call npm run server

pause
