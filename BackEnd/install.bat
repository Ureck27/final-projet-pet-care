@echo off
REM Install dependencies for pet-care backend
REM This script bypasses common PowerShell issues

echo Installing dependencies for pet-care backend...
echo.

cd /d "%~dp0"

REM Check if npm is available
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo npm version:
npm --version
echo.

echo Clearing npm cache...
call npm cache clean --force

echo.
echo Installing all dependencies...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo Verifying installed packages...
call npm list helmet express-rate-limit

echo.
echo ✓ Installation complete!
echo You can now run: npm run dev
pause
