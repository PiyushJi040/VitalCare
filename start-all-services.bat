@echo off
echo Starting Telemedicine App Services...
echo.

echo Starting AI Service (Flask)...
start "AI Service" cmd /k "cd AI_Model && python app.py"

timeout /t 3 /nobreak >nul

echo Starting Backend Service (Node.js)...
start "Backend Service" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Service (React)...
start "Frontend Service" cmd /k "cd frontend && npm run dev"

echo.
echo All services are starting...
echo AI Service: http://localhost:5001
echo Backend Service: http://localhost:5000
echo Frontend Service: http://localhost:5173
echo.
pause