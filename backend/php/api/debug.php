<?php
// backend/php/api/debug.php
include_once __DIR__ . '/../db.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($method === 'GET') {
    // Debug info
    $debug = [
        'database_connection' => 'OK',
        'current_time' => date('Y-m-d H:i:s'),
        'user_count' => 0,
        'session_count' => 0,
        'account_count' => 0
    ];
    
    try {
        $stmt = $conn->query("SELECT COUNT(*) as count FROM user");
        $debug['user_count'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        $stmt = $conn->query("SELECT COUNT(*) as count FROM session");
        $debug['session_count'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        $stmt = $conn->query("SELECT COUNT(*) as count FROM account");
        $debug['account_count'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Get recent users
        $stmt = $conn->query("SELECT id, name, email, email_verified, created_at FROM user ORDER BY created_at DESC LIMIT 5");
        $debug['recent_users'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Get active sessions
        $stmt = $conn->query("SELECT s.id, s.user_id, s.expires_at, u.email FROM session s JOIN user u ON s.user_id = u.id WHERE s.expires_at > NOW() ORDER BY s.created_at DESC LIMIT 5");
        $debug['active_sessions'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
    } catch (Exception $e) {
        $debug['database_error'] = $e->getMessage();
    }
    
    echo json_encode($debug, JSON_PRETTY_PRINT);
}

if ($method === 'POST') {
    // Test registration
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data || !isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields: email, password, name']);
        exit;
    }
    
    $email = strtolower(trim($data['email']));
    $password = password_hash($data['password'], PASSWORD_BCRYPT);
    $name = $data['name'];
    $userId = bin2hex(random_bytes(16));
    
    try {
        $conn->beginTransaction();
        
        // Check if user exists
        $check = $conn->prepare("SELECT id FROM user WHERE LOWER(email) = ?");
        $check->execute([$email]);
        if ($check->fetch()) {
            $conn->rollBack();
            http_response_code(400);
            echo json_encode(['error' => 'User already exists']);
            exit;
        }
        
        // Insert user
        $stmt = $conn->prepare("INSERT INTO user (id, name, email, email_verified, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())");
        $stmt->execute([$userId, $name, $email]);
        
        // Insert account
        $accountId = bin2hex(random_bytes(16));
        $stmt = $conn->prepare("INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$accountId, $userId, 'email', $userId, $password]);
        
        // Create session
        $token = bin2hex(random_bytes(32));
        $sessionId = bin2hex(random_bytes(16));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));
        $stmt = $conn->prepare("INSERT INTO session (id, token, user_id, expires_at, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$sessionId, $token, $userId, $expiresAt]);
        
        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'user_id' => $userId,
            'token' => $token,
            'expires_at' => $expiresAt
        ]);
        
    } catch (Exception $e) {
        if ($conn->inTransaction()) $conn->rollBack();
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>