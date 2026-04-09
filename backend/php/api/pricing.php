<?php
// backend/php/api/pricing.php
include_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    try {
        $stmt = $conn->prepare("SELECT id, space_type as spaceType, hourly_rate as hourlyRate, rate_2h as rate2h, rate_3h as rate3h, rate_4h_plus as rate4hPlus, daily_rate as dailyRate, monthly_rate as monthlyRate, features FROM pricing");
        $stmt->execute();
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Decode features JSON if it's a string
        foreach ($results as &$row) {
            if (isset($row['features']) && is_string($row['features'])) {
                $row['features'] = json_decode($row['features']);
            }
            // Ensure numeric values are floats
            $row['hourlyRate'] = (float)$row['hourlyRate'];
            $row['rate2h'] = $row['rate2h'] !== null ? (float)$row['rate2h'] : null;
            $row['rate3h'] = $row['rate3h'] !== null ? (float)$row['rate3h'] : null;
            $row['rate4hPlus'] = $row['rate4hPlus'] !== null ? (float)$row['rate4hPlus'] : null;
            $row['dailyRate'] = (float)$row['dailyRate'];
            $row['monthlyRate'] = (float)$row['monthlyRate'];
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
        $stmt = $conn->prepare("UPDATE pricing SET hourly_rate = ?, rate_2h = ?, rate_3h = ?, rate_4h_plus = ?, daily_rate = ?, monthly_rate = ? WHERE id = ?");
        $stmt->execute([
            $data['hourlyRate'],
            $data['rate2h'] ?? null,
            $data['rate3h'] ?? null,
            $data['rate4hPlus'] ?? null,
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
