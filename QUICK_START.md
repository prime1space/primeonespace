# 🚀 Quick Start Guide - Production Deployment

## ⚡ **5-Minute Security Setup**

### **Step 1: Environment Variables** (2 minutes)

```bash
# Backend
cd backend
cp .env.example .env
nano .env  # Add your RESEND_API_KEY

# Frontend
cd ../frontend
cp .env.example .env.local
nano .env.local  # Update NEXT_PUBLIC_API_URL to your domain
```

### **Step 2: Update CORS** (1 minute)

Edit `backend/php/db.php`:
```php
// Line ~15: Change this
$allowed_origins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

// To this (use your actual domain)
$allowed_origins = ['https://primeone.space', 'https://www.primeone.space'];
```

### **Step 3: Build Frontend** (2 minutes)

```bash
cd frontend
npm install --legacy-peer-deps
npm run build
```

---

## 📋 **Pre-Launch Checklist** (15 minutes)

- [ ] Environment variables configured
- [ ] CORS updated to production domain
- [ ] SSL certificate installed
- [ ] Database backups configured
- [ ] Frontend built successfully
- [ ] Test login (should work)
- [ ] Test rate limiting (try 6 wrong passwords)
- [ ] Check logs: `backend/php/api/rate_limit.log`

---

## 🧪 **Quick Tests**

### **Test 1: Rate Limiting Works**
```bash
# Try to login 6 times with wrong password
# Should get blocked after 5 attempts
for i in {1..6}; do
  curl -X POST https://yoursite.com/backend/php/api/auth/sign-in/email \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}';
  echo "\n--- Attempt $i ---";
done
```

Expected: First 5 attempts return 401, 6th returns 429 (rate limited)

### **Test 2: Registration Works**
```bash
curl -X POST https://yoursite.com/backend/php/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@test.com",
    "password":"Test1234!",
    "name":"Test User",
    "phone":"+94771234567",
    "country":"Sri Lanka"
  }'
```

Expected: 200 OK with user data

### **Test 3: Login Works**
```bash
curl -X POST https://yoursite.com/backend/php/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{"email":"newuser@test.com","password":"Test1234!"}'
```

Expected: 200 OK with token

---

## 📊 **Monitoring Dashboard**

### **Check Rate Limits**
```sql
SELECT ip_address, endpoint, attempts, locked_until 
FROM rate_limits 
WHERE locked_until > NOW()
ORDER BY locked_until DESC
LIMIT 10;
```

### **Check Recent Logins**
```sql
SELECT u.email, s.created_at, s.expires_at
FROM session s
JOIN user u ON s.user_id = u.id
ORDER BY s.created_at DESC
LIMIT 10;
```

### **Check CSRF Tokens**
```sql
SELECT COUNT(*) as total, SUM(used) as used
FROM csrf_tokens
WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR);
```

---

## 🆘 **Troubleshooting**

### **Problem: Rate limit not working**
```bash
# Check if table exists
mysql -u root -p -e "SHOW TABLES LIKE 'rate_limits';" primeonelk_user_coworking

# Check logs
tail -f backend/php/api/rate_limit.log
```

### **Problem: CORS errors**
- Check `db.php` has your production domain
- Verify SSL is working (https://)
- Check browser console for exact error

### **Problem: Login fails**
```bash
# Check auth logs
tail -f backend/php/api/auth_debug.log

# Check database connection
php backend/php/test-db-connection.php
```

---

## 📞 **Quick Reference**

### **Important Files**:
- `backend/.env` - API keys and secrets
- `frontend/.env.local` - Frontend config
- `backend/php/db.php` - Database and CORS config
- `backend/php/api/rate_limit.log` - Rate limit events
- `backend/php/api/auth_debug.log` - Auth events

### **Important URLs**:
- `/backend/php/api/auth/sign-in/email` - Login
- `/backend/php/api/auth/sign-up/email` - Register
- `/backend/php/api/csrf-token.php` - Get CSRF token
- `/backend/php/api/bookings` - Bookings API

### **Rate Limits**:
- Login: 5 attempts/minute
- Register: 3 attempts/hour
- Lockout: 15 minutes (login), 1 hour (register)

---

## 🎯 **Success Criteria**

Your site is ready to launch when:

✅ Rate limiting blocks after 5 failed logins  
✅ Users can register and login successfully  
✅ HTTPS is working (green padlock)  
✅ No errors in browser console  
✅ Database backups are running  
✅ Monitoring is set up  

---

## 📚 **Full Documentation**

For detailed information, see:
- `SECURITY.md` - Complete security guide
- `SECURITY_IMPLEMENTATION_SUMMARY.md` - What we built
- `PRODUCTION_READINESS_CHECKLIST.md` - Full launch checklist
- `README.md` - Project documentation

---

**Need Help?**  
Check the logs first:
```bash
tail -f backend/php/api/*.log
```

**Good luck with your launch!** 🚀
