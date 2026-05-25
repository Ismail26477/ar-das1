@echo off
REM Start Development Server - Windows Batch Script

echo.
echo ================================================
echo  AR Computers Dashboard - Development Server
echo ================================================
echo.

REM Check if in correct directory
if not exist "package.json" (
    echo ERROR: package.json not found!
    echo Make sure you are in the project root directory.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call pnpm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting Vite Development Server...
echo.
echo Server will be available at: http://localhost:5173/
echo.
echo Press Ctrl+C to stop the server.
echo.

REM Start the dev server
pnpm dev

pause
