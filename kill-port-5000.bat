@echo off
echo ========================================
echo   Kill Process on Port 5000
echo ========================================
echo.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    set PID=%%a
    echo Found process with PID: %%a
    echo Killing process...
    taskkill /F /PID %%a >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] Process killed successfully
    ) else (
        echo [ERROR] Failed to kill process. You may need to run as Administrator.
    )
)

if not defined PID (
    echo [INFO] No process found on port 5000
)

echo.
echo You can now start the server with: npm start
echo.
pause
