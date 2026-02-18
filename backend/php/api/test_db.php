<?php
// backend/php/api/test_db.php
header('Content-Type: application/json');

include_once __DIR__ . '/../db.php';

echo "Global conn check: " . (isset($conn) ? "Set" : "Not Set") . "\n";
if (isset($conn)) {
    echo "Is PDO? " . ($conn instanceof PDO ? "Yes" : "No") . "\n";
    try {
        $stmt = $conn->query("SELECT database() as db");
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "Connected to DB: " . $res['db'] . "\n";
    } catch(Exception $e) {
        echo "Query failed: " . $e->getMessage() . "\n";
    }
} else {
    echo "Try to connect manually...\n";
    try {
        $dsn = "mysql:host=127.0.0.1;port=8889;dbname=primeonelk_user_coworking";
        $c = new PDO($dsn, 'root', 'root');
        $c->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "Manual connection successful!\n";
    } catch(PDOException $e) {
        echo "Manual connection FAILED: " . $e->getMessage() . "\n";
    }
}
?>
