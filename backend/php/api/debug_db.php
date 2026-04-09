<?php
// backend/php/api/debug_db.php
require_once __DIR__ . '/../db.php';

echo json_encode([
    'env' => [
        'DB_HOST' => $_ENV['DB_HOST'] ?? 'NOT SET',
        'DB_PORT' => $_ENV['DB_PORT'] ?? 'NOT SET',
        'DB_NAME' => $_ENV['DB_NAME'] ?? 'NOT SET',
        'DB_USER' => $_ENV['DB_USER'] ?? 'NOT SET',
        'DB_PASS' => isset($_ENV['DB_PASS']) ? 'REDACTED' : 'NOT SET',
    ],
    'server_cwd' => getcwd(),
    'dotenv_class_exists' => class_exists('Dotenv\Dotenv'),
    'env_file_exists' => file_exists(__DIR__ . '/../.env'),
    'vendor_autoload_exists' => file_exists(__DIR__ . '/../vendor/autoload.php')
]);
