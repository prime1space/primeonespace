<?php
ini_set('display_errors', 0);
// backend/php/db.php

// 1. Load Dependencies (Handle both Root and API scenarios)
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require_once __DIR__ . '/vendor/autoload.php';
} elseif (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
} else {
    // If no vendor, we can't load .env easily. Fallback or die.
    // For now, assume vendor exists in one of these spots
}

// 2. Load Environment Variables
if (class_exists('Dotenv\Dotenv')) {
    // Try current dir first
    if (file_exists(__DIR__ . '/.env')) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
        $dotenv->safeLoad();
    } 
    // Try parent dir if not found (e.g. if db.php is in api/)
    elseif (file_exists(__DIR__ . '/../.env')) {
        $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
        $dotenv->safeLoad();
    }
}

// 3. Handle CORS
$allowed_origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://primeone.space',
    'https://www.primeone.space'
];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Allow all localhost origins (any port) and production domains
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin) || 
    preg_match('/^http:\/\/127\.0\.0\.1(:\d+)?$/', $origin) || 
    in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Default to a specific origin if possible, otherwise * which breaks credentials
    // For safety with credentials, we shouldn't return * if we want credentials.
    // But if we don't match, the browser won't allow it anyway.
    if (!empty($origin)) {
        // Optional: Log rejected origin
    }
}
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 4. Database Connection
try {
    $host = $_ENV['DB_HOST'] ?? 'localhost';
    $db_name = $_ENV['DB_NAME'] ?? 'primeonespace_user_coworking';
    $username = $_ENV['DB_USER'] ?? 'primeonespace_api';
    $password = $_ENV['DB_PASS'] ?? ''; 

    $port = $_ENV['DB_PORT'] ?? '3306';
    $dsn = "mysql:host=$host;port=$port;dbname=$db_name;charset=utf8mb4";
    $conn = new PDO($dsn, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    error_log("DB Connection Error: " . $exception->getMessage());
    echo json_encode([
        "error" => "Database connection failed",
        "details" => $exception->getMessage(),
        "host" => $host,
        "db" => $db_name,
        "user" => $username
    ]);
    exit();
}


// 5. Define Helper Functions (Guarded to prevent re-declaration errors)
if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

if (!function_exists('checkAdmin')) {
    function checkAdmin($conn) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? ($headers['authorization'] ?? '');
        
        if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (empty($authHeader) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }

        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            $stmt = $conn->prepare("SELECT u.email FROM session s JOIN user u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > NOW()");
            $stmt->execute([$token]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user && $user['email'] === 'prime1@gmail.com') return true;
        }
        return false;
    }
}

if (!function_exists('getUserId')) {
    function getUserId($conn) {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? ($headers['authorization'] ?? '');
        
        if (empty($authHeader) && isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
        } elseif (empty($authHeader) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
        }
        
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
            $stmt = $conn->prepare("SELECT user_id, expires_at FROM session WHERE token = ?");
            $stmt->execute([$token]);
            $session = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($session && strtotime($session['expires_at']) > time()) return $session['user_id'];
        }
        return null;
    }
}

