# Email Service Alternatives to Resend

## 📧 **Email Service Options for Your Application**

Your application currently uses **Resend** for sending emails (password resets, booking confirmations, etc.). Here are the best alternatives with implementation guides.

---

## 🎯 **Recommended Alternatives**

### **1. SendGrid** ⭐ MOST POPULAR
**Best for**: Scalability, reliability, detailed analytics

**Pricing**:
- ✅ **FREE**: 100 emails/day forever
- 💰 **Essentials**: $19.95/month (50,000 emails)
- 💰 **Pro**: $89.95/month (100,000 emails)

**Pros**:
- Industry leader with 99.9% uptime
- Excellent deliverability
- Detailed analytics and tracking
- Email validation API
- Template management
- Webhook support

**Cons**:
- More complex setup than Resend
- Requires domain verification

**Setup Time**: 15-20 minutes

---

### **2. Mailgun** ⭐ DEVELOPER FRIENDLY
**Best for**: Developers, API-first approach

**Pricing**:
- ✅ **FREE Trial**: 5,000 emails/month for 3 months
- 💰 **Foundation**: $35/month (50,000 emails)
- 💰 **Growth**: $80/month (100,000 emails)

**Pros**:
- Simple API similar to Resend
- Excellent documentation
- Email validation
- Powerful routing rules
- Logs and analytics

**Cons**:
- No permanent free tier
- Requires credit card for trial

**Setup Time**: 10-15 minutes

---

### **3. Amazon SES (Simple Email Service)** 💰 CHEAPEST
**Best for**: High volume, cost-conscious

**Pricing**:
- ✅ **FREE**: 62,000 emails/month (if using EC2)
- 💰 **Pay-as-you-go**: $0.10 per 1,000 emails

**Pros**:
- Extremely cheap at scale
- Highly reliable (AWS infrastructure)
- No monthly fees
- Unlimited sending (with approval)

**Cons**:
- Requires AWS account
- More complex setup
- Need to request production access
- Steeper learning curve

**Setup Time**: 30-45 minutes

---

### **4. Brevo (formerly Sendinblue)** ⭐ BEST FREE TIER
**Best for**: Startups, small businesses

**Pricing**:
- ✅ **FREE**: 300 emails/day (9,000/month)
- 💰 **Starter**: $25/month (20,000 emails)
- 💰 **Business**: $65/month (unlimited emails)

**Pros**:
- Generous free tier
- Email + SMS in one platform
- Marketing automation included
- Contact management
- Beautiful email templates

**Cons**:
- Daily sending limit on free tier
- Brevo branding on free tier

**Setup Time**: 10-15 minutes

---

### **5. Postmark** ⭐ BEST DELIVERABILITY
**Best for**: Transactional emails, high deliverability

**Pricing**:
- 💰 **Pay-as-you-go**: $1.25 per 1,000 emails
- 💰 **Monthly**: $15/month (10,000 emails)

**Pros**:
- Best-in-class deliverability (99%+)
- Fast delivery (seconds)
- Beautiful templates
- Detailed analytics
- Excellent support

**Cons**:
- No free tier
- More expensive than competitors

**Setup Time**: 10-15 minutes

---

### **6. SMTP2GO** 
**Best for**: Simple SMTP, quick setup

**Pricing**:
- ✅ **FREE**: 1,000 emails/month
- 💰 **Starter**: $10/month (10,000 emails)

**Pros**:
- Simple SMTP setup
- Good free tier
- Real-time analytics
- API available

**Cons**:
- Less features than competitors
- Smaller company

**Setup Time**: 5-10 minutes

---

### **7. Gmail SMTP** ⚠️ NOT RECOMMENDED FOR PRODUCTION
**Best for**: Development/testing only

**Pricing**:
- ✅ **FREE**: 500 emails/day

**Pros**:
- Completely free
- Easy setup
- No API key needed

**Cons**:
- ❌ Not reliable for production
- ❌ Daily limit of 500 emails
- ❌ May be flagged as spam
- ❌ Requires app password

**Setup Time**: 5 minutes

---

## 🏆 **RECOMMENDATION**

### **For Your Coworking Space:**

**Best Choice**: **Brevo (Sendinblue)** 🎯

**Why?**
- ✅ **FREE**: 300 emails/day = 9,000/month
- ✅ Perfect for a coworking space (unlikely to exceed 300 bookings/day)
- ✅ Easy setup (similar to Resend)
- ✅ Professional features (templates, analytics)
- ✅ Can upgrade as you grow

