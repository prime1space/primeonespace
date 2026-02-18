<?php
include_once '../db.php';

try {
    $stmt = $conn->query("SELECT email, name, created_at FROM user ORDER BY created_at DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Total Users found in database '" . $db_name . "': " . count($users) . "\n";
    foreach ($users as $user) {
        echo "- " . $user['email'] . " (" . $user['name'] . ") registered at " . $user['created_at'] . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
