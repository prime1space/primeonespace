# Complete cPanel Deployment Guide - ALL APIS FIXED

## ✅ FIXED: Complete System Working
- **Authentication System**: Registration, Login, Sign-out all working
- **API Endpoints**: Spaces, Offers, Events, Announcements all fetching properly
- **Homepage**: All data loading correctly
- **Session Management**: Token storage and validation working
- **Database**: All operations working correctly

## ✅ FIXED: Build Issue Resolved
The Next.js build now works correctly and creates the `out` folder.

## Quick Complete Fix Deployment

### Step 1: Run the Complete Fix Script
```bash
deploy-complete-fixes.bat
```
This will create a `deployment/public_html` folder with ALL fixes included.

### Step 2: Upload to cPanel
1. Login to cPanel File Manager
2. Navigate to `public_html`
3. **Backup existing files first!**
4. Upload contents of `deployment/public_html/`
5. Extract if uploaded as ZIP

### Step 3: Test Everything
1. **Homepage**: Visit `https://yourdomain.com` - Should load with announcements and offers
2. **Registration**: Test at `https://yourdomain.com/register`
3. **Login**: Test at `https://yourdomain.com/login`
4. **Spaces**: Visit `https://yourdomain.com/spaces` - Should load all spaces
5. **Offers**: Visit `https://yourdomain.com/offers` - Should load all offers
6. **Events**: Visit `https://yourdomain.com/events` - Should load all events
7. **Sign-out**: Test from navigation menu
8. **API Test**: Visit `https://yourdomain.com/backend/php/test_api_endpoints.php`

## What Was Fixed

### 1. Authentication System ✅
- Registration saves users to database
- Login works with direct API calls
- Sign-out clears sessions properly
- Token storage and validation working
- Session management across pages

### 2. API Endpoints ✅ NEW
- **Spaces API**: Fixed URL from `/api/spaces` to `/spaces`
- **Offers API**: Fixed URL from `/api/offers` to `/offers` and data structure
- **Events API**: Fixed URL from `/api/events` to `/events`
- **Announcements API**: Working correctly
- **Homepage API**: Fixed all endpoint URLs

### 3. Data Fetching ✅ NEW
- **Spaces Page**: Now fetches and displays spaces correctly
- **Offers Page**: Now fetches and displays offers with correct discount format
- **Events Page**: Now fetches and displays events correctly
- **Homepage**: Now loads announcements, offers, and pricing data

### 4. Frontend-Backend Integration ✅
- All pages use correct API URLs
- Proper error handling for API calls
- Consistent data structure handling
- Loading states and fallbacks working

## Complete System Test Checklist

### Authentication Flow:
- ✅ Register new user → Saves to database → Auto-login → Dashboard
- ✅ Sign-out → Clears session → Homepage
- ✅ Login → Authenticates → Dashboard
- ✅ Session persistence across page navigation

### Data Fetching:
- ✅ Homepage loads announcements, offers, pricing
- ✅ Spaces page displays all available spaces
- ✅ Offers page shows active offers with discount codes
- ✅ Events page lists upcoming events
- ✅ All pages handle loading and error states

### API Endpoints:
- ✅ `/announcements` - Returns active announcements
- ✅ `/spaces` - Returns spaces with pricing
- ✅ `/offers` - Returns active offers
- ✅ `/events` - Returns published events
- ✅ `/pricing` - Returns pricing data
- ✅ `/auth/*` - All authentication endpoints

## Files Changed

### Backend:
- `backend/php/api/auth.php` - Fixed registration and session handling
- `backend/php/api/.htaccess` - Added CORS headers
- `backend/php/test_api_endpoints.php` - **NEW: API testing script**

### Frontend:
- `frontend/src/lib/auth-client.ts` - Improved session management
- `frontend/src/app/register/page.tsx` - Direct API calls
- `frontend/src/app/login/page.tsx` - Fixed login with direct API calls
- `frontend/src/components/Navigation.tsx` - Fixed sign-out functionality
- `frontend/src/app/spaces/page.tsx` - **Fixed API URL**
- `frontend/src/app/offers/page.tsx` - **Fixed API URL and data structure**
- `frontend/src/app/events/page.tsx` - **Fixed API URL**
- `frontend/src/app/page.tsx` - **Fixed homepage API URLs**

## Debug and Testing Tools

- `backend/php/test_registration.php` - Test user registration and database
- `backend/php/test_api_endpoints.php` - **NEW: Test all API endpoints**
- `backend/php/api/debug.php` - API debug information
- Enhanced logging in `auth_debug.log`

## Phase 1: Manual Deployment Steps

### Step 1: Build Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run build
```
**Verify**: Check that `frontend/out/` folder exists with files.

### Step 2: Create Deployment Folder Structure
Create this folder structure manually:

```
deployment/
└── public_html/
    ├── .htaccess
    ├── frontend/
    │   ├── out/ (copy from frontend/out/)
    │   ├── .env
    │   └── .env.local
    ├── backend/
    │   ├── .htaccess
    │   └── php/ (copy entire backend/php folder)
    └── database_setup.sql
