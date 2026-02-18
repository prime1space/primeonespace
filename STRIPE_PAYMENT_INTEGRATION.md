# 💳 Stripe Payment Integration Guide

## 🎯 **Complete Stripe Integration for PrimeOne Coworking Space**

This guide will help you integrate Stripe payments for bookings, memberships, and events.

---

## ✅ **What You'll Get**

- ✅ Accept credit/debit card payments
- ✅ Support for LKR (Sri Lankan Rupees)
- ✅ Secure payment processing
- ✅ Automatic receipts
- ✅ Refund management
- ✅ Subscription billing (for monthly memberships)
- ✅ Mobile-friendly checkout

---

## 💰 **Stripe Pricing**

### **Transaction Fees:**
- **Sri Lanka**: 3.4% + LKR 25 per transaction
- **International cards**: 4.4% + LKR 25 per transaction

### **Example:**
- Booking: LKR 1,500
- Stripe fee: LKR 76 (3.4% + 25)
- You receive: LKR 1,424

**No monthly fees, no setup fees!**

---

## 🚀 **Quick Setup (20 Minutes)**

### **Step 1: Create Stripe Account** (5 minutes)

1. Go to https://stripe.com
2. Click "Start now"
3. Fill in details:
   - **Email**: your@email.com
   - **Country**: Sri Lanka 🇱🇰
   - **Business type**: Individual or Company
4. Verify email
5. Complete business profile

---

### **Step 2: Get API Keys** (2 minutes)

1. Log in to Stripe Dashboard
2. Click **"Developers"** → **"API keys"**
3. You'll see two keys:
   - **Publishable key**: `pk_test_...` (for frontend)
   - **Secret key**: `sk_test_...` (for backend)
4. Copy both keys

**Note**: These are TEST keys. You'll get LIVE keys after account verification.

---

### **Step 3: Install Stripe Libraries** (3 minutes)

#### **Backend (PHP):**
```bash
cd backend/php
composer require stripe/stripe-php
```

#### **Frontend (Next.js):**
```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

---

### **Step 4: Add API Keys to Environment** (2 minutes)

#### **Backend `.env`:**
```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### **Frontend `.env.local`:**
```bash
# Stripe Publishable Key (safe to expose)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

---

## 💻 **Implementation**

### **Backend: Payment Intent API** (`backend/php/api/create-payment-intent.php`)

```php
<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../db.php';

// Load Stripe
\Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

header('Content-Type: application/json');

try {
    // Get request data
    $input = json_decode(file_get_contents('php://input'), true);
    
    $amount = $input['amount']; // Amount in LKR (e.g., 1500)
    $bookingId = $input['bookingId'];
    $userId = $input['userId'];
    
    // Create Payment Intent
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => $amount * 100, // Convert to cents (LKR 1500 = 150000 cents)
        'currency' => 'lkr',
        'metadata' => [
            'booking_id' => $bookingId,
            'user_id' => $userId,
            'business' => 'PrimeOne Coworking Space'
        ],
        'description' => "Booking #$bookingId - PrimeOne Space",
        'receipt_email' => $input['email'] ?? null,
    ]);
    
    // Return client secret
    echo json_encode([
        'clientSecret' => $paymentIntent->client_secret,
        'paymentIntentId' => $paymentIntent->id
    ]);
    
} catch (\Stripe\Exception\ApiErrorException $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
```

---

### **Backend: Webhook Handler** (`backend/php/api/stripe-webhook.php`)

```php
<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../db.php';

\Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

$endpoint_secret = $_ENV['STRIPE_WEBHOOK_SECRET'];

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];

try {
    $event = \Stripe\Webhook::constructEvent(
        $payload, $sig_header, $endpoint_secret
    );
} catch(\UnexpectedValueException $e) {
    http_response_code(400);
    exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
    http_response_code(400);
    exit();
}

// Handle the event
switch ($event->type) {
    case 'payment_intent.succeeded':
        $paymentIntent = $event->data->object;
        
        // Update booking status to "paid"
        $bookingId = $paymentIntent->metadata->booking_id;
        $conn = getDBConnection();
        
        $stmt = $conn->prepare("
            UPDATE bookings 
            SET payment_status = 'paid', 
                stripe_payment_id = ?,
                updated_at = NOW()
            WHERE id = ?
        ");
        $stmt->execute([$paymentIntent->id, $bookingId]);
        
        // Send confirmation email
        require_once __DIR__ . '/../send_email_brevo.php';
        $booking = getBookingDetails($bookingId);
        sendBookingConfirmationEmail($booking['guest_email'], $booking);
        
        error_log("Payment succeeded for booking #$bookingId");
        break;
        
    case 'payment_intent.payment_failed':
        $paymentIntent = $event->data->object;
        $bookingId = $paymentIntent->metadata->booking_id;
        
        error_log("Payment failed for booking #$bookingId");
        // Optionally: Send failure notification
        break;
        
    default:
        error_log('Received unknown event type ' . $event->type);
}

http_response_code(200);
?>
```

---

### **Frontend: Payment Component** (`frontend/src/components/StripeCheckout.tsx`)

```typescript
"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Load Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutFormProps {
  amount: number;
  bookingId: string;
  onSuccess: () => void;
}

