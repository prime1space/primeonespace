# Complete cPanel Hosting Guide - Step by Step

## Phase 1: Prepare Files Locally

### Step 1: Build Frontend First (Important!)
```bash
# Navigate to your project folder
cd "c:\wamp64\www\coworking-space-website-project-main 4\coworking-space-website-project-main 2"

# Build frontend manually first
build-frontend.bat
```

### Step 2: Run Deployment Script
```bash
# After successful frontend build
deploy.bat
```

### Step 3: If Build Fails
```bash
# Manual build process
cd frontend
npm install
npm run build

# Check if 'out' folder exists
dir out
```

## Phase 2: Database Setup

### Step 1: Access cPanel Database
1. **Login to cPanel** (your hosting provider's URL)
2. **Find "Databases" section** → Click **"phpMyAdmin"**
3. **Select database**: `primeonelk_user_coworking`

### Step 2: Import Database Schema
1. **Click "Import" tab** in phpMyAdmin
2. **Choose file**: Upload `backend/php/schema.sql`
3. **Click "Go"** to execute
4. **Verify tables created**: Should see 11 tables (user, bookings, spaces, etc.)

### Step 3: Create Admin User (Important!)
```sql
-- Run this SQL in phpMyAdmin to create admin user
INSERT INTO user (id, name, email, email_verified, created_at, updated_at) 
VALUES (UUID(), 'Admin', 'prime1@gmail.com', 1, NOW(), NOW());
```

## Phase 3: File Upload to cPanel

### Step 1: Access File Manager
1. **Login to cPanel**
2. **Click "File Manager"**
3. **Navigate to "public_html" folder**

### Step 2: Upload Files
1. **Delete existing files** in public_html (backup first if needed)
2. **Upload method options**:
   - **Option A**: Upload `deployment/public_html` contents directly
   - **Option B**: Create ZIP of `deployment/public_html` contents, upload & extract

### Step 3: Verify File Structure
```
public_html/
├── .htaccess
├── frontend/
│   ├── out/
│   ├── .env
│   └── .env.local
└── backend/
    ├── .htaccess
    └── php/
        ├── db.php
        ├── schema.sql
        └── api/
```

## Phase 4: Configuration Updates

### Step 1: Update Domain in Environment
1. **Edit** `public_html/frontend/.env.local`
2. **Replace** `yourdomain.com` with your actual domain:
```
NEXT_PUBLIC_API_URL=https://YOURDOMAIN.com/backend/php/api
```

### Step 2: Set File Permissions
**In cPanel File Manager**:
- **Right-click folders** → Properties → Permissions
- **Set to 755**:
  - `backend/php/api/uploads/`
  - `backend/php/api/`
- **Set to 644**: All `.php` files

### Step 3: Configure Email (Optional)
**Edit** `frontend/.env.local`:
```
SMTP_USER=your_actual_email@gmail.com
SMTP_PASS=your_gmail_app_password
```

## Phase 5: Testing & Verification

### Step 1: Test Website Access
1. **Visit**: `https://yourdomain.com`
2. **Should load**: Homepage with navigation

### Step 2: Test API Endpoints
1. **Test**: `https://yourdomain.com/backend/php/api/settings.php`
2. **Should return**: JSON response (not error)

### Step 3: Test Admin Login
1. **Go to**: `https://yourdomain.com/login`
2. **Login with**: `prime1@gmail.com` (create password first via register)
3. **Access**: `https://yourdomain.com/admin`

### Step 4: Test Database Connection
1. **Check**: API responses work
2. **Verify**: User registration works
3. **Confirm**: Bookings can be created

## Phase 6: Final Setup

### Step 1: Seed Initial Data (Optional)
**Run in phpMyAdmin**:
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

### Step 2: SSL Certificate (Recommended)
1. **In cPanel** → **SSL/TLS**
2. **Enable "Force HTTPS Redirect"**
3. **Install SSL certificate** (Let's Encrypt free option)

## Troubleshooting Common Issues

### Database Connection Error
- **Check**: Database credentials in `db.php`
- **Verify**: Database exists in cPanel
- **Confirm**: User has permissions

### API Not Working
- **Check**: `.htaccess` files uploaded correctly
- **Verify**: File permissions (755 for folders, 644 for files)
- **Test**: Direct API file access

### Frontend Not Loading
- **Verify**: `frontend/out/` folder exists
- **Check**: Domain in `.env.local` is correct
- **Confirm**: `.htaccess` routing rules

### Upload Issues
- **Check**: File size limits in cPanel
- **Verify**: `uploads/` folder permissions (755)
- **Ensure**: PHP extensions enabled (GD, MySQL)

## Success Indicators
✅ Homepage loads without errors  
✅ User registration works  
✅ Admin panel accessible  
✅ API endpoints respond  
✅ Database operations function  
✅ File uploads work  

Your coworking space website is now **live and functional**! 🚀

## Database Credentials (Already Configured)
- **Database Name**: primeonelk_user_coworking
- **Username**: primeonelk_user_coworking  
- **Password**: Qw!S_RC0,C9U0nIA
- **Host**: localhost

## Important Files Created
- `deploy.bat` - Deployment script
- `production-htaccess-root` - Root .htaccess file
- `production-htaccess-backend` - Backend .htaccess file
- `HOSTING_GUIDE.md` - This guide

## Support
If you encounter issues, check the troubleshooting section above or verify each step carefully.