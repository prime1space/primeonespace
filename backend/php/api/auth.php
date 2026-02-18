<?php
// backend/php/api/auth.php
header('Content-Type: application/json');

// $conn should already be available from router.php or direct include
// Use global keyword to be safe if inside function scope (though router is global)
global $conn;

if (!isset($conn)) {
    // Should be included by router, but if hit directly via .htaccess in production
    include_once __DIR__ . '/../db.php';
}

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../RateLimiter.php';
require_once __DIR__ . '/../CSRFProtection.php';
require_once __DIR__ . '/../send_email_smtp.php';

// Initialize security components
$rateLimiter = new RateLimiter($conn);
$csrfProtection = new CSRFProtection($conn);

// Load .env
try {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../');
    $dotenv->load();
} catch (Exception $e) {
    // .env might be missing in some environments, handle gracefully
}

// Debug logging
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);
$log_file = __DIR__ . '/auth_debug.log';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Method=$method, Path=$path\n", FILE_APPEND);

// Helper to generate IDs like Better-Auth (simple random string)
function generateId() {
    return bin2hex(random_bytes(16));
}

// Extract the action from the path (e.g., sign-in/email)
$action = "";
if (preg_match('/auth\/(.+)$/', $path, $matches)) {
    $action = rtrim($matches[1], '/');
}

// Remove .php if present in action
$action = str_replace('.php/', '', $action);
$action = str_replace('.php', '', $action);
file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Action=$action\n", FILE_APPEND);

