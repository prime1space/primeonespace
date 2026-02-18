<?php
// backend/php/api/refreshments.php
include_once __DIR__ . '/../db.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $conn->query("SELECT * FROM refreshments WHERE is_available = 1 ORDER BY category, id");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($results);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
?>
