<?php
// backend/php/api/csrf-token.php
header('Content-Type: application/json');

global $conn;

if (!isset($conn)) {
    include_once __DIR__ . '/../db.php';
}

require_once __DIR__ . '/../CSRFProtection.php';

$csrf = new CSRFProtection($conn);

// Get user ID from session if available
$userId = null;
$sessionId = null;

// Check for bearer token
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    $token = $matches[1];
    
    try {
        $stmt = $conn->prepare("SELECT user_id, id FROM session WHERE token = ? AND expires_at > NOW()");
        $stmt->execute([$token]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($session) {
            $userId = $session['user_id'];
            $sessionId = $session['id'];
        }
    } catch (PDOException $e) {
        // Continue without user ID
    }
}

// Generate new CSRF token
$csrfToken = $csrf->generateToken($userId, $sessionId);

echo json_encode([
    'token' => $csrfToken,
    'expiresIn' => 3600 // 1 hour
]);
?>
