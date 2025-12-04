@echo off
echo ========================================
echo   Gradex Writers - Starting Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    echo.
    call npm install
    echo.
)

echo Starting server...
echo.
echo ========================================
echo   Server will start on http://localhost:3000
echo   Admin dashboard: http://localhost:3000/admin
echo   Default login: admin / admin123
echo ========================================
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start

