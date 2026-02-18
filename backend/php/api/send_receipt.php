<?php
// backend/php/api/send_receipt.php
include_once __DIR__ . '/../db.php';
require __DIR__ . '/../vendor/autoload.php';

// Note: In a real production environment, you should use PHPMailer or a similar library.
// For this standard PHP setup, we will use the built-in mail() function, 
// which requires a configured SMTP server (like Postfix/Sendmail) on the machine.
// Alternatively, we can use a library if composer is set up. 
// Given the environment, let's assume standard mail() but formatted as HTML.

$data = json_decode(file_get_contents("php://input"), true);
$userId = getUserId($conn);

if (!$userId) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$bookingId = $data['bookingId'];
$pdfData = $data['pdfData']; // Base64 encoded PDF

// 1. Fetch Booking Details to verify ownership/access
$stmt = $conn->prepare("SELECT b.id, u.email as userEmail, u.name as userName 
                        FROM bookings b 
                        JOIN user u ON b.user_id = u.id 
                        WHERE b.id = ?");
$stmt->execute([$bookingId]);
$booking = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$booking) {
    http_response_code(404);
    echo json_encode(["error" => "Booking not found"]);
    exit();
}

// Load .env
try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->load();
} catch (Exception $e) {}

$resendApiKey = $_ENV['RESEND_API_KEY'] ?? '';

if (empty($resendApiKey)) {
    http_response_code(500);
    echo json_encode(["error" => "Email service not configured"]);
    exit();
}

$resend = Resend::client($resendApiKey);

try {
    // PDF content already decoded for normal mail() logic
    $pdfContent = base64_decode(preg_replace('#^data:application/\w+;base64,#i', '', $pdfData));
    
    $to = $booking['userEmail'];
    $subject = "Payment Receipt - PrimeOne Space [Booking #{$bookingId}]";

    $resend->emails->send([
        'from' => 'PrimeOne Space <onboarding@resend.dev>',
        'to' => [$to],
        'subject' => $subject,
        'html' => "
            <html>
            <body style='font-family: sans-serif;'>
                <h2>Booking Confirmed!</h2>
                <p>Dear {$booking['userName']},</p>
                <p>Thank you for booking with PrimeOne Space. Your payment has been received.</p>
                <p>Please find your official receipt attached to this email.</p>
                <br>
                <p>See you soon!</p>
                <p><strong>PrimeOne Space Team</strong></p>
            </body>
            </html>
        ",
        'attachments' => [
            [
                'filename' => "Receipt_{$bookingId}.pdf",
                'content' => base64_encode($pdfContent),
            ]
        ]
    ]);
    echo json_encode(["success" => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to send email: " . $e->getMessage()]);
}
?>
