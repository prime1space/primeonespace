<?php
// Generate correct password hash for Admin@123
$password = 'Admin@123';
$hash = password_hash($password, PASSWORD_BCRYPT);

echo "Password: $password\n";
echo "Generated Hash: $hash\n\n";

// Test the hash
if (password_verify($password, $hash)) {
    echo "✓ Hash verification: SUCCESS\n";
} else {
    echo "✗ Hash verification: FAILED\n";
}

echo "\nSQL to run in phpMyAdmin:\n";
echo "UPDATE account SET password = '$hash' WHERE user_id = (SELECT id FROM user WHERE email = 'prime1@gmail.com');\n";
?>