<?php
// backend/php/api/user_profile.php
include_once __DIR__ . '/../db.php';

$userId = getUserId($conn);
if (!$userId) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    try {
        $stmt = $conn->prepare("SELECT id, name, email, phone, nic_passport, address, country, date_of_birth, gender, emergency_contact_name, emergency_contact_phone, image FROM user WHERE id = ?");
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
        // Update user info
        $stmt = $conn->prepare("UPDATE user SET name = ?, phone = ?, nic_passport = ?, address = ?, country = ?, date_of_birth = ?, gender = ?, emergency_contact_name = ?, emergency_contact_phone = ?, image = ? WHERE id = ?");
        $stmt->execute([
            $data['name'], 
            $data['phone'] ?? null, 
            $data['nic_passport'] ?? null, 
            $data['address'] ?? null, 
            $data['country'] ?? 'Sri Lanka',
            $data['date_of_birth'] ?? null, 
            $data['gender'] ?? null, 
            $data['emergency_contact_name'] ?? null, 
            $data['emergency_contact_phone'] ?? null, 
            $data['image'] ?? null,
            $userId
        ]);

        // If password update requested
        if (isset($data['new_password']) && !empty($data['new_password'])) {
            $newPass = password_hash($data['new_password'], PASSWORD_BCRYPT);
            $stmt = $conn->prepare("UPDATE account SET password = ? WHERE user_id = ? AND provider_id = 'email'");
            $stmt->execute([$newPass, $userId]);
        }

        echo json_encode(["status" => true, "message" => "Profile updated successfully"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
