# 🎉 Brevo Email Setup Guide (100% FREE)

## ✅ **What You Get FREE Forever**

- ✅ **300 emails per day**
- ✅ **9,000 emails per month**
- ✅ Professional email templates
- ✅ Email analytics and tracking
- ✅ No credit card required
- ✅ No expiration

**Perfect for your coworking space!** (Unlikely to exceed 300 bookings/day)

---

## 🚀 **Quick Setup (10 Minutes)**

### **Step 1: Create Brevo Account** (3 minutes)

1. Go to https://www.brevo.com
2. Click "Sign up free"
3. Fill in your details:
   - Email: your@email.com
   - Password: (create a strong password)
   - Company name: PrimeOne Space
4. Click "Create my account"
5. **Verify your email** (check inbox)

---

### **Step 2: Get Your API Key** (2 minutes)

1. Log in to Brevo dashboard
2. Click your name (top right) → **"SMTP & API"**
3. Scroll to **"API Keys"** section
4. Click **"Generate a new API key"**
5. Name it: `PrimeOne Production`
6. Click **"Generate"**
7. **COPY THE KEY** (shown only once!)
   - It looks like: `xkeysib-abc123...`

---

### **Step 3: Add API Key to Your Project** (2 minutes)

```bash
# Navigate to backend folder
cd backend

# Copy the example file
cp .env.example .env

# Edit the .env file
nano .env  # or use any text editor
```

**Add your API key:**
```bash
BREVO_API_KEY=xkeysib-your-actual-api-key-here
```

**Save and close** (Ctrl+X, then Y, then Enter in nano)

---

### **Step 4: Update Your Code** (3 minutes)

The email functions are already created in `send_email_brevo.php`!

Just update your existing code to use them:

#### **For Password Reset (in auth.php):**

Find this line (around line 300):
```php
// OLD (Resend)
// sendPasswordResetEmail($email, $resetToken);
```

Replace with:
```php
// NEW (Brevo - FREE!)
require_once __DIR__ . '/../send_email_brevo.php';
sendPasswordResetEmail($email, $resetToken, $user['name']);
```

#### **For Booking Confirmation (in bookings.php):**

Find where booking confirmation is sent:
```php
// OLD (Resend)
// sendBookingEmail($email, $bookingDetails);
```

Replace with:
```php
// NEW (Brevo - FREE!)
require_once __DIR__ . '/../send_email_brevo.php';
sendBookingConfirmationEmail($email, $bookingDetails);
```

#### **For Welcome Email (in auth.php registration):**

Find the registration success section:
```php
// OLD (Resend)
// sendWelcomeEmail($email, $name);
```

Replace with:
```php
// NEW (Brevo - FREE!)
require_once __DIR__ . '/../send_email_brevo.php';
sendWelcomeEmail($email, $name);
```

---

### **Step 5: Test It!** (2 minutes)

```bash
# Start your backend (if not running)
cd backend/php/api
php -S 127.0.0.1:8001 router.php

# Test password reset
# Try "Forgot Password" on your site
# Check if you receive the email!
```

---

## 🧪 **Testing Checklist**

After setup, test these emails:

- [ ] **Password Reset Email**
  - Go to `/login`
  - Click "Forgot Password"
  - Enter your email
  - Check inbox for reset email

- [ ] **Welcome Email**
  - Register a new account
  - Check inbox for welcome email

- [ ] **Booking Confirmation**
  - Make a test booking
  - Check inbox for confirmation

---

## 📊 **Monitor Your Usage**

### **Check Email Stats:**
1. Log in to Brevo dashboard
2. Go to **"Statistics"** → **"Email"**
3. See:
   - Emails sent today
   - Delivery rate
   - Open rate
   - Click rate

### **Daily Limit:**
- **Free tier**: 300 emails/day
- **Resets**: Every 24 hours
- **Monthly**: 9,000 emails total

---

## 🎨 **Beautiful Email Templates Included**

Your emails now have professional HTML templates with:

✅ **Password Reset Email**
- Clean, modern design
- Big "Reset Password" button
- Security information
- 1-hour expiration notice

