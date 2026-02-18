<?php
// Generate password hash for Admin@123
$password = 'Admin@123';
$hash = password_hash($password, PASSWORD_BCRYPT);
echo "Password: $password\n";
echo "Hash: $hash\n";
?>