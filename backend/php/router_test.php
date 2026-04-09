<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

if (strpos($uri, '/api/bookings') !== false) {
    require __DIR__ . '/api/bookings.php';
} else {
    http_response_code(404);
    echo json_encode(['error' => 'Not found test']);
}
?>
