@echo off
echo Building Next.js frontend for static hosting...

cd frontend

echo Step 1: Installing dependencies...
call npm install

echo Step 2: Building Next.js application...
call npm run build

echo Step 3: Checking build output...
if exist "out" (
    echo ✅ SUCCESS: Build completed - 'out' folder created
    echo Build contains:
    dir out /b
) else (
    echo ❌ ERROR: Build failed - 'out' folder not found
    echo Trying alternative build...
    call npx next build
    if exist "out" (
        echo ✅ SUCCESS: Alternative build worked
    ) else (
        echo ❌ FAILED: Please check Next.js configuration
    )
)

echo.
echo Build process completed.
pause