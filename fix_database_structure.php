<?php
// Fix bookings table structure
include_once 'backend/php/db.php';

try {
    echo "Checking and fixing bookings table structure...\n";
    
    // Check if guest_phone column exists
    $stmt = $conn->query("SHOW COLUMNS FROM bookings LIKE 'guest_phone'");
    if ($stmt->rowCount() == 0) {
        echo "Adding guest_phone column...\n";
        $conn->exec("ALTER TABLE bookings ADD COLUMN guest_phone VARCHAR(20) DEFAULT NULL");
        echo "✓ guest_phone column added successfully\n";
    } else {
        echo "✓ guest_phone column already exists\n";
    }
    
    // Check if seat_number column exists
    $stmt = $conn->query("SHOW COLUMNS FROM bookings LIKE 'seat_number'");
    if ($stmt->rowCount() == 0) {
        echo "Adding seat_number column...\n";
        $conn->exec("ALTER TABLE bookings ADD COLUMN seat_number TEXT DEFAULT NULL");
        echo "✓ seat_number column added successfully\n";
    } else {
        echo "✓ seat_number column already exists\n";
    }
    
    // Show final table structure
    echo "\nFinal bookings table structure:\n";
    $stmt = $conn->query("DESCRIBE bookings");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($columns as $column) {
        echo "- {$column['Field']} ({$column['Type']})\n";
    }
    
    echo "\n✅ Database structure fixed successfully!\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>