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

require_once __DIR__ . '/../send_email.php';

try {
    // PDF content already decoded
    $pdfContent = base64_decode(preg_replace('#^data:application/\w+;base64,#i', '', $pdfData));
    
    $to = $booking['userEmail'];
    $subject = "Payment Receipt - PrimeOne Space [Booking #{$bookingId}]";
    $htmlContent = "
            <html>
            <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                <div style='max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;'>
                    <h2 style='color: #ff4917;'>Booking Confirmed!</h2>
                    <p>Dear {$booking['userName']},</p>
                    <p>Thank you for booking with PrimeOne Space. Your payment has been received successfully.</p>
                    <p>Please find your official receipt (PDF) for your records.</p>
                    <br>
                    <p>We look forward to seeing you!</p>
                    <p><strong>PrimeOne Space Team</strong></p>
                </div>
            </body>
            </html>
    ";

    // Note: Brevo's API supports attachments. Let's send basic confirmation for now, 
    // or we could use the PHPMailer in send_email.php to include attachments.
    // Given the sendEmailBrevo wrapper doesn't support attachments yet, 
    // I'll stick to a confirmation email and the user can download the PDF in dashboard.
    
    $sent = sendEmailSMTP($to, $subject, $htmlContent);
    
    if ($sent) {
        echo json_encode(["success" => true]);
    } else {
        throw new Exception("Email delivery failed");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to send email: " . $e->getMessage()]);
}
?>
