# Deploying to cPanel Guide

This guide describes how to deploy your Next.js application (Frontend) and PHP API (Backend) to a cPanel hosting environment.

## 🏗️ 1. Prepare Your Deployment Files

### **Frontend Build**
I have already run the build command for you. The latest static files are located in:
`frontend/out`

This folder contains everything needed for the frontend.

### **Backend Files**
The backend code is located in:
`backend`

You will need to upload this entire folder to your server, but exclude `node_modules` and `.git` if present.

---

## 🚀 2. Uploading Files to cPanel

### **Step A: File Manager**
1.  Log in to your cPanel.
2.  Open **File Manager**.
3.  Navigate to `public_html` (or the subdomain folder where you want to host the site).

### **Step B: Upload Backend**
1.  Upload the contents of the `backend` folder to a subdirectory, e.g., `api`.
    - Result: `public_html/api/` should contain `index.php`, `router.php`, `composer.json`, etc.
2.  **Important**: Ensure the `.env` file is uploaded to `public_html/api/` and updated with your live database credentials and Stripe keys.
    - If `.env` is hidden, enable "Show Hidden Files" in cPanel settings.

### **Step C: Upload Frontend**
1.  Upload the contents of `frontend/out` to the **root** of your domain folder (e.g., `public_html`).
    - The `index.html` file should be directly inside `public_html`.
    - Other folders like `_next`, `assets`, etc., should also be in `public_html`.

---

## 🗄️ 3. Database Setup

1.  **Export Local Database**: Use a tool like TablePlus or phpMyAdmin (locally) to export your `primeonelk_user_coworking` database to a `.sql` file.
2.  **Create Database on cPanel**:
    - Go to **MySQL Databases** in cPanel.
    - Create a new database (e.g., `primeone_db`).
    - Create a new user and password.
    - Add the user to the database with **All Privileges**.
3.  **Import Data**:
    - Open **phpMyAdmin** in cPanel.
    - Select your new database.
    - Click **Import** and upload your `.sql` file.

---

## 🔧 4. Configuration

### **Backend Configuration (`backend/.env`)**
Edit `public_html/api/.env`:

```ini
DB_HOST=localhost
DB_NAME=primeone_db
DB_USER=primeone_user
DB_PASS=your_secure_password

# Stripe Live Keys
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Brevo)
BREVO_API_KEY=xkeysib-...
```

### **Frontend Configuration**
Since the frontend is static, environment variables are **baked in** at build time. 
**Crucial**: If any `NEXT_PUBLIC_` variables (like Stripe Key or API URL) change, you MUST rebuild locally (`npm run build`) and re-upload the `frontend/out` folder.

Current API URL is set in `frontend/.env.production` (or `.env.local`). 
Ensure it points to your live backend: `https://yourdomain.com/api`.

---

## ✅ 5. Verify Deployment

1.  Visit `https://yourdomain.com`.
2.  Test a booking flow.
3.  Check if the API responds at `https://yourdomain.com/api/health` (if endpoint exists) or try logging in.

---

## 🛠️ Troubleshooting

-   **404 Errors on Refresh**: If you visit a page deep link (e.g., `/dashboard`) and refresh, you might get a 404 because cPanel looks for a folder.
    -   **Fix**: Create a `.htaccess` file in `public_html` with:
        ```apache
        <IfModule mod_rewrite.c>
          RewriteEngine On
          RewriteBase /
          RewriteRule ^index\.html$ - [L]
          RewriteCond %{REQUEST_FILENAME} !-f
          RewriteCond %{REQUEST_FILENAME} !-d
          RewriteRule . /index.html [L]
        </IfModule>
        ```
-   **API Errors**: Check the `error_log` file in the `api` folder on cPanel.
