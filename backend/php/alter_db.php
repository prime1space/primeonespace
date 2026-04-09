<?php
ini_set('display_errors', 1);
$conn = new PDO('mysql:host=127.0.0.1;port=8889;dbname=primeonelk_user_coworking;charset=utf8mb4', 'root', 'root');
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
try {
    $conn->exec("ALTER TABLE user MODIFY COLUMN image LONGTEXT");
    echo "Column modified successfully\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
