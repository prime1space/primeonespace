<?php
ini_set('display_errors', 1);
$conn = new PDO('mysql:host=127.0.0.1;port=8889;dbname=primeonelk_user_coworking;charset=utf8mb4', 'root', 'root');
$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
try {
    $stmt = $conn->query("DESCRIBE user");
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    print_r($res);
} catch (Exception $e) {
    echo $e->getMessage();
}
