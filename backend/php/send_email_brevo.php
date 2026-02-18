<?php
// backend/php/send_email_brevo.php

/**
 * Send email using Brevo (Sendinblue) API
 * FREE: 300 emails/day, 9,000/month
 * 
 * @param string $to Recipient email address
 * @param string $subject Email subject
 * @param string $htmlContent HTML content of the email
 * @param string $textContent Plain text content (optional)
 * @param string $fromName Sender name (default: PrimeOne Space)
 * @param string $fromEmail Sender email (default: noreply@primeone.space)
 * @return bool True if email sent successfully, false otherwise
 */
function sendEmailBrevo($to, $subject, $htmlContent, $textContent = '', $fromName = 'PrimeOne Space', $fromEmail = 'noreply@primeone.space') {
    // Get API key from environment
    $apiKey = $_ENV['BREVO_API_KEY'] ?? '';
    
    if (empty($apiKey)) {
        error_log('Brevo API key not found in environment variables');
        return false;
    }
    
    // Prepare email data
    $data = [
        'sender' => [
            'name' => $fromName,
            'email' => $fromEmail
        ],
        'to' => [
            [
                'email' => $to,
                'name' => explode('@', $to)[0] // Use email prefix as name
            ]
        ],
        'subject' => $subject,
        'htmlContent' => $htmlContent,
        'textContent' => $textContent ?: strip_tags($htmlContent)
    ];
    
    // Initialize cURL
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
    
    // Execute request
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    // Log result
    if ($httpCode === 201) {
        error_log("Brevo email sent successfully to: $to");
        return true;
    } else {
        error_log("Brevo email failed. HTTP Code: $httpCode, Error: $error, Response: $response");
        return false;
    }
}

/**
 * Send password reset email
 */
function sendPasswordResetEmail($to, $resetToken, $userName = '') {
    $resetLink = "https://primeone.space/reset-password?token=$resetToken";
    
    $subject = "Reset Your Password - PrimeOne Space";
    
    $htmlContent = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff4917 0%, #ff6b47 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #ff4917; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Password Reset Request</h1>
            </div>
            <div class='content'>
                <p>Hello" . ($userName ? " $userName" : "") . ",</p>
                <p>We received a request to reset your password for your PrimeOne Space account.</p>
                <p>Click the button below to reset your password:</p>
                <p style='text-align: center;'>
                    <a href='$resetLink' class='button'>Reset Password</a>
                </p>
                <p>Or copy and paste this link into your browser:</p>
                <p style='word-break: break-all; color: #666;'>$resetLink</p>
                <p><strong>This link will expire in 1 hour.</strong></p>
                <p>If you didn't request this password reset, please ignore this email or contact us if you have concerns.</p>
                <p>Best regards,<br>The PrimeOne Space Team</p>
            </div>
            <div class='footer'>
                <p>PrimeOne Space | 146B, Goodshed Road, Thonikkal, Vavuniya, Sri Lanka</p>
                <p>+94 70 623 3612 | hello@primeone.space</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $textContent = "Hello" . ($userName ? " $userName" : "") . ",\n\n"
        . "We received a request to reset your password for your PrimeOne Space account.\n\n"
        . "Click this link to reset your password:\n$resetLink\n\n"
        . "This link will expire in 1 hour.\n\n"
        . "If you didn't request this password reset, please ignore this email.\n\n"
        . "Best regards,\nThe PrimeOne Space Team";
    
    return sendEmailBrevo($to, $subject, $htmlContent, $textContent);
}

/**
 * Send booking confirmation email
 */
