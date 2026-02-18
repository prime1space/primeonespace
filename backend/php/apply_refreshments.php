<?php
// backend/php/apply_refreshments.php
include_once __DIR__ . '/db.php';

echo "Updating database to include Refreshments table...\n";

$sql = file_get_contents(__DIR__ . '/add_refreshments.sql');

try {
    $conn->exec($sql);
    echo "Refreshments tables created and data inserted successfully.\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