**Alternative**: **SendGrid** if you need more than 300 emails/day

---

## 💻 **IMPLEMENTATION GUIDES**

### **Option 1: Brevo (Sendinblue) - RECOMMENDED**

#### **Step 1: Sign Up**
1. Go to https://www.brevo.com
2. Create free account
3. Verify your email

#### **Step 2: Get API Key**
1. Go to Settings → SMTP & API
2. Create new API key
3. Copy the key

#### **Step 3: Update Your Code**

```php
<?php
// backend/php/send_email.php

function sendEmail($to, $subject, $htmlContent, $textContent = '') {
    $apiKey = $_ENV['BREVO_API_KEY'];
    
    $data = [
        'sender' => [
            'name' => 'PrimeOne Space',
            'email' => 'noreply@primeone.space'
        ],
        'to' => [
            ['email' => $to]
        ],
        'subject' => $subject,
        'htmlContent' => $htmlContent,
        'textContent' => $textContent ?: strip_tags($htmlContent)
    ];
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, 'https://api.brevo.com/v3/smtp/email');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'accept: application/json',
        'api-key: ' . $apiKey,
        'content-type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return $httpCode === 201;
}
?>
```

#### **Step 4: Update .env**
```bash
# Replace RESEND_API_KEY with:
BREVO_API_KEY=your_brevo_api_key_here
```

---

### **Option 2: SendGrid**

#### **Step 1: Sign Up**
1. Go to https://sendgrid.com
2. Create free account
3. Verify email and phone

#### **Step 2: Get API Key**
1. Go to Settings → API Keys
2. Create API Key
3. Give it "Full Access" or "Mail Send" permission
4. Copy the key (shown only once!)

#### **Step 3: Install SendGrid PHP Library**
```bash
cd backend/php
composer require sendgrid/sendgrid
```

#### **Step 4: Update Your Code**

```php
<?php
// backend/php/send_email.php

require 'vendor/autoload.php';

function sendEmail($to, $subject, $htmlContent, $textContent = '') {
    $apiKey = $_ENV['SENDGRID_API_KEY'];
    
    $email = new \SendGrid\Mail\Mail();
    $email->setFrom("noreply@primeone.space", "PrimeOne Space");
    $email->setSubject($subject);
    $email->addTo($to);
    $email->addContent("text/plain", $textContent ?: strip_tags($htmlContent));
    $email->addContent("text/html", $htmlContent);
    
    $sendgrid = new \SendGrid($apiKey);
    
    try {
        $response = $sendgrid->send($email);
        return $response->statusCode() === 202;
    } catch (Exception $e) {
        error_log('SendGrid Error: ' . $e->getMessage());
        return false;
    }
}
?>
```

#### **Step 5: Update .env**
```bash
SENDGRID_API_KEY=your_sendgrid_api_key_here
```

---

### **Option 3: Mailgun**

#### **Step 1: Sign Up**
1. Go to https://www.mailgun.com
2. Create account
3. Verify email

#### **Step 2: Get API Key**
1. Go to Settings → API Keys
2. Copy your Private API key
3. Note your domain (e.g., sandboxXXX.mailgun.org)

#### **Step 3: Update Your Code**

```php
<?php
// backend/php/send_email.php

function sendEmail($to, $subject, $htmlContent, $textContent = '') {
    $apiKey = $_ENV['MAILGUN_API_KEY'];
    $domain = $_ENV['MAILGUN_DOMAIN']; // e.g., sandboxXXX.mailgun.org
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.mailgun.net/v3/{$domain}/messages");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_USERPWD, "api:{$apiKey}");
    curl_setopt($ch, CURLOPT_POSTFIELDS, [
        'from' => 'PrimeOne Space <noreply@primeone.space>',
        'to' => $to,
        'subject' => $subject,
        'html' => $htmlContent,
        'text' => $textContent ?: strip_tags($htmlContent)
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return $httpCode === 200;
}
?>
```

#### **Step 4: Update .env**
```bash
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=sandboxXXX.mailgun.org
```

---

### **Option 4: Amazon SES**

#### **Step 1: AWS Setup**
1. Create AWS account
2. Go to Amazon SES console
3. Verify your email address
4. Request production access (if needed)

