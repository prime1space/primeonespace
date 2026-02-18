<?php
// backend/php/api/index.php
header("Content-Type: application/json");
echo json_encode([
    "message" => "Welcome to Prime One API",
    "status" => "online",
    "endpoints" => [
        "test" => "/test.php",
        "pricing" => "/pricing.php",
        "spaces" => "/spaces.php",
        "auth" => "/auth.php"
    ]
]);
?>
