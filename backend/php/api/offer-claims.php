<?php
// backend/php/api/offer-claims.php
include_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Optional: Link to user account if logged in
    $userId = getUserId($conn);

    // Validation
    if (!isset($data['offerId']) || !isset($data['name']) || !isset($data['email']) || !isset($data['phone'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing required fields"]);
        exit();
    }

    try {
        // Check if already claimed? Maybe limit 1 per email/user per offer?
        // For now, let's allow multiple or check duplicates.
        // Let's check duplicates by email for this offer.
        $stmt = $conn->prepare("SELECT id FROM offer_claims WHERE offer_id = ? AND email = ?");
        $stmt->execute([$data['offerId'], $data['email']]);
        if ($stmt->fetch()) {
             // Already claimed. Return success anyway to avoid leaking info? 
             // Or tell them "You have already claimed this offer".
             // Let's be helpful.
             http_response_code(409); // Conflict
             echo json_encode(["error" => "You have already claimed this offer."]);
             exit();
        }

        $stmt = $conn->prepare("INSERT INTO offer_claims (offer_id, user_id, name, email, phone, created_at) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['offerId'],
            $userId, 
            $data['name'], 
            $data['email'], 
            $data['phone'],
            date('Y-m-d H:i:s')
        ]);
        
        echo json_encode(["success" => true, "message" => "Offer claimed successfully! We will contact you soon."]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