function sendBookingConfirmationEmail($to, $bookingDetails) {
    $subject = "Booking Confirmation - PrimeOne Space";
    
    $htmlContent = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff4917 0%, #ff6b47 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-label { font-weight: bold; color: #666; }
            .detail-value { color: #333; }
            .total { font-size: 18px; font-weight: bold; color: #ff4917; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>✓ Booking Confirmed!</h1>
            </div>
            <div class='content'>
                <p>Hello {$bookingDetails['guest_name']},</p>
                <p>Your booking at PrimeOne Space has been confirmed. We're excited to host you!</p>
                
                <div class='booking-details'>
                    <h3>Booking Details</h3>
                    <div class='detail-row'>
                        <span class='detail-label'>Booking ID:</span>
                        <span class='detail-value'>#{$bookingDetails['id']}</span>
                    </div>
                    <div class='detail-row'>
                        <span class='detail-label'>Space:</span>
                        <span class='detail-value'>{$bookingDetails['space_name']}</span>
                    </div>
                    <div class='detail-row'>
                        <span class='detail-label'>Date:</span>
                        <span class='detail-value'>{$bookingDetails['date']}</span>
                    </div>
                    <div class='detail-row'>
                        <span class='detail-label'>Time:</span>
                        <span class='detail-value'>{$bookingDetails['start_time']} - {$bookingDetails['end_time']}</span>
                    </div>
                    <div class='detail-row'>
                        <span class='detail-label'>Duration:</span>
                        <span class='detail-value'>{$bookingDetails['duration']}</span>
                    </div>
                    <div class='detail-row total'>
                        <span>Total Amount:</span>
                        <span>LKR {$bookingDetails['total_price']}</span>
                    </div>
                </div>
                
                <p><strong>What to bring:</strong></p>
                <ul>
                    <li>Valid ID for verification</li>
                    <li>Your laptop and charger</li>
                    <li>This confirmation email (digital or printed)</li>
                </ul>
                
                <p><strong>Location:</strong><br>
                146B, Goodshed Road, Thonikkal<br>
                Vavuniya, Sri Lanka</p>
                
                <p>Need to make changes? Contact us at +94 70 623 3612 or reply to this email.</p>
                
                <p>See you soon!<br>The PrimeOne Space Team</p>
            </div>
            <div class='footer'>
                <p>PrimeOne Space | 146B, Goodshed Road, Thonikkal, Vavuniya, Sri Lanka</p>
                <p>+94 70 623 3612 | hello@primeone.space</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $textContent = "Hello {$bookingDetails['guest_name']},\n\n"
        . "Your booking at PrimeOne Space has been confirmed!\n\n"
        . "BOOKING DETAILS\n"
        . "Booking ID: #{$bookingDetails['id']}\n"
        . "Space: {$bookingDetails['space_name']}\n"
        . "Date: {$bookingDetails['date']}\n"
        . "Time: {$bookingDetails['start_time']} - {$bookingDetails['end_time']}\n"
        . "Duration: {$bookingDetails['duration']}\n"
        . "Total: LKR {$bookingDetails['total_price']}\n\n"
        . "Location: 146B, Goodshed Road, Thonikkal, Vavuniya, Sri Lanka\n\n"
        . "See you soon!\nThe PrimeOne Space Team";
    
    return sendEmailBrevo($to, $subject, $htmlContent, $textContent);
}

/**
 * Send welcome email
 */
function sendWelcomeEmail($to, $userName) {
    $subject = "Welcome to PrimeOne Space! 🎉";
    
    $htmlContent = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff4917 0%, #ff6b47 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #ff4917; }
            .button { display: inline-block; background: #ff4917; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Welcome to PrimeOne Space! 🎉</h1>
            </div>
            <div class='content'>
                <p>Hello $userName,</p>
                <p>Welcome to Vavuniya's premier coworking community! We're thrilled to have you join us.</p>
                
                <h3>What's Next?</h3>
                
                <div class='feature'>
                    <strong>📅 Book Your First Space</strong><br>
                    Browse our hot desks, private offices, and meeting rooms.
                </div>
                
                <div class='feature'>
                    <strong>🎯 Join Events</strong><br>
                    Connect with fellow entrepreneurs and attend workshops.
                </div>
                
                <div class='feature'>
                    <strong>⚡ Enjoy Starlink WiFi</strong><br>
                    Experience lightning-fast internet for your work.
                </div>
                
                <p style='text-align: center;'>
                    <a href='https://primeone.space/spaces' class='button'>Browse Spaces</a>
                </p>
                
                <p><strong>Need help getting started?</strong><br>
                Our team is here to help! Contact us at +94 70 623 3612 or reply to this email.</p>
                
                <p>Let's build something amazing together!<br>
                The PrimeOne Space Team</p>
            </div>
            <div class='footer'>
                <p>PrimeOne Space | 146B, Goodshed Road, Thonikkal, Vavuniya, Sri Lanka</p>
                <p>+94 70 623 3612 | hello@primeone.space</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $textContent = "Hello $userName,\n\n"
        . "Welcome to PrimeOne Space! We're thrilled to have you join Vavuniya's premier coworking community.\n\n"
        . "WHAT'S NEXT?\n\n"
        . "📅 Book Your First Space\nBrowse our hot desks, private offices, and meeting rooms.\n\n"
        . "🎯 Join Events\nConnect with fellow entrepreneurs and attend workshops.\n\n"
        . "⚡ Enjoy Starlink WiFi\nExperience lightning-fast internet for your work.\n\n"
        . "Visit https://primeone.space/spaces to get started!\n\n"
        . "Need help? Contact us at +94 70 623 3612\n\n"
        . "Let's build something amazing together!\nThe PrimeOne Space Team";
    
    return sendEmailBrevo($to, $subject, $htmlContent, $textContent);
}
?>
