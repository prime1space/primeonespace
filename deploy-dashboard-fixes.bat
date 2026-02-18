@echo off
echo Deploying updated frontend with dashboard fixes...

cd "c:\wamp64\www\coworking-space-website-project-main 4\coworking-space-website-project-main 2\frontend"

echo Building frontend...
call npm run build

echo Copying files to deployment directory...
xcopy /E /Y "out\*" "..\deployment\public_html\"

echo Deployment completed!
echo.
echo Changes made:
echo - Fixed dashboard booking count updates
echo - Fixed bookings page display
echo - Added auto-refresh functionality
echo - Added manual refresh buttons
echo - Fixed API endpoint URLs
echo.
pause