function CheckoutForm({ amount, bookingId, onSuccess }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/booking/success?booking_id=${bookingId}`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "An error occurred");
      setIsProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? "Processing..." : `Pay LKR ${amount.toLocaleString()}`}
      </Button>
    </form>
  );
}

export default function StripeCheckout({
  amount,
  bookingId,
  email,
  onSuccess,
}: CheckoutFormProps & { email: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Create Payment Intent
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        bookingId,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, bookingId, email]);

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            amount={amount}
            bookingId={bookingId}
            onSuccess={onSuccess}
          />
        </Elements>
      </CardContent>
    </Card>
  );
}
```

---

### **Frontend: Booking Flow with Payment** (`frontend/src/app/bookings/new/page.tsx`)

```typescript
"use client";

import { useState } from "react";
import StripeCheckout from "@/components/StripeCheckout";
import { Button } from "@/components/ui/button";

export default function NewBookingPage() {
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [bookingData, setBookingData] = useState({
    spaceId: "",
    date: "",
    startTime: "",
    endTime: "",
    amount: 0,
    bookingId: "",
  });

  const handleBookingSubmit = async (data: any) => {
    // Create booking in database
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const booking = await response.json();
    
    setBookingData({
      ...data,
      bookingId: booking.id,
      amount: booking.total_price,
    });
    
    setStep("payment");
  };

  const handlePaymentSuccess = () => {
    setStep("success");
  };

  return (
    <div className="container max-w-2xl mx-auto py-12">
      {step === "details" && (
        <div>
          {/* Booking form */}
          <h1>Book Your Space</h1>
          {/* ... form fields ... */}
          <Button onClick={() => handleBookingSubmit(/* form data */)}>
            Continue to Payment
          </Button>
        </div>
      )}

      {step === "payment" && (
        <StripeCheckout
          amount={bookingData.amount}
          bookingId={bookingData.bookingId}
          email="user@example.com" // Get from session
          onSuccess={handlePaymentSuccess}
        />
      )}

      {step === "success" && (
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600">✓ Payment Successful!</h1>
          <p>Your booking has been confirmed.</p>
          <p>Booking ID: #{bookingData.bookingId}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 🔔 **Setup Webhooks** (5 minutes)

Webhooks notify your server when payments succeed/fail.

### **Steps:**
1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter URL: `https://yourdomain.com/api/stripe-webhook.php`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy **Signing secret** (starts with `whsec_...`)
6. Add to `.env`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

---

## 🧪 **Testing**

### **Test Cards:**

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | ✅ Successful payment |
| `4000 0000 0000 9995` | ❌ Declined (insufficient funds) |
| `4000 0025 0000 3155` | ✅ Requires authentication (3D Secure) |

**Expiry**: Any future date (e.g., 12/34)  
**CVC**: Any 3 digits (e.g., 123)  
**ZIP**: Any 5 digits (e.g., 12345)

### **Test Locally:**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:8001/stripe-webhook.php
```

---

## 💡 **Features to Implement**

### **1. Refunds**
```php
// backend/php/api/refund.php
$refund = \Stripe\Refund::create([
    'payment_intent' => $paymentIntentId,
    'amount' => $amount * 100, // Partial or full refund
]);
```

### **2. Subscriptions** (for monthly memberships)
```php
// Create subscription
$subscription = \Stripe\Subscription::create([
    'customer' => $customerId,
    'items' => [['price' => 'price_monthly_membership']],
]);
```

### **3. Save Cards** (for repeat customers)
```php
// Create customer
$customer = \Stripe\Customer::create([
    'email' => $email,
    'name' => $name,
]);

// Attach payment method
$paymentMethod->attach(['customer' => $customer->id]);
```

---

## 🔒 **Security Best Practices**

✅ **Never expose secret key** (keep in `.env`, server-side only)  
✅ **Validate webhook signatures** (prevent fake webhooks)  
✅ **Use HTTPS** in production (required by Stripe)  
✅ **Verify amounts** server-side (don't trust client)  
✅ **Log all transactions** (for debugging and compliance)  

---

## 📊 **Database Schema Updates**

Add payment tracking to bookings table:

```sql
ALTER TABLE bookings ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE bookings ADD COLUMN stripe_payment_id VARCHAR(255);
ALTER TABLE bookings ADD COLUMN stripe_customer_id VARCHAR(255);
ALTER TABLE bookings ADD COLUMN payment_method VARCHAR(50);
ALTER TABLE bookings ADD COLUMN refund_status VARCHAR(20);
ALTER TABLE bookings ADD COLUMN refund_amount DECIMAL(10,2);
```

---

## 🚀 **Go Live Checklist**

Before accepting real payments:

- [ ] Complete Stripe account verification
- [ ] Add business details
- [ ] Verify bank account (for payouts)
- [ ] Switch to LIVE API keys (`pk_live_...` and `sk_live_...`)
- [ ] Update webhook URL to production
- [ ] Test with real card (small amount)
- [ ] Set up payout schedule
- [ ] Enable 3D Secure (recommended)
- [ ] Review refund policy

---

## 💰 **Pricing Examples**

### **Your Costs:**

| Booking Amount | Stripe Fee | You Receive |
|----------------|------------|-------------|
| LKR 500 | LKR 42 | LKR 458 |
| LKR 1,500 | LKR 76 | LKR 1,424 |
| LKR 5,000 | LKR 195 | LKR 4,805 |
| LKR 10,000 | LKR 365 | LKR 9,635 |

**Formula**: Fee = (Amount × 3.4%) + LKR 25

---

## 📞 **Support**

- **Stripe Docs**: https://stripe.com/docs
- **Stripe Support**: support@stripe.com
- **Sri Lanka Support**: Available via dashboard chat

---

## 🎉 **Summary**

You'll have:
- ✅ Secure payment processing
- ✅ Support for all major cards
- ✅ Automatic receipts
- ✅ Refund management
- ✅ Subscription billing
- ✅ Mobile-friendly checkout

**Setup Time**: ~20 minutes  
**Cost**: 3.4% + LKR 25 per transaction  
**No monthly fees!**

---

**Want me to implement this for you?** Just say "implement Stripe" and I'll set it all up! 🚀
