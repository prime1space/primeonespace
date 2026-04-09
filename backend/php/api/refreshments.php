<?php
// backend/php/api/refreshments.php
include_once __DIR__ . '/../db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$isAdmin = false;
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : (isset($headers['authorization']) ? $headers['authorization'] : null);
if ($authHeader) {
    if (function_exists('checkAdmin')) {
        $isAdmin = checkAdmin($conn);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        if ($isAdmin) {
            $stmt = $conn->query("SELECT * FROM refreshments ORDER BY category, id");
        } else {
            $stmt = $conn->query("SELECT * FROM refreshments WHERE is_available = 1 ORDER BY category, id");
        }
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    if (!checkAdmin($conn)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['id'])) {
        try {
            $stmt = $conn->prepare("UPDATE refreshments SET name = ?, category = ?, price = ?, image_url = ?, is_available = ? WHERE id = ?");
            $stmt->execute([
                $input['name'],
                $input['category'],
                $input['price'],
                $input['image_url'],
                isset($input['is_available']) ? $input['is_available'] : 1,
                $input['id']
            ]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        }
    } else {
        try {
            $stmt = $conn->prepare("INSERT INTO refreshments (name, category, price, image_url, is_available) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $input['name'],
                $input['category'],
                $input['price'],
                $input['image_url'],
                isset($input['is_available']) ? $input['is_available'] : 1
            ]);
            echo json_encode(["success" => true, "id" => $conn->lastInsertId()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!checkAdmin($conn)) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $_GET['id'] ?? ($input['id'] ?? null);

    if ($id) {
        try {
            $stmt = $conn->prepare("DELETE FROM refreshments WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(["success" => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["error" => "ID required"]);
    }
}
?>