✅ **Booking Confirmation Email**
- Booking details table
- Total amount highlighted
- What to bring checklist
- Location information

✅ **Welcome Email**
- Warm greeting
- Feature highlights
- Call-to-action buttons
- Next steps guide

---

## 💡 **Pro Tips**

### **1. Verify Your Domain** (Optional but Recommended)
1. Go to Brevo → **"Senders & IP"**
2. Add your domain: `primeone.space`
3. Add DNS records (they'll show you how)
4. **Benefits:**
   - Better deliverability
   - Remove "via brevo.com" from emails
   - Professional appearance

### **2. Set Up SPF/DKIM** (Recommended)
Add these DNS records to improve deliverability:

```
Type: TXT
Name: @
Value: v=spf1 include:spf.brevo.com ~all

Type: TXT  
Name: mail._domainkey
Value: (Brevo will provide this)
```

### **3. Monitor Bounces**
- Check Brevo dashboard regularly
- Remove bounced emails from your list
- Maintain good sender reputation

---

## 🔧 **Troubleshooting**

### **Problem: Email not sending**

**Check 1: API Key**
```bash
# Verify .env file has the key
cat backend/.env | grep BREVO
```

**Check 2: PHP Logs**
```bash
# Check for errors
tail -f backend/php/api/auth_debug.log
```

**Check 3: Brevo Dashboard**
- Log in to Brevo
- Go to "Logs" → "Email"
- See if emails are being received

### **Problem: Emails going to spam**

**Solutions:**
1. Verify your domain in Brevo
2. Set up SPF/DKIM records
3. Avoid spam trigger words
4. Include unsubscribe link (for marketing emails)

### **Problem: Hit daily limit**

**Solutions:**
1. **Upgrade to paid plan** ($25/month for 20,000 emails)
2. **Optimize emails**: Combine multiple notifications
3. **Use batch sending**: Group emails together

---

## 📈 **When to Upgrade**

### **Stay on FREE if:**
- ✅ Less than 300 bookings/day
- ✅ Less than 9,000 emails/month
- ✅ Basic email needs

### **Upgrade to Starter ($25/month) if:**
- ⚠️ More than 300 bookings/day
- ⚠️ Want to remove Brevo branding
- ⚠️ Need advanced features (automation, A/B testing)
- ⚠️ Want priority support

---

## 🎯 **What's Different from Resend?**

| Feature | Resend | Brevo FREE |
|---------|--------|------------|
| **Free Emails** | 100/day | 300/day |
| **Monthly Free** | 3,000 | 9,000 |
| **Setup Time** | 10 min | 10 min |
| **API Simplicity** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Templates** | Basic | Professional |
| **Analytics** | Basic | Advanced |
| **Cost** | $20/month | FREE! |

**Winner**: Brevo for FREE tier! 🏆

---

## 📞 **Need Help?**

### **Brevo Support:**
- **Help Center**: https://help.brevo.com
- **Email**: contact@brevo.com
- **Chat**: Available in dashboard

### **Your Implementation:**
- Check `send_email_brevo.php` for email functions
- Check `EMAIL_SERVICE_ALTERNATIVES.md` for other options
- Check logs: `backend/php/api/auth_debug.log`

---

## ✅ **Setup Complete!**

You now have:
- ✅ **FREE email service** (9,000 emails/month)
- ✅ **Professional email templates**
- ✅ **Analytics and tracking**
- ✅ **No credit card required**
- ✅ **No expiration**

**Total Setup Time**: ~10 minutes  
**Monthly Cost**: $0 (FREE forever!)  
**Emails per Month**: 9,000  

---

## 🎉 **Congratulations!**

Your coworking space now has **professional, free email service** that can handle:
- 📧 Password resets
- 📧 Booking confirmations
- 📧 Welcome emails
- 📧 Event notifications
- 📧 And more!

**All for FREE!** 🎊

---

**Questions?** Check the troubleshooting section or contact Brevo support.

**Ready to send emails?** Test it now with a password reset!

**Last Updated**: February 16, 2026  
**Service**: Brevo (Sendinblue)  
**Cost**: FREE (9,000 emails/month)  
**Status**: ✅ READY TO USE