switch ($action) {
    case 'sign-up/email':
        if ($method !== 'POST') break;
        
        // Rate limiting: 3 registrations per hour
        $rateCheck = $rateLimiter->checkLimit('register', 3, 3600, 3600);
        if (!$rateCheck['allowed']) {
            http_response_code(429);
            echo json_encode([
                "error" => [
                    "message" => $rateCheck['message'],
                    "code" => "RATE_LIMIT_EXCEEDED",
                    "retryAfter" => $rateCheck['retryAfter']
                ]
            ]);
            exit();
        }
        
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => ["message" => "No data received", "code" => "BAD_REQUEST"]]);
            exit();
        }
        $email = strtolower(trim($data['email']));
        $password = password_hash($data['password'], PASSWORD_BCRYPT);
        $name = $data['name'];
        $phone = $data['phone'] ?? null;
        $nicPassport = $data['nic_passport'] ?? null;
        $address = $data['address'] ?? null;
        $country = $data['country'] ?? 'Sri Lanka';
        $dateOfBirth = $data['date_of_birth'] ?? null;
        $gender = $data['gender'] ?? null;
        $emergencyContactName = $data['emergency_contact_name'] ?? null;
        $emergencyContactPhone = $data['emergency_contact_phone'] ?? null;
        $userId = generateId();

        try {
            $conn->beginTransaction();
            
            // Check if user already exists
            $check = $conn->prepare("SELECT id FROM user WHERE LOWER(email) = ?");
            $check->execute([$email]);
            if ($check->fetch()) {
                $conn->rollBack();
                http_response_code(400);
                echo json_encode(["error" => ["message" => "An account with this email already exists", "code" => "USER_ALREADY_EXISTS"]]);
                exit();
            }

            // Insert user with email_verified = true for immediate access
            $stmt = $conn->prepare("INSERT INTO user (id, name, email, phone, nic_passport, address, country, date_of_birth, gender, emergency_contact_name, emergency_contact_phone, email_verified, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())");
            $userResult = $stmt->execute([$userId, $name, $email, $phone, $nicPassport, $address, $country, $dateOfBirth, $gender, $emergencyContactName, $emergencyContactPhone]);
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "User insert result: " . ($userResult ? 'SUCCESS' : 'FAILED') . "\n", FILE_APPEND);

            // Insert account
            $accountId = generateId();
            $stmt = $conn->prepare("INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
            $accountResult = $stmt->execute([$accountId, $userId, 'email', $userId, $password]);
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Account insert result: " . ($accountResult ? 'SUCCESS' : 'FAILED') . "\n", FILE_APPEND);

            // Auto-login after registration
            $token = bin2hex(random_bytes(32));
            $sessionId = generateId();
            $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));
            $stmt = $conn->prepare("INSERT INTO session (id, token, user_id, expires_at, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())");
            $sessionResult = $stmt->execute([$sessionId, $token, $userId, $expiresAt]);
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Session insert result: " . ($sessionResult ? 'SUCCESS' : 'FAILED') . " Token: $token\n", FILE_APPEND);

            $conn->commit();
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Registration SUCCESS for $email with token $token\n", FILE_APPEND);

            // Send Welcome Email
            try {
                // Use Brevo function
                sendWelcomeEmail($email, $name);
                file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Welcome Email Sent (Brevo) to $email\n", FILE_APPEND);
            } catch (Exception $e) {
                file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Welcome Email Failed: " . $e->getMessage() . "\n", FILE_APPEND);
            }

            header("set-auth-token: " . $token);
            echo json_encode([
                "status" => true,
                "token" => $token,
                "user" => ["id" => $userId, "email" => $email, "name" => $name, "emailVerified" => true]
            ]);
        } catch (PDOException $e) {
            if ($conn->inTransaction()) $conn->rollBack();
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Auth Error (sign-up): " . $e->getMessage() . "\n", FILE_APPEND);
            http_response_code(500);
            echo json_encode(["error" => ["message" => "Registration failed: " . $e->getMessage(), "code" => "DATABASE_ERROR"]]);
        }
        break;

    case 'sign-in/email':
        file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Processing sign-in/email\n", FILE_APPEND);
        if ($method !== 'POST') {
             file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Method not POST\n", FILE_APPEND);
             break;
        }
        
        // Rate limiting: 5 attempts per minute, 15 minute lockout
        $rateCheck = $rateLimiter->checkLimit('login', 5, 60, 900);
        if (!$rateCheck['allowed']) {
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Rate limit exceeded\n", FILE_APPEND);
            http_response_code(429);
            echo json_encode([
                "error" => [
                    "message" => $rateCheck['message'],
                    "code" => "RATE_LIMIT_EXCEEDED",
                    "retryAfter" => $rateCheck['retryAfter']
                ]
            ]);
            exit();
        }
        
        $rawInput = file_get_contents("php://input");
        file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Raw input: " . substr($rawInput, 0, 100) . "\n", FILE_APPEND);
        
        $data = json_decode($rawInput, true);
        if (!$data) {
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "JSON decode failed: " . json_last_error_msg() . "\n", FILE_APPEND);
            http_response_code(400);
            echo json_encode(["error" => ["message" => "No data received", "code" => "BAD_REQUEST"]]);
            exit();
        }
        
        $email = strtolower(trim($data['email']));
        $password = $data['password'];
        
        file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Attempting login for: $email\n", FILE_APPEND);

        try {
            if (!$conn) {
                throw new Exception("Database connection not established");
            }

            $stmt = $conn->prepare("SELECT u.id, u.email, u.name, a.password FROM user u JOIN account a ON u.id = a.user_id WHERE LOWER(u.email) = ? AND (a.provider_id = 'email' OR a.provider_id = 'credential')");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Auth: Found user=" . ($user ? $user['email'] : 'NONE') . "\n", FILE_APPEND);

            if (!$user) {
                file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Auth Error: User not found or incorrect provider for $email\n", FILE_APPEND);
                http_response_code(401);
                echo json_encode(["error" => ["message" => "Account not found with this email", "code" => "INVALID_CREDENTIALS"]]);
                exit();
            }

            if (password_verify($password, $user['password'])) {
                file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Auth: Password verification SUCCESS for $email\n", FILE_APPEND);
                
                // Reset rate limiter on successful login
                $rateLimiter->reset('login');
                
                $token = bin2hex(random_bytes(32));
                $sessionId = generateId();
                $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));

                $stmt = $conn->prepare("INSERT INTO session (id, token, user_id, expires_at, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())");
                $stmt->execute([$sessionId, $token, $user['id'], $expiresAt]);

                header("set-auth-token: " . $token);
                
                // Clear any previous output
                if (ob_get_length()) ob_clean();
                
                echo json_encode([
                    "status" => true,
                    "token" => $token,
                    "user" => ["id" => $user['id'], "email" => $user['email'], "name" => $user['name']]
                ]);
            } else {
                file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Auth Error: Incorrect password for $email\n", FILE_APPEND);
                http_response_code(401);
                echo json_encode(["error" => ["message" => "Incorrect password. Please try again.", "code" => "INVALID_CREDENTIALS"]]);
            }
        } catch (PDOException $e) {
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Auth Error (sign-in): " . $e->getMessage() . "\n", FILE_APPEND);
            http_response_code(500);
            echo json_encode(["error" => ["message" => "Database error: " . $e->getMessage(), "code" => "DATABASE_ERROR"]]);
        } catch (Exception $e) {
             file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "General Error: " . $e->getMessage() . "\n", FILE_APPEND);
             http_response_code(500);
             echo json_encode(["error" => ["message" => "Server error: " . $e->getMessage(), "code" => "SERVER_ERROR"]]);
        }
        break;

    case 'debug-users':
        $stmt = $conn->query("SELECT email, name FROM user");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'get-session':
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');
        
        // Fallback for Apache/FastCGI/Built-in Server
        if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        }
        
        file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "get-session: Headers " . print_r($headers, true) . "\n", FILE_APPEND);
        file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "get-session: Auth Header: $authHeader\n", FILE_APPEND);
        
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "get-session: Checking token $token\n", FILE_APPEND);
            
            $stmt = $conn->prepare("SELECT s.user_id, s.expires_at, u.id, u.name, u.email, u.image, u.email_verified FROM session s JOIN user u ON s.user_id = u.id WHERE s.token = ?");
            $stmt->execute([$token]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($result && strtotime($result['expires_at']) > time()) {
                file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "get-session: Valid session for " . $result['email'] . "\n", FILE_APPEND);
                echo json_encode([
                    "user" => [
                        "id" => $result['id'],
                        "name" => $result['name'],
                        "email" => $result['email'],
                        "image" => $result['image'],
                        "emailVerified" => (bool)$result['email_verified']
                    ],
                    "session" => [
                        "userId" => $result['user_id'],
                        "expiresAt" => $result['expires_at']
                    ]
                ]);
            } else {
                file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "get-session: Invalid or expired session\n", FILE_APPEND);
                echo json_encode(["user" => null, "session" => null]);
            }
        } else {
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "get-session: No Bearer token found\n", FILE_APPEND);
            echo json_encode(["user" => null, "session" => null]);
        }
        break;

    case 'forgot-password':
        if ($method !== 'POST') break;
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['email'])) {
            http_response_code(400);
            echo json_encode(["error" => ["message" => "Email is required", "code" => "BAD_REQUEST"]]);
            exit();
        }
        $email = strtolower(trim($data['email']));

        // 1. Check if user exists
        $stmt = $conn->prepare("SELECT id, name FROM user WHERE LOWER(email) = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            // For security, don't reveal if user exists or not
            echo json_encode(["status" => true, "message" => "If an account exists with this email, a reset link has been sent."]);
            exit();
        }

        // 2. Generate and store token
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+30 minutes'));
        
        // Remove any old tokens for this email
        $stmt = $conn->prepare("DELETE FROM verification WHERE identifier = ?");
        $stmt->execute([$email]);

        // Insert new token
        $stmt = $conn->prepare("INSERT INTO verification (id, identifier, value, expires_at, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([generateId(), $email, $token, $expiresAt]);

        // 3. Send Email
        $resetLink = "https://primeone.space/reset-password?token=" . $token;
        if (strpos($_SERVER['HTTP_HOST'], 'localhost') !== false) {
            $resetLink = "http://localhost:3000/reset-password?token=" . $token;
        }

        $to = $email;
        $subject = "Reset Your Password - PrimeOne Space";
        $headers = "From: noreply@primeonespace.lk\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

        $message = "
        <html>
        <body style='font-family: sans-serif; line-height: 1.6;'>
            <div style='max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;'>
                <h2 style='color: #ff4917;'>PrimeOne Space</h2>
                <p>Hello {$user['name']},</p>
                <p>You requested to reset your password. Please click the button below to set a new password. This link will expire in 30 minutes.</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{$resetLink}' style='background-color: #ff4917; color: white; padding: 12px 24px; text-decoration: none; rounded: 5px; font-weight: bold;'>Reset Password</a>
                </div>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>
                <p style='font-size: 12px; color: #777;'>PrimeOne Space Team | Vavuniya, Sri Lanka</p>
            </div>
        </body>
        </html>
        ";

        // Send Email using Brevo
        try {
            $result = sendPasswordResetEmail($to, $token, $user['name']);
            if ($result) {
                file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Forgot Password: Email sent to $email\n", FILE_APPEND);
                echo json_encode(["status" => true, "message" => "If an account exists with this email, a reset link has been sent."]);
            } else {
                throw new Exception("Brevo returned false");
            }
        } catch (Exception $e) {
             file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Forgot Password: Email failed to $email. Error: " . $e->getMessage() . "\n", FILE_APPEND);
             http_response_code(500);
             echo json_encode(["error" => ["message" => "Failed to send email. Please try again later.", "code" => "EMAIL_ERROR"]]);
        }
        break;

    case 'reset-password':
        if ($method !== 'POST') break;
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data || !isset($data['token']) || !isset($data['password'])) {
            http_response_code(400);
            echo json_encode(["error" => ["message" => "Token and password are required", "code" => "BAD_REQUEST"]]);
            exit();
        }

        $token = $data['token'];
        $newPassword = password_hash($data['password'], PASSWORD_BCRYPT);

        // 1. Verify token
        $stmt = $conn->prepare("SELECT identifier, expires_at FROM verification WHERE value = ?");
        $stmt->execute([$token]);
        $verify = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$verify || strtotime($verify['expires_at']) < time()) {
            http_response_code(400);
            echo json_encode(["error" => ["message" => "Invalid or expired token", "code" => "INVALID_TOKEN"]]);
            exit();
        }

        $email = $verify['identifier'];

        try {
            $conn->beginTransaction();

            // 2. Get User ID
            $stmt = $conn->prepare("SELECT id FROM user WHERE LOWER(email) = ?");
            $stmt->execute([strtolower($email)]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                throw new Exception("User not found for this token");
            }

            // 3. Update Password in account table
            $stmt = $conn->prepare("UPDATE account SET password = ?, updated_at = NOW() WHERE user_id = ?");
            $stmt->execute([$newPassword, $user['id']]);

            // 4. Delete Token
            $stmt = $conn->prepare("DELETE FROM verification WHERE value = ?");
            $stmt->execute([$token]);

            $conn->commit();
            echo json_encode(["status" => true, "message" => "Password updated successfully."]);
        } catch (Exception $e) {
            $conn->rollBack();
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Reset Password Error: " . $e->getMessage() . "\n", FILE_APPEND);
            http_response_code(500);
            echo json_encode(["error" => ["message" => "Failed to reset password: " . $e->getMessage(), "code" => "SERVER_ERROR"]]);
        }
        break;

    case 'sign-out':
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            $stmt = $conn->prepare("DELETE FROM session WHERE token = ?");
            $stmt->execute([$token]);
        }
        echo json_encode(["status" => true]);
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => ["message" => "Auth endpoint not found: " . $action, "code" => "NOT_FOUND"]]);
        break;
}
?>
