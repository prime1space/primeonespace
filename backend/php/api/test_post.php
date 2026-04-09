<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../db.php';
$conn = getDBConnection();

$columnsCheck = $conn->query("SHOW COLUMNS FROM bookings");
$columns = $columnsCheck->fetchAll(PDO::FETCH_COLUMN);

print_r($columns);

?>
