<?php
// router.php for PHP built-in server

// Global CORS Configuration — strict allowlist
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

$allowedOrigins = [
    // Production domains
    'https://primeone.space',
    'https://www.primeone.space',
    'https://house.primeone.lk',
    // Local development
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
];

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} elseif (preg_match('/^http:\/\/127\.0\.0\.1(:\d+)?$/', $origin) || preg_match('/^http:\/\/localhost(:\d+)?$/', $origin)) {
    // Allow any localhost port for dev convenience
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
}
// Unknown origins: no CORS headers set — request will be blocked by browser
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, set-auth-token");
header("Access-Control-Expose-Headers: set-auth-token");

// Handle Preflight OPTIONS request
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Require DB globally so $conn is available everywhere
require_once __DIR__ . '/../db.php';

$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

// 1. Static Files Check
$file = __DIR__ . $uri;
if (file_exists($file) && !is_dir($file)) {
    // Determine content type
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    $mimes = [
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'png' => 'image/png',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json'
    ];
    $contentType = isset($mimes[$ext]) ? $mimes[$ext] : 'application/octet-stream';
    
    header("Content-Type: $contentType");
    readfile($file);
    return;
}

// Normalize URI
// Remove script name if present (e.g. /router.php/foo -> /foo)
if (strpos($uri, $_SERVER['SCRIPT_NAME']) === 0) {
    $uri = substr($uri, strlen($_SERVER['SCRIPT_NAME']));
}
// Remove trailing slash unless root
if ($uri !== '/' && substr($uri, -1) === '/') {
    $uri = substr($uri, 0, -1);
}

// 2. Routing Map (exact matches)
$routes = [
    '/' => 'index.php',
    '/pricing' => 'pricing.php',
    '/announcements' => 'announcements.php',
    '/offers' => 'offers.php',
    '/spaces' => 'spaces.php',
    '/bookings' => 'bookings.php',
    '/testimonials' => 'testimonials.php',
    '/events' => 'events.php',
    '/event-registrations' => 'event-registrations.php',
    '/settings' => 'settings.php',
    '/user/profile' => 'user_profile.php',
    '/payhere/notify' => 'payhere_notify.php',
    '/upload' => 'upload.php',
    '/offer-claims' => 'offer-claims.php',
    '/occupied-seats' => 'occupied-seats.php',
    '/refreshments' => 'refreshments.php',
    '/send-receipt' => 'send_receipt.php',
    '/debug-db' => 'debug_db.php',
    '/create-payment-intent.php' => 'create-payment-intent.php',
    '/stripe-webhook.php' => 'stripe-webhook.php',
    '/contact-form' => 'contact.php',
];

if (isset($routes[$uri])) {
    require __DIR__ . '/' . $routes[$uri];
    return;
}

// 3. Prefix Matches
if (strpos($uri, '/auth/') === 0) {
    // When requiring auth.php, we need to make sure auth.php logic
    // sees the correct path if it parses URI. 
    // In this simple setup, auth.php likely looks at the URI too.
    require __DIR__ . '/auth.php';
    return;
}

// 4. Handle uploads (if logic is complex, otherwise static serve handled above)
// The .htaccess had ^uploads/(.*)$ uploads/$1. 
// If the file existed it was caught by step 1.

// 5. Default 404
http_response_code(404);
echo json_encode(['error' => 'Not Found', 'uri' => $uri]);

