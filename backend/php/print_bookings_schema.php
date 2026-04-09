<?php
require_once __DIR__ . '/db.php';
$conn = getDBConnection();
$stmt = $conn->query("SHOW COLUMNS FROM bookings");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
