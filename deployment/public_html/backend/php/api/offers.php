<?php
// backend/php/api/offers.php
include_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

$isAdmin = checkAdmin($conn);

if ($method == 'GET') {
    try {
        $query = $isAdmin ? "SELECT * FROM offers ORDER BY created_at DESC" : "SELECT * FROM offers WHERE is_active = 1 ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $offers = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $enriched = array_map(function($o) {
            return [
                'id' => $o['id'],
                'title' => $o['title'],
                'description' => $o['description'],
                'code' => $o['code'],
                'discountPercentage' => $o['discount_percentage'],
                'imageUrl' => $o['image_url'],
                'validUntil' => $o['valid_until'],
                'isActive' => (bool)$o['is_active']
            ];
        }, $offers);
        
        echo json_encode($enriched);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
} 
else if ($method == 'POST') {
    if (!$isAdmin) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"), true);
    try {
        $stmt = $conn->prepare("INSERT INTO offers (title, description, code, discount_percentage, image_url, is_active, valid_until, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['description'],
            isset($data['code']) ? $data['code'] : null,
            isset($data['discountPercentage']) ? $data['discountPercentage'] : 0,
            isset($data['imageUrl']) ? $data['imageUrl'] : null,
            isset($data['isActive']) ? $data['isActive'] : 1,
            isset($data['validUntil']) ? $data['validUntil'] : null,
            date('Y-m-d H:i:s')
        ]);
        echo json_encode(["id" => $conn->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
else if ($method == 'DELETE') {
    if (!$isAdmin) {
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
        $stmt = $conn->prepare("DELETE FROM offers WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
