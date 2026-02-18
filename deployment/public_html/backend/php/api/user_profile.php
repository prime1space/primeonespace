<?php
// backend/php/api/user_profile.php
include_once '../db.php';

$userId = getUserId($conn);
if (!$userId) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    try {
        $stmt = $conn->prepare("SELECT id, name, email, image FROM user WHERE id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode($user);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} else if ($method == 'POST' || $method == 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['name'])) {
        http_response_code(400);
        echo json_encode(["error" => "Name is required"]);
        exit();
    }
    
    try {
        $stmt = $conn->prepare("UPDATE user SET name = ? WHERE id = ?");
        $stmt->execute([$data['name'], $userId]);
        echo json_encode(["status" => true, "message" => "Profile updated successfully"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
