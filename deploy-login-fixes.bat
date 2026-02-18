@echo off
echo Deploying Login and Authentication Fixes...
echo ==========================================

:: Create deployment directory
if not exist "deployment\public_html" mkdir "deployment\public_html"
if not exist "deployment\public_html\backend" mkdir "deployment\public_html\backend"
if not exist "deployment\public_html\backend\php" mkdir "deployment\public_html\backend\php"
if not exist "deployment\public_html\backend\php\api" mkdir "deployment\public_html\backend\php\api"
if not exist "deployment\public_html\frontend" mkdir "deployment\public_html\frontend"

:: Copy backend files
echo Copying backend files...
copy "backend\php\db.php" "deployment\public_html\backend\php\db.php"
copy "backend\php\schema.sql" "deployment\public_html\backend\php\schema.sql"
copy "backend\php\api\auth.php" "deployment\public_html\backend\php\api\auth.php"
copy "backend\php\api\.htaccess" "deployment\public_html\backend\php\api\.htaccess"
copy "backend\php\api\debug.php" "deployment\public_html\backend\php\api\debug.php"
copy "backend\php\test_registration.php" "deployment\public_html\backend\php\test_registration.php"

:: Copy all other API files
for %%f in (backend\php\api\*.php) do (
    if not "%%~nf"=="auth" if not "%%~nf"=="debug" (
        copy "%%f" "deployment\public_html\backend\php\api\%%~nxf"
    )
)

:: Copy frontend build
echo Copying frontend build...
if exist "frontend\out" (
    xcopy "frontend\out" "deployment\public_html\frontend\out" /E /I /Y
) else (
    echo WARNING: frontend\out folder not found. Run 'npm run build' first.
)

:: Copy environment files
copy "frontend\.env" "deployment\public_html\frontend\.env"
copy "frontend\.env.local" "deployment\public_html\frontend\.env.local"

:: Copy htaccess files
copy "production-htaccess-root" "deployment\public_html\.htaccess"
copy "production-htaccess-backend" "deployment\public_html\backend\.htaccess"

echo.
echo Deployment completed!
echo.
echo FIXES INCLUDED:
echo - Registration works and saves users to database
echo - Login now works with direct API calls
echo - Sign-out functionality fixed
echo - Session management improved
echo - Token storage and validation enhanced
echo.
echo Next steps:
echo 1. Upload contents of 'deployment\public_html' to your cPanel public_html folder
echo 2. Test registration at: https://yourdomain.com/register
echo 3. Test login at: https://yourdomain.com/login
echo 4. Test sign-out from navigation menu
echo 5. Check debug info at: https://yourdomain.com/backend/php/api/debug
echo.
pause