<?php
// backend/php/api/spaces.php
include_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    try {
        $stmt = $conn->prepare("SELECT s.*, p.hourly_rate, p.rate_2h, p.rate_3h, p.rate_4h_plus, p.daily_rate, p.monthly_rate, p.features FROM spaces s LEFT JOIN pricing p ON s.type = p.space_type");
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
                    'rate2h' => $space['rate_2h'] !== null ? (float)$space['rate_2h'] : null,
                    'rate3h' => $space['rate_3h'] !== null ? (float)$space['rate_3h'] : null,
                    'rate4hPlus' => $space['rate_4h_plus'] !== null ? (float)$space['rate_4h_plus'] : null,
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
        // Explicitly cast to integer for TINYINT columns (0 or 1)
        $available = isset($data['available']) ? ((filter_var($data['available'], FILTER_VALIDATE_BOOLEAN)) ? 1 : 0) : 1;

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
        
        // Upsert pricing - Always update/insert pricing when space is saved
        $pricingFeatures = isset($data['pricingFeatures']) && is_array($data['pricingFeatures']) ? json_encode($data['pricingFeatures']) : (isset($data['amenities']) ? $amenities : '[]');
        
        $stmt = $conn->prepare("INSERT INTO pricing (space_type, hourly_rate, rate_2h, rate_3h, rate_4h_plus, daily_rate, monthly_rate, features) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
                                ON DUPLICATE KEY UPDATE hourly_rate = VALUES(hourly_rate), rate_2h = VALUES(rate_2h), rate_3h = VALUES(rate_3h), rate_4h_plus = VALUES(rate_4h_plus), daily_rate = VALUES(daily_rate), monthly_rate = VALUES(monthly_rate), features = VALUES(features)");
        $stmt->execute([
            $data['type'], 
            isset($data['hourlyRate']) ? $data['hourlyRate'] : 0.00, 
            isset($data['rate2h']) ? $data['rate2h'] : null,
            isset($data['rate3h']) ? $data['rate3h'] : null,
            isset($data['rate4hPlus']) ? $data['rate4hPlus'] : null,
            isset($data['dailyRate']) ? $data['dailyRate'] : 0.00,
            isset($data['monthlyRate']) ? $data['monthlyRate'] : 0.00, 
            $pricingFeatures
        ]);

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
        $conn->beginTransaction();

        // Optional: Delete related bookings first (Cascade Delete)
        $stmt = $conn->prepare("DELETE FROM bookings WHERE space_id = ?");
        $stmt->execute([$id]);

        $stmt = $conn->prepare("DELETE FROM spaces WHERE id = ?");
        $stmt->execute([$id]);
        
        $conn->commit();
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        if ($conn->inTransaction()) $conn->rollBack();
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
?>
