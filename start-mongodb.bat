@echo off
echo ========================================
echo   Starting MongoDB for Smart Travel Companion
echo ========================================
echo.

REM Check if MongoDB service exists
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] MongoDB service found.
    echo [INFO] Starting MongoDB service...
    net start MongoDB
    if %errorlevel% equ 0 (
        echo [OK] MongoDB service started successfully!
        echo.
        echo MongoDB is now running and ready to accept connections.
        echo Default connection: mongodb://localhost:27017
        echo.
    ) else (
        echo [ERROR] Failed to start MongoDB service.
        echo Try running this script as Administrator.
        echo.
        pause
        exit /b 1
    )
) else (
    echo [INFO] MongoDB service not found or not installed as a service.
    echo.
    echo Trying to start MongoDB manually...
    echo.
    
    REM Common MongoDB installation paths
    if exist "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" (
        for /f "delims=" %%i in ('dir /b /ad "C:\Program Files\MongoDB\Server"') do (
            set MONGODB_PATH=C:\Program Files\MongoDB\Server\%%i\bin
        )
        echo [INFO] Found MongoDB at: %MONGODB_PATH%
        start "MongoDB" "%MONGODB_PATH%\mongod.exe" --dbpath "C:\data\db"
        echo [OK] MongoDB started in a new window.
        echo [INFO] Data directory: C:\data\db
        echo.
    ) else (
        echo [ERROR] Could not find MongoDB installation.
        echo.
        echo Please do one of the following:
        echo 1. Install MongoDB as a Windows service
        echo 2. Add MongoDB to your system PATH
        echo 3. Run mongod.exe manually from its installation directory
        echo.
        echo MongoDB default installation paths:
        echo   - C:\Program Files\MongoDB\Server\[version]\bin\mongod.exe
        echo.
        pause
        exit /b 1
    )
)

echo ========================================
echo   MongoDB Setup Complete
echo ========================================
echo.
echo You can now start the application using: start.bat
echo.
pause
