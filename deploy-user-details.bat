@echo off
echo Deploying user details registration changes...

echo.
echo 1. Applying database schema changes...
php apply_user_details_schema.php

echo.
echo 2. Building frontend...
cd frontend
call npm run build

echo.
echo 3. Copying files to deployment...
xcopy /E /Y out\* ..\deployment\public_html\
xcopy /E /Y ..\backend\php\api\* ..\deployment\public_html\backend\php\api\

echo.
echo 4. Copying updated auth.php and user_profile.php...
copy ..\backend\php\api\auth.php ..\deployment\public_html\backend\php\api\auth.php
copy ..\backend\php\api\user_profile.php ..\deployment\public_html\backend\php\api\user_profile.php

echo.
echo Deployment complete!
echo.
echo Changes made:
echo - Added user detail fields to registration form
echo - Updated database schema with new user fields
echo - Enhanced user profile API
echo.
pause