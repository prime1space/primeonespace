<?php
// backend/php/api/auth.php
header('Content-Type: application/json');

// CORS headers
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, set-auth-token");
header("Access-Control-Expose-Headers: set-auth-token");
header("Access-Control-Allow-Credentials: true");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../db.php';

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
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => ["message" => "No data received", "code" => "BAD_REQUEST"]]);
            exit();
        }
        $email = strtolower(trim($data['email']));
        $password = password_hash($data['password'], PASSWORD_BCRYPT);
        $name = $data['name'];
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
            $stmt = $conn->prepare("INSERT INTO user (id, name, email, email_verified, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())");
            $userResult = $stmt->execute([$userId, $name, $email]);
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
        if ($method !== 'POST') break;
        $data = json_decode(file_get_contents("php://input"), true);
        if (!$data) {
            http_response_code(400);
            echo json_encode(["error" => ["message" => "No data received", "code" => "BAD_REQUEST"]]);
            exit();
        }
        $email = strtolower(trim($data['email']));
        $password = $data['password'];

        try {
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
                $token = bin2hex(random_bytes(32));
                $sessionId = generateId();
                $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));

                $stmt = $conn->prepare("INSERT INTO session (id, token, user_id, expires_at, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())");
                $stmt->execute([$sessionId, $token, $user['id'], $expiresAt]);

                header("set-auth-token: " . $token);
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
        }
        break;

    case 'debug-users':
        $stmt = $conn->query("SELECT email, name FROM user");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'get-session':
        $headers = getallheaders();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');
        
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
