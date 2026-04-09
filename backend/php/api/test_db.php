<?php
require_once __DIR__ . '/../db.php';
$conn = getDBConnection();
$stmt = $conn->query("SELECT * FROM bookings ORDER BY id DESC LIMIT 5");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>
