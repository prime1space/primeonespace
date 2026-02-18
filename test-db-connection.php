<?php
// Test database connection
$host = '127.0.0.1';
$port = '8889';
$db_name = 'primeonelk_user_coworking';
$username = 'root';
$password = 'root';
$dsn = "mysql:host=$host;port=$port;dbname=$db_name";

try {
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✓ Database connection successful!\n";
    
    // Test query
    $stmt = $conn->query("SELECT COUNT(*) as count FROM user");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "✓ Found {$result['count']} users in database\n";
    
    // Check for admin user
    $stmt = $conn->prepare("SELECT * FROM user WHERE email = ?");
    $stmt->execute(['prime1@gmail.com']);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo "✓ Admin user found: {$user['name']} ({$user['email']})\n";
    } else {
        echo "✗ Admin user NOT found!\n";
    }
    
} catch(PDOException $e) {
    echo "✗ Database connection FAILED: " . $e->getMessage() . "\n";
}
?>
