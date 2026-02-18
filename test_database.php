<?php
// Test database connection and verify tables
include_once 'backend/php/db.php';

echo "Testing database connection...\n";

try {
    // Test connection
    $stmt = $conn->query("SELECT 1");
    echo "✓ Database connection successful\n";
    
    // Check if session table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'session'");
    if ($stmt->rowCount() > 0) {
        echo "✓ Session table exists\n";
    } else {
        echo "✗ Session table missing - creating it...\n";
        $conn->exec("
            CREATE TABLE `session` (
              `id` varchar(255) NOT NULL,
              `expires_at` timestamp NOT NULL,
              `token` varchar(255) NOT NULL,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              `ip_address` varchar(255) DEFAULT NULL,
              `user_agent` text,
              `user_id` varchar(255) NOT NULL,
              PRIMARY KEY (`id`),
              UNIQUE KEY `session_token_unique` (`token`),
              KEY `session_user_id_user_id_fk` (`user_id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ");
        echo "✓ Session table created\n";
    }
    
    // Check if user table exists
    $stmt = $conn->query("SHOW TABLES LIKE 'user'");
    if ($stmt->rowCount() > 0) {
        echo "✓ User table exists\n";
    } else {
        echo "✗ User table missing - creating it...\n";
        $conn->exec("
            CREATE TABLE `user` (
              `id` varchar(255) NOT NULL,
              `name` varchar(255) NOT NULL,
              `email` varchar(255) NOT NULL,
              `email_verified` tinyint(1) NOT NULL DEFAULT '0',
              `image` text,
              `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
              `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              PRIMARY KEY (`id`),
              UNIQUE KEY `user_email_unique` (`email`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
        ");
        echo "✓ User table created\n";
    }
    
    // Add admin user if not exists
    $stmt = $conn->prepare("SELECT id FROM user WHERE email = ?");
    $stmt->execute(['prime1@gmail.com']);
    if ($stmt->rowCount() == 0) {
        echo "Adding admin user...\n";
        $stmt = $conn->prepare("INSERT INTO user (id, name, email, email_verified, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())");
        $stmt->execute(['NDm0tOM5eDg8QOrvbclDMqfeTZH7S9lO', 'Prime One Admin', 'prime1@gmail.com']);
        echo "✓ Admin user added\n";
    } else {
        echo "✓ Admin user exists\n";
    }
    
    // Test session functionality
    echo "\nTesting session functionality...\n";
    $testToken = bin2hex(random_bytes(32));
    $sessionId = bin2hex(random_bytes(16));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+7 days'));
    
    $stmt = $conn->prepare("INSERT INTO session (id, token, user_id, expires_at, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())");
    $stmt->execute([$sessionId, $testToken, 'NDm0tOM5eDg8QOrvbclDMqfeTZH7S9lO', $expiresAt]);
    echo "✓ Test session created\n";
    
    // Clean up test session
    $stmt = $conn->prepare("DELETE FROM session WHERE token = ?");
    $stmt->execute([$testToken]);
    echo "✓ Test session cleaned up\n";
    
    echo "\n✅ All database checks passed!\n";
    
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
}
?>