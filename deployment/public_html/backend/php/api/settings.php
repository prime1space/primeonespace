<?php
// backend/php/api/settings.php
include_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    try {
        $stmt = $conn->prepare("SELECT `key`, `value` FROM settings");
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $settings = [];
        foreach ($rows as $row) {
            $settings[$row['key']] = $row['value'];
        }
        
        echo json_encode($settings);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} 
else if ($method == 'POST') {
    if (!checkAdmin($conn)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"), true);
    
    try {
        $conn->beginTransaction();
        
        foreach ($data as $key => $value) {
            $stmt = $conn->prepare("INSERT INTO settings (`key`, `value`, updated_at) 
                                    VALUES (?, ?, ?) 
                                    ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), updated_at = VALUES(updated_at)");
            $stmt->execute([$key, $value, date('Y-m-d H:i:s')]);
        }
        
        $conn->commit();
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