#### **Step 2: Get Credentials**
1. Go to IAM → Users → Create User
2. Attach policy: `AmazonSESFullAccess`
3. Create access key
4. Save Access Key ID and Secret Access Key

#### **Step 3: Install AWS SDK**
```bash
cd backend/php
composer require aws/aws-sdk-php
```

#### **Step 4: Update Your Code**

```php
<?php
// backend/php/send_email.php

require 'vendor/autoload.php';
use Aws\Ses\SesClient;

function sendEmail($to, $subject, $htmlContent, $textContent = '') {
    $client = new SesClient([
        'version' => 'latest',
        'region' => 'us-east-1', // or your region
        'credentials' => [
            'key' => $_ENV['AWS_ACCESS_KEY_ID'],
            'secret' => $_ENV['AWS_SECRET_ACCESS_KEY']
        ]
    ]);
    
    try {
        $result = $client->sendEmail([
            'Source' => 'PrimeOne Space <noreply@primeone.space>',
            'Destination' => [
                'ToAddresses' => [$to]
            ],
            'Message' => [
                'Subject' => [
                    'Data' => $subject,
                    'Charset' => 'UTF-8'
                ],
                'Body' => [
                    'Html' => [
                        'Data' => $htmlContent,
                        'Charset' => 'UTF-8'
                    ],
                    'Text' => [
                        'Data' => $textContent ?: strip_tags($htmlContent),
                        'Charset' => 'UTF-8'
                    ]
                ]
            ]
        ]);
        
        return true;
    } catch (Exception $e) {
        error_log('SES Error: ' . $e->getMessage());
        return false;
    }
}
?>
```

#### **Step 5: Update .env**
```bash
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
```

---

## 📊 **COMPARISON TABLE**

| Service | Free Tier | Cost (50k emails) | Deliverability | Ease of Setup | Best For |
|---------|-----------|-------------------|----------------|---------------|----------|
| **Brevo** | 9,000/month | $25/month | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Startups |
| **SendGrid** | 100/day | $19.95/month | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Scale |
| **Mailgun** | 5,000 (trial) | $35/month | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Developers |
| **Amazon SES** | 62,000* | $5 | ⭐⭐⭐⭐ | ⭐⭐⭐ | High Volume |
| **Postmark** | None | $15/month | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Transactional |
| **SMTP2GO** | 1,000/month | $10/month | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Simple Needs |
| **Resend** | 100/day | $20/month | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Modern Apps |

*If using EC2

---

## 🎯 **MY RECOMMENDATION FOR YOU**

### **Use Brevo (Sendinblue)** 

**Why?**
1. ✅ **Best free tier**: 300 emails/day (9,000/month)
2. ✅ **Perfect for coworking space**: Unlikely to exceed limit
3. ✅ **Easy migration**: Similar API to Resend
4. ✅ **Professional features**: Templates, analytics, automation
5. ✅ **Room to grow**: Easy upgrade path

**Implementation Time**: 15 minutes

---

## 🔄 **MIGRATION STEPS**

### **Quick Migration (Any Service)**

1. **Sign up** for new service (5 min)
2. **Get API key** (2 min)
3. **Update `.env`** file (1 min)
4. **Update email function** (5 min)
5. **Test** with a booking (2 min)

**Total Time**: ~15 minutes

---

## 🧪 **TESTING**

After switching, test these emails:
- [ ] Password reset email
- [ ] Booking confirmation email
- [ ] Welcome email (registration)
- [ ] Event registration email

---

## 💡 **PRO TIPS**

### **1. Use Multiple Services** (Advanced)
```php
// Fallback to secondary service if primary fails
function sendEmailWithFallback($to, $subject, $html) {
    if (!sendEmailBrevo($to, $subject, $html)) {
        return sendEmailSendGrid($to, $subject, $html);
    }
    return true;
}
```

### **2. Track Delivery**
Most services provide webhooks for:
- Email delivered
- Email opened
- Link clicked
- Bounced
- Spam complaint

### **3. Use Templates**
Store email templates in the service dashboard for:
- Easier updates
- Better formatting
- A/B testing

---

## 📞 **NEED HELP?**

**Want me to implement any of these?** Just say:
- "Use Brevo instead"
- "Switch to SendGrid"
- "Implement Mailgun"
- etc.

I'll update all the code for you! 🚀

---

**Last Updated**: February 16, 2026  
**Recommended**: Brevo (Sendinblue)  
**Alternative**: SendGrid
