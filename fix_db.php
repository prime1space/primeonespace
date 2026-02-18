<?php
// Server database fix script
// Upload this to your server and run it once

$host = 'localhost';
$db_name = 'primeonelk_user_coworking';
$username = 'primeonelk_user_coworking';
$password = 'Qw!S_RC0,C9U0nIA';

try {
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<h2>Fixing Database Structure...</h2>";
    
    // Add guest_phone column
    try {
        $conn->exec("ALTER TABLE bookings ADD COLUMN guest_phone VARCHAR(20) DEFAULT NULL");
        echo "✅ Added guest_phone column<br>";
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'Duplicate column') !== false) {
            echo "✅ guest_phone column already exists<br>";
        } else {
            echo "❌ Error adding guest_phone: " . $e->getMessage() . "<br>";
        }
    }
    
    // Add seat_number column
    try {
        $conn->exec("ALTER TABLE bookings ADD COLUMN seat_number TEXT DEFAULT NULL");
        echo "✅ Added seat_number column<br>";
    } catch (Exception $e) {
        if (strpos($e->getMessage(), 'Duplicate column') !== false) {
            echo "✅ seat_number column already exists<br>";
        } else {
            echo "❌ Error adding seat_number: " . $e->getMessage() . "<br>";
        }
    }
    
    echo "<h3>✅ Database fix completed!</h3>";
    echo "<p><strong>IMPORTANT:</strong> Delete this file after running it for security.</p>";
    
} catch (PDOException $e) {
    echo "❌ Connection failed: " . $e->getMessage();
}
?>