<?php
ini_set('display_errors', 1);
require_once __DIR__.'/db.php';
// get a user
$stmt = $conn->query("SELECT id FROM user LIMIT 1");
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user) die("No user");
$userId = $user['id'];

// Mock query
try {
        $stmt = $conn->prepare("UPDATE user SET name = ?, phone = ?, nic_passport = ?, address = ?, country = ?, date_of_birth = ?, gender = ?, emergency_contact_name = ?, emergency_contact_phone = ?, image = ? WHERE id = ?");
        $stmt->execute([
            'Test Name', 
            null, 
            null, 
            null, 
            'Sri Lanka',
            null, 
            null, 
            null, 
            null, 
            null,
            $userId
        ]);
        echo "Success";
} catch (Exception $e) {
        echo "Error: " . $e->getMessage();
}