```

### Step 3: Copy Files Manually

1. **Create deployment folder**: `deployment/public_html/`

2. **Copy frontend build**:
   - Copy `frontend/out/` → `deployment/public_html/frontend/out/`
   - Copy `frontend/.env` → `deployment/public_html/frontend/.env`
   - Copy `frontend/.env.local` → `deployment/public_html/frontend/.env.local`

3. **Copy backend**:
   - Copy entire `backend/` folder → `deployment/public_html/backend/`

4. **Copy configuration files**:
   - Copy `production-htaccess-root` → `deployment/public_html/.htaccess`
   - Copy `production-htaccess-backend` → `deployment/public_html/backend/.htaccess`
   - Copy `backend/php/schema.sql` → `deployment/public_html/database_setup.sql`

## Phase 2: Database Setup

### Step 1: Access cPanel
1. Login to your cPanel hosting account
2. Go to **"MySQL Databases"** or **"phpMyAdmin"**

### Step 2: Import Database
1. Open **phpMyAdmin**
2. Select database: `primeonelk_user_coworking`
3. Click **"Import"** tab
4. Upload file: `database_setup.sql`
5. Click **"Go"** to execute

### Step 3: Create Admin User
Run this SQL in phpMyAdmin:
```sql
INSERT INTO user (id, name, email, email_verified, created_at, updated_at) 
VALUES (UUID(), 'Admin', 'prime1@gmail.com', 1, NOW(), NOW());
```

## Phase 3: Upload to cPanel

### Step 1: Access File Manager
1. Login to cPanel
2. Click **"File Manager"**
3. Navigate to **"public_html"** folder

### Step 2: Upload Files
1. **Delete existing files** in public_html (backup first!)
2. **Upload all contents** from `deployment/public_html/`
3. **Extract if uploaded as ZIP**

### Step 3: Verify File Structure
Your cPanel should have:
```
public_html/
├── .htaccess
├── frontend/
│   ├── out/
│   │   ├── index.html
│   │   ├── _next/
│   │   └── [other files]
│   ├── .env
│   └── .env.local
├── backend/
│   ├── .htaccess
│   └── php/
│       ├── db.php
│       ├── schema.sql
│       └── api/
└── database_setup.sql
```

## Phase 4: Configuration

### Step 1: Update Domain
Edit `public_html/frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://YOURDOMAIN.com/backend/php/api
```
Replace `YOURDOMAIN.com` with your actual domain.

### Step 2: Set File Permissions
In cPanel File Manager:
- **Folders to 755**:
  - `backend/php/api/uploads/`
  - `backend/php/api/`
- **Files to 644**: All `.php` files

### Step 3: Email Configuration (Optional)
Edit `frontend/.env.local`:
```
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

## Phase 5: Testing

### Step 1: Test Website
- Visit: `https://yourdomain.com`
- Should load homepage

### Step 2: Test API
- Visit: `https://yourdomain.com/backend/php/api/settings.php`
- Should return JSON (not error)

### Step 3: Test Admin Access
1. Go to: `https://yourdomain.com/register`
2. Register with: `prime1@gmail.com`
3. Login and access: `https://yourdomain.com/admin`

## Phase 6: Seed Data (Optional)

Run in phpMyAdmin:
```sql
-- Add sample pricing
INSERT INTO pricing (space_type, hourly_rate, daily_rate, monthly_rate, features) 
VALUES 
('Hot Desk', 5.00, 25.00, 150.00, '["WiFi", "Coffee", "Printing"]'),
('Private Office', 15.00, 75.00, 450.00, '["WiFi", "Coffee", "Printing", "Phone Booth"]');

-- Add sample spaces
INSERT INTO spaces (name, type, capacity, amenities, description, available) 
VALUES 
('Open Workspace', 'Hot Desk', 20, '["WiFi", "Coffee"]', 'Shared workspace area', 1),
('Meeting Room A', 'Private Office', 8, '["WiFi", "Projector", "Whiteboard"]', 'Private meeting room', 1);
```

## Database Credentials (Already Configured)
- **Host**: localhost
- **Database**: primeonelk_user_coworking
- **Username**: primeonelk_user_coworking
- **Password**: Qw!S_RC0,C9U0nIA

## Troubleshooting

### Build Issues
- Use: `npm install --legacy-peer-deps`
- Ensure `out` folder exists after build

### Database Connection
- Verify credentials in `backend/php/db.php`
- Check database exists in cPanel

### API Not Working
- Check `.htaccess` files uploaded
- Verify file permissions (755/644)

### Frontend Not Loading
- Confirm `frontend/out/` uploaded correctly
- Check domain in `.env.local`

## Success Checklist
- ✅ Frontend builds successfully (`out` folder created)
- ✅ Database imported and admin user created
- ✅ All files uploaded to cPanel
- ✅ Domain configured in environment files
- ✅ File permissions set correctly
- ✅ Website loads without errors
- ✅ API endpoints respond
- ✅ Admin panel accessible

Your coworking space website is now **LIVE**! 🚀

## Quick Commands Summary
```bash
# Build frontend
cd frontend
npm install --legacy-peer-deps
npm run build

# Verify build
dir out

# Then manually copy files as described above
```