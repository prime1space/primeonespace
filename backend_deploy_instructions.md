# Backend Deployment Checklist

If your backend is not working on the server after uploading `backend.zip`, you almost certainly need to run **Composer** to reinstall the dependencies, or properly configure your `.env` file for the production database.

Here are the strict steps you must follow on your server:

## 1. Install Dependencies
Because we excluded the massive `vendor/` folder from the ZIP to make the upload fast and clean, you need to reinstall packages on the server:
1. SSH into your server or open its terminal.
2. Navigate into your backend directory (where `composer.json` is located).
3. Run the following command exactly:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```
*(If your hosting is cPanel and you don't have SSH access to run Composer, tell me and I will re-zip the backend including the `vendor/` folder!)*

## 2. Environment Variables (.env)
Your server needs to connect to the live database, not your local Mac database.
1. Locate the `.env` file in the backend folder (it might be hidden on some servers, ensure you show hidden files).
2. Edit the file to include your **Live Production Database Credentials**:
   ```env
   DB_HOST=127.0.0.1 (or your production host)
   DB_NAME=your_live_database_name
   DB_USER=your_live_database_username
   DB_PASS=your_live_database_password
   ```

## 3. Stripe Secret Keys (If using Stripe)
Since we added Stripe, make sure your production `.env` file contains your **Live Server Secret Keys**, NOT the test ones we used locally:
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 4. Ensure .htaccess is Working
If you get 404 errors for all APIs, it means your Apache server isn't reading the `.htaccess` file inside the `api/` folder.
- Ensure your Apache configuration has `AllowOverride All` enabled for your backend directory.

## 5. Folder Permissions
Sometimes uploads fail because folder permissions are incorrect.
- Ensure the `backend/php/api/uploads/` directory exists and has **755** or **775** permissions so PHP can save images.
