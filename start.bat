@echo off
title chicken tracker App
echo  Starting chicken tracker App...
cd /d "C:\Users\Zane\Desktop\chicken tracker\"
echo.
echo Initializing server on port 9000...
echo.

:: Start the Node.js app
start "" cmd /k "set PORT=9000 && npm start"

:: Wait a few seconds for the server to start
timeout /t 5 >nul

:: Open the app in the browser
start http://localhost:9000

echo.
echo  App launched! You can close this window if you wish.
pause >nul