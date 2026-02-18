<?php
// backend/php/api/create-payment-intent.php

// 1. Include db.php (Handles Autoload + Dotenv + CORS)
if (file_exists(__DIR__ . '/../db.php')) {
    require_once __DIR__ . '/../db.php';
} elseif (file_exists(__DIR__ . '/db.php')) {
    require_once __DIR__ . '/db.php';
} else {
    http_response_code(500);
    echo json_encode(["error" => "Database configuration missing"]);
    exit();
}

// 2. Set Stripe API Key (From loaded Env)
if (empty($_ENV['STRIPE_SECRET_KEY'])) {
    http_response_code(500);
    echo json_encode(["error" => "Stripe configuration missing"]);
    exit();
}

\Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

try {
    // 3. Get Input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid request data');
    }
    
    $amount = $input['amount'] ?? 0; // Amount in LKR
    $bookingId = $input['bookingId'] ?? null;
    $userId = $input['userId'] ?? null;
    $email = $input['email'] ?? null;
    $description = $input['description'] ?? "Booking #$bookingId";

    if ($amount <= 0) {
        throw new Exception('Invalid amount');
    }

    // 4. Create PaymentIntent
    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount' => (int)($amount * 100), // LKR cents
        'currency' => 'lkr',
        'automatic_payment_methods' => ['enabled' => true],
        'metadata' => [
            'booking_id' => $bookingId,
            'user_id' => $userId
        ],
        'description' => $description,
        'receipt_email' => $email,
    ]);

    echo json_encode([
        'success' => true,
        'clientSecret' => $paymentIntent->client_secret,
        'paymentIntentId' => $paymentIntent->id
    ]);

} catch (Exception $e) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
