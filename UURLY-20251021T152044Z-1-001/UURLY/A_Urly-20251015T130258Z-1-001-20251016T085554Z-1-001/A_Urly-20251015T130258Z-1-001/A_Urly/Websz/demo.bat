@echo off
REM Quick Demo of Real-Time Database Integration
echo ========================================================
echo   URLY Scanner - Real-Time Configuration Demo
echo ========================================================
echo.

echo 1. Testing Health Check...
curl -s http://localhost:5050/health
echo.
echo.

echo 2. Getting Current Configuration...
curl -s http://localhost:5050/api/config/gsb_enabled
echo.
echo.

echo 3. Scanning a URL (auto-saves to database)...
curl -s -X POST http://localhost:5050/api/scan -H "Content-Type: application/json" -d "{\"url\":\"https://google.com\"}"
echo.
echo.

timeout /t 2 /nobreak >nul

echo 4. Getting Recent Scans from Database...
curl -s http://localhost:5050/api/scans/recent?limit=3
echo.
echo.

echo 5. Getting Statistics Summary...
curl -s http://localhost:5050/api/stats/summary
echo.
echo.

echo ========================================================
echo   Demo Complete! Check the server console for logs.
echo ========================================================
echo.
pause
