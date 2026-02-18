<?php
// backend/php/api/pricing.php
include_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    try {
        $stmt = $conn->prepare("SELECT id, space_type as spaceType, hourly_rate as hourlyRate, daily_rate as dailyRate, monthly_rate as monthlyRate, features FROM pricing");
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Decode features JSON if it's a string
        foreach ($results as &$row) {
            if (isset($row['features']) && is_string($row['features'])) {
                $row['features'] = json_decode($row['features']);
            }
        }
        
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} 
else if ($method == 'PUT') {
    if (!checkAdmin($conn)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "ID is required"]);
        exit();
    }

    try {
        $stmt = $conn->prepare("UPDATE pricing SET hourly_rate = ?, daily_rate = ?, monthly_rate = ? WHERE id = ?");
        $stmt->execute([
            $data['hourlyRate'],
            $data['dailyRate'],
            $data['monthlyRate'],
            $data['id']
        ]);
        
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
