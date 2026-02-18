
# Troubleshooting Email Issues

It appears your workspace is unable to send emails because the Gmail credentials in your `.env` file are being rejected by Google. This is a common security feature.

## The Error
Your server reported: `535 5.7.8 Username and Password not accepted.`

## How to Fix It (Gmail)

You cannot use your standard Google account password for this. You must use an **App Password**.

### Step 1: Enable 2-Step Verification
1. Go to your [Google Account Security Settings](https://myaccount.google.com/security).
2. Under "How you sign in to Google", ensure **2-Step Verification** is turned **ON**.

### Step 2: Generate an App Password
1. Go to the search bar in your Google Account settings and search for **"App passwords"**.
2. Create a new app name (e.g., "Coworking Website").
3. Google will give you a 16-character password (e.g., `abcd efgh ijkl mnop`).

### Step 3: Update your .env file
1. Open the `.env` file in your project root.
2. Find `SMTP_PASS`.
3. Replace the current password with the 16-character App Password (remove spaces if you want, but Google accepts them usually, better to remove spaces for code).
   ```env
   SMTP_PASS=abcdefghijklmnop
   ```
4. Find `SMTP_USER` and ensure it is your full Gmail address (e.g., `prime1@gmail.com`).
5. Save the file.

### Step 4: Restart Server
You must restart your development server for `.env` changes to take effect.
1. Stop the running server (Ctrl+C).
2. Run `npm run dev` again.
