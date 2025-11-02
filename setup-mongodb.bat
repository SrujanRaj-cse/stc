@echo off
echo ========================================
echo   MongoDB Setup Guide for Windows
echo ========================================
echo.

echo This script will help you set up MongoDB for Smart Travel Companion.
echo.

REM Check if MongoDB data directory exists
if not exist "C:\data\db" (
    echo [1/3] Creating MongoDB data directory...
    mkdir "C:\data\db" 2>nul
    if %errorlevel% equ 0 (
        echo [OK] Created C:\data\db
    ) else (
        echo [WARNING] Could not create directory. You may need to run as Administrator.
        echo Please create C:\data\db manually.
        echo.
    )
) else (
    echo [1/3] MongoDB data directory already exists: C:\data\db
)
echo.

REM Check if MongoDB is installed
where mongod >nul 2>&1
if %errorlevel% equ 0 (
    echo [2/3] MongoDB is installed and in PATH.
    mongod --version
    echo.
) else (
    echo [2/3] MongoDB not found in PATH.
    echo.
    echo Common installation locations:
    echo   - C:\Program Files\MongoDB\Server\[version]\bin\
    echo.
    echo To add MongoDB to PATH:
    echo 1. Find your MongoDB installation folder
    echo 2. Copy the full path to the 'bin' folder
    echo 3. Add it to System Environment Variables PATH
    echo.
)

REM Check if MongoDB service is running
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo [3/3] Checking MongoDB service status...
    sc query MongoDB | findstr "STATE"
    echo.
    echo To start MongoDB service, run as Administrator:
    echo   net start MongoDB
    echo.
) else (
    echo [3/3] MongoDB service not found.
    echo.
    echo To install MongoDB as a service, run as Administrator:
    echo   mongod --install --serviceName "MongoDB"
    echo.
)

echo ========================================
echo   Connection String
echo ========================================
echo.
echo Use this connection string in your .env file:
echo   MONGO_URI=mongodb://localhost:27017/smart-travel-companion
echo.
echo Default MongoDB settings:
echo   - Host: localhost
echo   - Port: 27017
echo   - Database: smart-travel-companion (will be created automatically)
echo.
echo ========================================
echo.

pause
