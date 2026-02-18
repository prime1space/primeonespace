@echo off
echo Starting deployment preparation for cPanel hosting...

REM Create deployment directory
if not exist "deployment" mkdir deployment
cd deployment

REM Clean previous deployment
if exist "public_html" rmdir /s /q public_html
mkdir public_html

echo Copying backend files...
xcopy /E /I /Y "..\backend" "public_html\backend"

echo Building frontend...
cd ..\frontend
echo Installing dependencies...
call npm install
echo Building Next.js application...
call npm run build
cd ..\deployment

echo Copying frontend build...
REM Next.js export creates 'out' folder
if exist "..\frontend\out" (
    xcopy /E /I /Y "..\frontend\out" "public_html\frontend\out"
    echo Frontend build copied successfully
) else (
    echo ERROR: Frontend build failed - 'out' folder not found
    echo Please run 'npm run build' manually in frontend folder
    pause
    exit /b 1
)

xcopy /E /I /Y "..\frontend\.env" "public_html\frontend\"
xcopy /E /I /Y "..\frontend\.env.local" "public_html\frontend\"

echo Copying .htaccess files...
copy "..\production-htaccess-root" "public_html\.htaccess"
copy "..\production-htaccess-backend" "public_html\backend\.htaccess"

echo Creating database setup file...
copy "..\backend\php\schema.sql" "public_html\database_setup.sql"

echo.
echo ========================================
echo DEPLOYMENT READY!
echo ========================================
echo Upload contents of 'deployment\public_html' to your cPanel
echo Database credentials are already configured
echo Follow HOSTING_GUIDE.md for complete instructions
echo ========================================
pause