<?php
// Apply user details database changes
include_once 'backend/php/db.php';

try {
    // Read and execute the SQL file
    $sql = file_get_contents('add_user_details_fields.sql');
    
    if ($sql === false) {
        throw new Exception('Could not read SQL file');
    }
    
    $conn->exec($sql);
    echo "Database schema updated successfully!\n";
    echo "Added fields: phone, nic_passport, address, date_of_birth, gender, emergency_contact_name, emergency_contact_phone\n";
    
} catch (Exception $e) {
    echo "Error updating database: " . $e->getMessage() . "\n";
}
?>