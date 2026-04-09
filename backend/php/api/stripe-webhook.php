<?php
// backend/php/api/stripe-webhook.php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../db.php';

// Load environment variables
$dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->load();

// Set Stripe API key
\Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY'] ?? '');

$endpoint_secret = $_ENV['STRIPE_WEBHOOK_SECRET'] ?? '';

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

try {
    // Verify webhook signature
    if ($endpoint_secret) {
        $event = \Stripe\Webhook::constructEvent(
            $payload, $sig_header, $endpoint_secret
        );
    } else {
        // For testing without webhook secret
        $event = json_decode($payload, false);
    }
} catch(\UnexpectedValueException $e) {
    error_log('Webhook Error: Invalid payload');
    http_response_code(400);
    exit();
} catch(\Stripe\Exception\SignatureVerificationException $e) {
    error_log('Webhook Error: Invalid signature');
    http_response_code(400);
    exit();
}

// Handle the event
switch ($event->type) {
    case 'payment_intent.succeeded':
        $paymentIntent = $event->data->object;
        
        error_log("Payment succeeded: {$paymentIntent->id}");
        
        // Get booking ID from metadata
        $bookingId = $paymentIntent->metadata->booking_id ?? null;
        
        if ($bookingId) {
            try {

                // $conn is already established by require_once db.php
                if (!isset($conn)) {
                    throw new Exception("Database connection failed");
                }
                
                // Update booking status to "confirmed" and "paid"
                $stmt = $conn->prepare("
                    UPDATE bookings 
                    SET status = 'confirmed',
                        payment_status = 'paid', 
                        stripe_payment_id = ?,
                        payment_method = 'stripe',
                        updated_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$paymentIntent->id, $bookingId]);
                
                error_log("Booking #{$bookingId} marked as paid");
                
                // Get booking details for confirmation email
                $stmt = $conn->prepare("
                    SELECT b.*, s.name as space_name, u.email as guest_email, u.name as guest_name
                    FROM bookings b
                    JOIN spaces s ON b.space_id = s.id
                    JOIN user u ON b.user_id = u.id
                    WHERE b.id = ?
                ");
                $stmt->execute([$bookingId]);
                $booking = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($booking) {
                    // Send confirmation email
                    require_once __DIR__ . '/../send_email.php';
                    
                    $bookingDetails = [
                        'id' => $booking['id'],
                        'guest_name' => $booking['guest_name'],
                        'guest_email' => $booking['guest_email'],
                        'space_name' => $booking['space_name'],
                        'date' => date('F j, Y', strtotime($booking['booking_date'])),
                        'start_time' => date('g:i A', strtotime($booking['start_time'])),
                        'end_time' => date('g:i A', strtotime($booking['end_time'])),
                        'duration' => $booking['duration'] . ' hours',
                        'total_price' => number_format($booking['total_price'], 2)
                    ];
                    
                    sendBookingConfirmationEmail($booking['guest_email'], $bookingDetails);
                    error_log("Confirmation email sent to {$booking['guest_email']}");
                }
                
            } catch (Exception $e) {
                error_log("Error updating booking: " . $e->getMessage());
            }
        }
        break;
        
    case 'payment_intent.payment_failed':
        $paymentIntent = $event->data->object;
        $bookingId = $paymentIntent->metadata->booking_id ?? null;
        
        error_log("Payment failed for booking #{$bookingId}: " . ($paymentIntent->last_payment_error->message ?? 'Unknown error'));
        
        if ($bookingId) {
            try {

                // $conn is already established
                if (!isset($conn)) {
                    throw new Exception("Database connection failed");
                }
                $stmt = $conn->prepare("
                    UPDATE bookings 
                    SET payment_status = 'failed',
                        updated_at = NOW()
                    WHERE id = ?
                ");
                $stmt->execute([$bookingId]);
            } catch (Exception $e) {
                error_log("Error updating failed payment: " . $e->getMessage());
            }
        }
        break;
        
    case 'charge.refunded':
        $charge = $event->data->object;
        $paymentIntentId = $charge->payment_intent;
        
        error_log("Refund processed for payment: {$paymentIntentId}");
        
        try {

            // $conn is already established
            if (!isset($conn)) {
                throw new Exception("Database connection failed");
            }
            $stmt = $conn->prepare("
                UPDATE bookings 
                SET refund_status = 'refunded',
                    refund_amount = ?,
                    updated_at = NOW()
                WHERE stripe_payment_id = ?
            ");
            $refundAmount = $charge->amount_refunded / 100; // Convert from cents
            $stmt->execute([$refundAmount, $paymentIntentId]);
        } catch (Exception $e) {
            error_log("Error updating refund: " . $e->getMessage());
        }
        break;
        
    default:
        error_log('Received unknown event type: ' . $event->type);
}

http_response_code(200);
?>
