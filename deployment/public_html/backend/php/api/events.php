<?php
// backend/php/api/events.php
include_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

$isAdmin = checkAdmin($conn);

if ($method == 'GET') {
    try {
        $query = $isAdmin ? "SELECT * FROM events ORDER BY event_date ASC" : "SELECT * FROM events WHERE published = 1 ORDER BY event_date ASC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Handle camelCase for frontend
        $enriched = array_map(function($e) {
            return [
                'id' => $e['id'],
                'title' => $e['title'],
                'description' => $e['description'],
                'eventDate' => $e['event_date'],
                'imageUrl' => $e['image_url'],
                'published' => (bool)$e['published']
            ];
        }, $events);
        
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
        $stmt = $conn->prepare("INSERT INTO events (title, description, event_date, image_url, published, created_at) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['description'],
            $data['eventDate'],
            $data['imageUrl'],
            isset($data['published']) ? $data['published'] : 1,
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
        $stmt = $conn->prepare("DELETE FROM events WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
