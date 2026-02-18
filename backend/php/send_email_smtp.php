<?php
// backend/php/send_email_smtp.php

/**
 * Send email using cPanel SMTP
 * 
 * @param string $to Recipient email
 * @param string $subject Email subject
 * @param string $htmlContent HTML body
 * @param string $textContent Plain text body
 * @return bool True on success
 */
function sendEmailSMTP($to, $subject, $htmlContent, $textContent = '') {
    // Get SMTP credentials from .env
    $host = $_ENV['SMTP_HOST'] ?? 'primeone.space';
    $port = $_ENV['SMTP_PORT'] ?? 465;
    $username = $_ENV['SMTP_USER'] ?? 'hello@primeone.space';
    $password = $_ENV['SMTP_PASS'] ?? '';
    $fromEmail = $username; 
    $fromName = 'PrimeOne Space';

    if (empty($username) || empty($password)) {
        error_log("SMTP Error: Credentials missing in .env");
        return false;
    }

    // Boundary for multipart/alternative
    $boundary = md5(uniqid(time()));

    // Headers
    $headers = [
        "MIME-Version: 1.0",
        "From: $fromName <$fromEmail>",
        "Reply-To: $fromEmail",
        "Content-Type: multipart/alternative; boundary=\"$boundary\""
    ];

    // Body
    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= ($textContent ?: strip_tags($htmlContent)) . "\r\n\r\n";
    
    $body .= "--$boundary\r\n";
    $body .= "Content-Type: text/html; charset=UTF-8\r\n";
    $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $body .= $htmlContent . "\r\n\r\n";
    $body .= "--$boundary--";

    // Try PHP mail() first (Simplest on cPanel)
    // If hosting is configured correctly, this uses local SMTP automatically
    $params = "-f" . $fromEmail;
    $subject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
    
    if (mail($to, $subject, $body, implode("\r\n", $headers), $params)) {
        error_log("Email sent via PHP mail() to $to");
        return true;
    }

    // If mail() fails, we would need a full SMTP socket class (complex).
    // Usually on cPanel, mail() IS the way.
    error_log("PHP mail() failed for $to");
    return false;
}

// Wrapper for Password Reset
function sendPasswordResetEmail($to, $resetToken, $userName = '') {
    $resetLink = "https://primeone.space/reset-password?token=$resetToken";
    $subject = "Reset Your Password - PrimeOne Space";
    
    $htmlContent = "
    <html>
    <body style='font-family: Arial, sans-serif; color: #333;'>
        <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;'>
            <h2 style='color: #ff4917;'>Password Reset</h2>
            <p>Hello $userName,</p>
            <p>Click below to reset your password:</p>
            <p><a href='$resetLink' style='background: #ff4917; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Reset Password</a></p>
            <p>Or paste this link: $resetLink</p>
            <p>Link expires in 30 minutes.</p>
        </div>
    </body>
    </html>";

    return sendEmailSMTP($to, $subject, $htmlContent);
}

// Wrapper for Welcome Email
function sendWelcomeEmail($to, $userName) {
    $subject = "Welcome to PrimeOne Space!";
    
    $htmlContent = "
    <html>
    <body style='font-family: Arial, sans-serif; color: #333;'>
        <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;'>
            <h2 style='color: #ff4917;'>Welcome $userName!</h2>
            <p>We are thrilled to have you at PrimeOne Space.</p>
            <p><a href='https://primeone.space/login' style='background: #ff4917; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Log In Now</a></p>
        </div>
    </body>
    </html>";

    return sendEmailSMTP($to, $subject, $htmlContent);
}

// Wrapper for Booking Confirmation
function sendBookingConfirmationEmail($to, $bookingDetails) {
    $subject = "Booking Confirmed: #" . $bookingDetails['id'];
    
    $htmlContent = "
    <html>
    <body style='font-family: Arial, sans-serif; color: #333;'>
        <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;'>
            <h2 style='color: #ff4917;'>Booking Confirmed!</h2>
            <p>Space: {$bookingDetails['space_name']}</p>
            <p>Date: {$bookingDetails['date']}</p>
            <p>Time: {$bookingDetails['start_time']} - {$bookingDetails['end_time']}</p>
            <p>Total: LKR {$bookingDetails['total_price']}</p>
        </div>
    </body>
    </html>";

    return sendEmailSMTP($to, $subject, $htmlContent);
}
?>
