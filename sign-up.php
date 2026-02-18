<?php
// CORS headers
$origin = 'https://house.primeone.lk';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, set-auth-token");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection
$host = 'localhost';
$db_name = 'primeonelk_user_coworking';
$username = 'primeonelk_user_coworking';
$password = 'Qw!S_RC0,C9U0nIA';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("set names utf8");
} catch(PDOException $exception) {
    echo json_encode(["error" => "Connection error: " . $exception->getMessage()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = $input['email'];
    $name = $input['name'];
    $password = password_hash($input['password'], PASSWORD_DEFAULT);
    
    try {
        // Check if user exists
        $stmt = $conn->prepare("SELECT id FROM user WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            echo json_encode(['error' => 'User already exists']);
            exit;
        }
        
        // Create user
        $userId = uniqid();
        $stmt = $conn->prepare("INSERT INTO user (id, name, email, email_verified, created_at, updated_at) VALUES (?, ?, ?, 0, NOW(), NOW())");
        $stmt->execute([$userId, $name, $email]);
        
        echo json_encode(['success' => true, 'user' => ['id' => $userId, 'email' => $email, 'name' => $name]]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>