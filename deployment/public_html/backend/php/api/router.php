<?php
// backend/php/api/router.php

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = ltrim($uri, '/');

file_put_contents(__DIR__ . '/auth_debug.log', date('[Y-m-d H:i:s] ') . "Request: " . $_SERVER['REQUEST_METHOD'] . " /" . $uri . "\n", FILE_APPEND);

// Handle /api/ prefix if present
if (strpos($uri, 'api/') === 0) {
    $uri = substr($uri, 4);
}

// If the file exists physically, serve it
if ($uri && file_exists(__DIR__ . '/' . $uri)) {
    // Add CORS headers for static files too
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '*';
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
    
    // Set appropriate content type for images
    $ext = pathinfo($uri, PATHINFO_EXTENSION);
    $mimes = [
        'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png',
        'gif' => 'image/gif', 'webp' => 'image/webp', 'svg' => 'image/svg+xml'
    ];
    if (isset($mimes[$ext])) {
        header("Content-Type: " . $mimes[$ext]);
    }
    
    readfile(__DIR__ . '/' . $uri);
    exit;
}

// Route mapping
$routes = [
    'pricing' => 'pricing.php',
    'announcements' => 'announcements.php',
    'offers' => 'offers.php',
    'spaces' => 'spaces.php',
    'bookings' => 'bookings.php',
    'testimonials' => 'testimonials.php',
    'events' => 'events.php',
    'settings' => 'settings.php',
    'upload' => 'upload.php',
    'user/profile' => 'user_profile.php',
    'auth' => 'auth.php'
];

// Check for exact matches or prefix matches (for auth/...)
foreach ($routes as $path => $file) {
    if ($uri === $path || strpos($uri, $path . '/') === 0) {
        include $file;
        exit;
    }
}

// Fallback to index
include 'index.php';
?>
