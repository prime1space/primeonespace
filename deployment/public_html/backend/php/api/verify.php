<?php
$pass = "Admin@123";
$hash = '$2y$12$PLcDjkhx9M7HTXUTXrb4neYe77lljsyUIEj7ZbQc6kjPf/Sc7mtH6';
echo password_verify($pass, $hash) ? "VERIFIED" : "FAILED";
?>
