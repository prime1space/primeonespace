<?php
// Test registration endpoint
include_once 'db.php';

echo "Testing Registration System\n";
echo "==========================\n\n";

// Test database connection
try {
    $stmt = $conn->query("SELECT COUNT(*) as count FROM user");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "✓ Database connection successful\n";
    echo "✓ Current users in database: " . $result['count'] . "\n\n";
} catch (Exception $e) {
    echo "✗ Database connection failed: " . $e->getMessage() . "\n";
    exit;
}

// Test user creation
$testEmail = "test" . time() . "@example.com";
$testName = "Test User";
$testPassword = password_hash("testpassword123", PASSWORD_BCRYPT);
$userId = bin2hex(random_bytes(16));

try {
    $conn->beginTransaction();
    
    // Insert user
    $stmt = $conn->prepare("INSERT INTO user (id, name, email, email_verified, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())");
    $userResult = $stmt->execute([$userId, $testName, $testEmail]);
    echo "✓ User creation: " . ($userResult ? 'SUCCESS' : 'FAILED') . "\n";
    
    // Insert account
    $accountId = bin2hex(random_bytes(16));
    $stmt = $conn->prepare("INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
    $accountResult = $stmt->execute([$accountId, $userId, 'email', $userId, $testPassword]);
    echo "✓ Account creation: " . ($accountResult ? 'SUCCESS' : 'FAILED') . "\n";
    
    // Create session
    $token = bin2hex(random_bytes(32));
    $sessionId = bin2hex(random_bytes(16));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));
    $stmt = $conn->prepare("INSERT INTO session (id, token, user_id, expires_at, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())");
    $sessionResult = $stmt->execute([$sessionId, $token, $userId, $expiresAt]);
    echo "✓ Session creation: " . ($sessionResult ? 'SUCCESS' : 'FAILED') . "\n";
    
    $conn->commit();
    echo "✓ Transaction committed successfully\n\n";
    
    // Test session retrieval
    $stmt = $conn->prepare("SELECT s.user_id, s.expires_at, u.id, u.name, u.email FROM session s JOIN user u ON s.user_id = u.id WHERE s.token = ?");
    $stmt->execute([$token]);
    $sessionData = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($sessionData) {
        echo "✓ Session retrieval successful\n";
        echo "  User: " . $sessionData['name'] . " (" . $sessionData['email'] . ")\n";
        echo "  Expires: " . $sessionData['expires_at'] . "\n";
        echo "  Token: " . substr($token, 0, 16) . "...\n\n";
    } else {
        echo "✗ Session retrieval failed\n\n";
    }
    
    // Clean up test data
    $conn->prepare("DELETE FROM session WHERE user_id = ?")->execute([$userId]);
    $conn->prepare("DELETE FROM account WHERE user_id = ?")->execute([$userId]);
    $conn->prepare("DELETE FROM user WHERE id = ?")->execute([$userId]);
    echo "✓ Test data cleaned up\n";
    
} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    echo "✗ Registration test failed: " . $e->getMessage() . "\n";
}

echo "\nTest completed!\n";
?>