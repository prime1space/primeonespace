<?php
// backend/php/api/event-registrations.php
include_once __DIR__ . '/../db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $userId = getUserId($conn);
    
    if (!$userId) {
        http_response_code(401);
        echo json_encode(["error" => "Unauthorized"]);
        exit();
    }

    try {
        // Check if already registered
        $stmt = $conn->prepare("SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?");
        $stmt->execute([$data['eventId'], $userId]);
        if ($stmt->fetch()) {
            http_response_code(400);
            echo json_encode(["error" => "Already registered for this event"]);
            exit();
        }

        // Update phone if provided
        if (isset($data['phone']) && !empty($data['phone'])) {
            $upd = $conn->prepare("UPDATE user SET phone = ? WHERE id = ?");
            $upd->execute([$data['phone'], $userId]);
        }

        // Register for event
        $stmt = $conn->prepare("INSERT INTO event_registrations (event_id, user_id, created_at) VALUES (?, ?, ?)");
        $stmt->execute([$data['eventId'], $userId, date('Y-m-d H:i:s')]);
        
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
else if ($method == 'GET') {
    $eventId = isset($_GET['eventId']) ? $_GET['eventId'] : null;
    $userId = getUserId($conn);
    
    if (!$eventId) {
        // If no eventId, return all events this user is registered for
        if (!$userId) {
            http_response_code(401);
            echo json_encode(["error" => "Unauthorized"]);
            exit();
        }

        try {
            $stmt = $conn->prepare("SELECT er.created_at, e.id as eventId, e.title, e.description, e.eventDate, e.imageUrl 
                                    FROM event_registrations er 
                                    JOIN events e ON er.event_id = e.id 
                                    WHERE er.user_id = ? 
                                    ORDER BY er.created_at DESC");
            $stmt->execute([$userId]);
            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($results);
            exit();
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => $e->getMessage()]);
            exit();
        }
    }

    try {
        if ($userId) {
            // Check if user is registered
            $stmt = $conn->prepare("SELECT id FROM event_registrations WHERE event_id = ? AND user_id = ?");
            $stmt->execute([$eventId, $userId]);
            $isRegistered = $stmt->fetch() ? true : false;

            // Admin check
            $uStmt = $conn->prepare("SELECT email FROM user WHERE id = ?");
            $uStmt->execute([$userId]);
            $u = $uStmt->fetch();
            $isAdmin = $u && ($u['email'] === 'prime1@gmail.com' || $u['email'] === 'hello@primeone.space');
        } else {
            $isRegistered = false;
            $isAdmin = false;
        }

        // Get registration count
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM event_registrations WHERE event_id = ?");
        $stmt->execute([$eventId]);
        $count = $stmt->fetch()['count'];

        $registrants = [];
        if ($isAdmin) {
            $rStmt = $conn->prepare("SELECT u.name, u.email, u.phone, er.created_at 
                                     FROM event_registrations er 
                                     JOIN user u ON er.user_id = u.id 
                                     WHERE er.event_id = ?");
            $rStmt->execute([$eventId]);
            $registrants = $rStmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode([
            "isRegistered" => $isRegistered,
            "registrationCount" => (int)$count,
            "registrants" => $registrants
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
}
?>