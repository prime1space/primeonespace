<?php
// backend/php/api/spaces.php
include_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    try {
        $stmt = $conn->prepare("SELECT s.*, p.hourly_rate, p.daily_rate, p.monthly_rate, p.features FROM spaces s LEFT JOIN pricing p ON s.type = p.space_type");
        $stmt->execute();
        $allSpaces = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $enrichedSpaces = array_map(function($space) {
            return [
                'id' => $space['id'],
                'name' => $space['name'],
                'type' => $space['type'],
                'capacity' => $space['capacity'],
                'amenities' => is_string($space['amenities']) ? json_decode($space['amenities']) : $space['amenities'],
                'imageUrl' => $space['image_url'],
                'description' => $space['description'],
                'available' => (bool)$space['available'],
                'pricing' => $space['hourly_rate'] !== null ? [
                    'hourlyRate' => (float)$space['hourly_rate'],
                    'dailyRate' => (float)$space['daily_rate'],
                    'monthlyRate' => $space['monthly_rate'] !== null ? (float)$space['monthly_rate'] : null,
                    'features' => is_string($space['features']) ? json_decode($space['features']) : $space['features']
                ] : null
            ];
        }, $allSpaces);

        echo json_encode($enrichedSpaces);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} 
else if ($method == 'POST' || $method == 'PUT') {
    if (!checkAdmin($conn)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"), true);
    
    try {
        $conn->beginTransaction();

        $amenities = is_array($data['amenities']) ? json_encode($data['amenities']) : $data['amenities'];
        $available = isset($data['available']) ? $data['available'] : true;

        if ($method == 'POST') {
            $stmt = $conn->prepare("INSERT INTO spaces (name, type, capacity, amenities, image_url, description, available) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'], $data['type'], $data['capacity'], $amenities,
                $data['imageUrl'], $data['description'], $available
            ]);
            $spaceId = $conn->lastInsertId();
        } else {
            $stmt = $conn->prepare("UPDATE spaces SET name = ?, type = ?, capacity = ?, amenities = ?, image_url = ?, description = ?, available = ? WHERE id = ?");
            $stmt->execute([
                $data['name'], $data['type'], $data['capacity'], $amenities,
                $data['imageUrl'], $data['description'], $available, $data['id']
            ]);
            $spaceId = $data['id'];
        }
        
        // Upsert pricing
        if (isset($data['hourlyRate'])) {
            $pricingFeatures = is_array($data['pricingFeatures']) ? json_encode($data['pricingFeatures']) : (isset($data['amenities']) ? $amenities : '[]');
            $stmt = $conn->prepare("INSERT INTO pricing (space_type, hourly_rate, daily_rate, monthly_rate, features) 
                                    VALUES (?, ?, ?, ?, ?) 
                                    ON DUPLICATE KEY UPDATE hourly_rate = VALUES(hourly_rate), daily_rate = VALUES(daily_rate), monthly_rate = VALUES(monthly_rate), features = VALUES(features)");
            $stmt->execute([
                $data['type'], $data['hourlyRate'], $data['dailyRate'], $data['monthlyRate'], $pricingFeatures
            ]);
        }

        $conn->commit();
        echo json_encode(["id" => $spaceId]);
    } catch (PDOException $e) {
        if ($conn->inTransaction()) $conn->rollBack();
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
else if ($method == 'DELETE') {
    if (!checkAdmin($conn)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }

    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => "Missing id"]);
        exit();
    }

    try {
        $stmt = $conn->prepare("DELETE FROM spaces WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
