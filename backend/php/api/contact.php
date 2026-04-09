<?php
// backend/php/api/contact.php
include_once __DIR__ . '/../db.php';
require_once __DIR__ . '/../send_email.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit();
}

// Get raw JSON payload
$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phone'] ?? '';
$subject = $data['subject'] ?? '';
$message = $data['message'] ?? '';

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(["error" => "Name, Email, and Message are required."]);
    exit();
}

$to = 'hello@primeone.space';
$emailSubject = "New Contact Form Submission: $subject";

$htmlContent = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #14212B; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #eee; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; background: white; padding: 10px; border-radius: 5px; border: 1px solid #ddd; word-wrap: break-word; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>New Contact Message</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Name:</div>
                <div class='value'>$name</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'><a href='mailto:$email'>$email</a></div>
            </div>
            " . ($phone ? "
            <div class='field'>
                <div class='label'>Phone:</div>
                <div class='value'>$phone</div>
            </div>" : "") . "
            " . ($subject ? "
            <div class='field'>
                <div class='label'>Topic:</div>
                <div class='value'>$subject</div>
            </div>" : "") . "
            <div class='field'>
                <div class='label'>Message:</div>
                <div class='value' style='white-space: pre-wrap;'>$message</div>
            </div>
        </div>
    </div>
</body>
</html>
";

$textContent = "New Contact Form Submission\n\n"
    . "Name: $name\n"
    . "Email: $email\n"
    . ($phone ? "Phone: $phone\n" : "")
    . ($subject ? "Topic: $subject\n" : "")
    . "\nMessage:\n$message";

// Use the exact email the user gave as the "From" context, but fallback sending structure to the server identity 
$sent = sendEmailSMTP($to, $emailSubject, $htmlContent, $textContent, $name, $email);

if ($sent) {
    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Message sent successfully."]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to send email. Please try again later."]);
}
