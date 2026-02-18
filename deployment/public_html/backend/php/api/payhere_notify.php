<?php
// backend/php/api/payhere_notify.php
include_once '../db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit();
}

$merchant_id = $_POST['merchant_id'];
$order_id = $_POST['order_id'];
$payhere_amount = $_POST['payhere_amount'];
$payhere_currency = $_POST['payhere_currency'];
$status_code = $_POST['status_code'];
$md5sig = $_POST['md5sig'];

$merchant_secret = "YOUR_PAYHERE_SECRET"; // Update this

$local_md5sig = strtoupper(md5(
    $merchant_id . 
    $order_id . 
    $payhere_amount . 
    $payhere_currency . 
    $status_code . 
    strtoupper(md5($merchant_secret))
));

if ($local_md5sig === $md5sig) {
    if ($status_code == 2) {
        $bookingId = (int)$order_id;
        
        try {
            $conn->beginTransaction();

            // Update booking
            $stmt = $conn->prepare("UPDATE bookings SET payment_status = 'completed', booking_status = 'confirmed' WHERE id = ?");
            $stmt->execute([$bookingId]);

            // Record payment
            $stmt = $conn->prepare("INSERT INTO payments (bookingId, amount, currency, status, provider, transactionId, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
            $stmt->execute([
                $bookingId,
                (float)$payhere_amount,
                $payhere_currency,
                'completed',
                'payhere',
                $_POST['payment_id']
            ]);

            $conn->commit();
            
            // Note: Email sending would go here (using PHP mail() or PHPMailer)
            
        } catch (PDOException $e) {
            $conn->rollBack();
            error_log("PayHere DB Error: " . $e->getMessage());
        }
    }
}

echo json_encode(["success" => true]);
?>
