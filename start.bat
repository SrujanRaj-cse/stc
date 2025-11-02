@echo off
echo ========================================
echo   Smart Travel Companion - Windows
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node --version
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)

echo [INFO] npm version:
npm --version
echo.

REM Install backend dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo [1/5] Installing backend dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install backend dependencies.
        pause
        exit /b 1
    )
    echo [OK] Backend dependencies installed.
    echo.
) else (
    echo [1/5] Backend dependencies already installed.
    echo.
)

REM Install frontend dependencies if client/node_modules doesn't exist
if not exist "client\node_modules" (
    echo [2/5] Installing frontend dependencies...
    cd client
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install frontend dependencies.
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo [OK] Frontend dependencies installed.
    echo.
) else (
    echo [2/5] Frontend dependencies already installed.
    echo.
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo [3/5] Creating environment configuration...
    (
        echo MONGO_URI=mongodb://localhost:27017/smart-travel-companion
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo NODE_ENV=development
        echo PORT=5000
        echo WEATHER_API_KEY=your-weather-api-key
        echo MAPS_API_KEY=your-maps-api-key
    ) > .env
    echo [OK] Created .env file. Please update the configuration as needed.
    echo [WARNING] Make sure MongoDB is running before starting the application!
    echo.
) else (
    echo [3/5] Environment file (.env) already exists.
    echo.
)

REM Create client .env file if it doesn't exist
if not exist "client\.env" (
    echo [4/5] Creating client environment configuration...
    echo REACT_APP_API_URL=http://localhost:5000 > client\.env
    echo [OK] Created client/.env file.
    echo.
) else (
    echo [4/5] Client environment file already exists.
    echo.
)

echo [5/5] Checking MongoDB connection...
echo [INFO] Make sure MongoDB is running before starting the application!
echo.
echo ========================================
echo   Ready to Start Application
echo ========================================
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.
echo ========================================
echo.

REM Start the application using concurrently
call npm run dev

pause