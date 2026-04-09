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
        // Build the update query dynamically
        $allowedFields = ['name', 'phone', 'nic_passport', 'address', 'country', 'date_of_birth', 'gender', 'emergency_contact_name', 'emergency_contact_phone', 'image'];
        $updates = [];
        $params = [];
        
        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                $updates[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        
        if (!empty($updates)) {
            $params[] = $userId;
            $setClause = implode(', ', $updates);
            $stmt = $conn->prepare("UPDATE user SET $setClause WHERE id = ?");
            $stmt->execute($params);
        }

        // If password update requested
        if (isset($data['new_password']) && !empty($data['new_password'])) {
            $newPass = password_hash($data['new_password'], PASSWORD_BCRYPT);
            $stmt = $conn->prepare("UPDATE account SET password = ? WHERE user_id = ? AND provider_id = 'email'");
            $stmt->execute([$newPass, $userId]);
        }

        echo json_encode(["status" => true, "message" => "Profile updated successfully"]);
    } catch (PDOException $e) {
        file_put_contents(__DIR__ . "/error.log", $e->getMessage() . "\n", FILE_APPEND);
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
