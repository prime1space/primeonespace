<?php
// Local WAMP database configuration
// Rename this file to db.php to use local database instead of production

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';

if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, set-auth-token");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Max-Age: 86400");
    http_response_code(200);
    exit();
}

header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, set-auth-token");
header("Access-Control-Expose-Headers: set-auth-token");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Local WAMP database credentials
$host = 'localhost';
$db_name = 'coo-working';  // Change this to your local database name
$username = 'root';        // Default WAMP username
$password = '';            // Default WAMP password (usually empty)

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("set names utf8");
} catch(PDOException $exception) {
    echo json_encode(["error" => "Connection error: " . $exception->getMessage()]);
    exit();
}

// Rest of the functions remain the same...
// [Include all the functions from the original db.php file]

// Fallback for getallheaders if not exists
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

function checkAdmin($conn) {
    $headers = getallheaders();
    $log_file = __DIR__ . '/api/auth_debug.log';
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');
    
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        $stmt = $conn->prepare("SELECT u.email FROM session s JOIN user u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > NOW()");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        $adminEmail = 'prime1@gmail.com';
        if ($user && $user['email'] === $adminEmail) {
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "checkAdmin: Success for " . $user['email'] . "\n", FILE_APPEND);
            return true;
        } else {
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "checkAdmin: Failed for token " . ($user ? $user['email'] : 'No User') . "\n", FILE_APPEND);
        }
    } else {
        file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "checkAdmin: No Bearer token found\n", FILE_APPEND);
    }
    return false;
}

function getUserId($conn) {
    $headers = getallheaders();
    $log_file = __DIR__ . '/api/auth_debug.log';
    
    // Check both cases
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : '');
    
    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Auth: Found token $token\n", FILE_APPEND);
        
        $stmt = $conn->prepare("SELECT user_id, expires_at FROM session WHERE token = ?");
        $stmt->execute([$token]);
        $session = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($session) {
            if (strtotime($session['expires_at']) > time()) {
                file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Auth: Session valid for user " . $session['user_id'] . "\n", FILE_APPEND);
                return $session['user_id'];
            } else {
                file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Auth: Session expired at " . $session['expires_at'] . "\n", FILE_APPEND);
            }
        } else {
            file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Auth: Session NOT found for token $token\n", FILE_APPEND);
        }
    } else {
        file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Auth: No Bearer token in header: $authHeader\n", FILE_APPEND);
    }
    return null;
}
?>