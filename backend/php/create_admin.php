<?php
// Create admin user
include_once 'db.php';

echo "Creating Admin User\n";
echo "==================\n\n";

$adminEmail = 'prime1@gmail.com';
$adminName = 'Admin';
$adminPassword = 'Admin@123'; // Change this password

try {
    $conn->beginTransaction();
    
    // Check if admin user already exists
    $check = $conn->prepare("SELECT id FROM user WHERE LOWER(email) = ?");
    $check->execute([strtolower($adminEmail)]);
    
    if ($check->fetch()) {
        echo "✓ Admin user already exists with email: $adminEmail\n";
        $conn->rollBack();
        exit;
    }
    
    // Generate user ID
    $userId = bin2hex(random_bytes(16));
    
    // Insert admin user
    $stmt = $conn->prepare("INSERT INTO user (id, name, email, email_verified, created_at, updated_at) VALUES (?, ?, ?, 1, NOW(), NOW())");
    $stmt->execute([$userId, $adminName, $adminEmail]);
    echo "✓ Admin user created successfully\n";
    
    // Insert admin account with password
    $hashedPassword = password_hash($adminPassword, PASSWORD_BCRYPT);
    $accountId = bin2hex(random_bytes(16));
    $stmt = $conn->prepare("INSERT INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
    $stmt->execute([$accountId, $userId, 'email', $userId, $hashedPassword]);
    echo "✓ Admin account created with password\n";
    
    $conn->commit();
    
    echo "\n";
    echo "Admin User Created Successfully!\n";
    echo "==============================\n";
    echo "Email: $adminEmail\n";
    echo "Password: $adminPassword\n";
    echo "User ID: $userId\n";
    echo "\nYou can now login at: https://yourdomain.com/login\n";
    echo "Admin panel: https://yourdomain.com/admin\n";
    
} catch (Exception $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    echo "✗ Error creating admin user: " . $e->getMessage() . "\n";
}
?>