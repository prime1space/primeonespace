<?php
// backend/php/api/announcements.php
include_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];

$isAdmin = checkAdmin($conn);

if ($method == 'GET') {
    try {
        $query = $isAdmin ? "SELECT * FROM announcements ORDER BY created_at DESC" : "SELECT * FROM announcements WHERE is_active = 1 ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $announcements = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $enriched = array_map(function($a) {
            return [
                'id' => $a['id'],
                'title' => $a['title'],
                'content' => $a['content'],
                'isActive' => (bool)$a['is_active'],
                'createdAt' => $a['created_at']
            ];
        }, $announcements);
        
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
        $stmt = $conn->prepare("INSERT INTO announcements (title, content, is_active, created_at) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $data['title'],
            $data['content'],
            isset($data['isActive']) ? $data['isActive'] : 1,
            date('Y-m-d H:i:s')
        ]);
        echo json_encode(["success" => true, "id" => $conn->lastInsertId()]);
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
        $stmt = $conn->prepare("DELETE FROM announcements WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>
