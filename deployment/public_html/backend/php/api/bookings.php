<?php
// backend/php/api/bookings.php
include_once '../db.php';

$method = $_SERVER['REQUEST_METHOD'];
$userId = getUserId($conn);

if (!$userId) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

if ($method == 'GET') {
    $isAdmin = checkAdmin($conn);
    $targetUserId = isset($_GET['userId']) && $isAdmin ? $_GET['userId'] : $userId;

    try {
        if ($isAdmin && !isset($_GET['userId'])) {
            // Admin sees all
            $stmt = $conn->prepare("SELECT b.id, b.user_id as userId, b.space_id as spaceId, 
                                    b.booking_date as bookingDate, b.start_time as startTime, 
                                    b.end_time as endTime, b.duration_type as durationType, 
                                    b.total_amount as totalAmount, b.payment_status as paymentStatus, 
                                    b.booking_status as bookingStatus, b.created_at as createdAt, 
                                    b.guest_phone as guestPhone, b.seat_number as seatNumber,
                                    s.name as spaceName, s.image_url as spaceImage, u.name as userName, u.email as userEmail 
                                    FROM bookings b 
                                    LEFT JOIN spaces s ON b.space_id = s.id 
                                    LEFT JOIN user u ON b.user_id = u.id 
                                    ORDER BY b.booking_date DESC, b.created_at DESC");
            $stmt->execute();
        } else {
            // User sees own
            $stmt = $conn->prepare("SELECT b.id, b.user_id as userId, b.space_id as spaceId, 
                                    b.booking_date as bookingDate, b.start_time as startTime, 
                                    b.end_time as endTime, b.duration_type as durationType, 
                                    b.total_amount as totalAmount, b.payment_status as paymentStatus, 
                                    b.booking_status as bookingStatus, b.created_at as createdAt, 
                                    b.guest_phone as guestPhone, b.seat_number as seatNumber,
                                    s.name as spaceName, s.type as spaceType, s.image_url as spaceImage 
                                    FROM bookings b 
                                    LEFT JOIN spaces s ON b.space_id = s.id 
                                    WHERE b.user_id = ? 
                                    ORDER BY b.booking_date DESC, b.created_at DESC");
            $stmt->execute([$targetUserId]);
        }
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} 
else if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Check conflicts
    try {
        $stmt = $conn->prepare("SELECT seat_number FROM bookings 
                                WHERE space_id = ? AND booking_date = ? 
                                AND (booking_status = 'confirmed' OR booking_status = 'pending')
                                AND ((start_time >= ? AND start_time < ?) 
                                     OR (end_time > ? AND end_time <= ?) 
                                     OR (start_time <= ? AND end_time >= ?))");
        $stmt->execute([
            $data['spaceId'], $data['bookingDate'],
            $data['startTime'], $data['endTime'],
            $data['startTime'], $data['endTime'],
            $data['startTime'], $data['endTime']
        ]);
        $overlaps = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $requestedSeats = isset($data['seatNumber']) ? explode(", ", $data['seatNumber']) : [];
        $isConflict = false;
        foreach ($overlaps as $overlap) {
            if (!$overlap['seat_number']) { $isConflict = true; break; }
            $takenSeats = explode(", ", $overlap['seat_number']);
            foreach ($requestedSeats as $rs) {
                if (in_array($rs, $takenSeats)) { $isConflict = true; break 2; }
            }
        }

        if ($isConflict) {
            http_response_code(409);
            echo json_encode(["error" => "One or more selected seats are not available"]);
            exit();
        }

        $stmt = $conn->prepare("INSERT INTO bookings (user_id, space_id, booking_date, start_time, end_time, duration_type, total_amount, guest_phone, seat_number, payment_status, booking_status, created_at) 
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $userId, $data['spaceId'], $data['bookingDate'], $data['startTime'], $data['endTime'],
            $data['durationType'], $data['totalAmount'], isset($data['guestPhone']) ? $data['guestPhone'] : null,
            isset($data['seatNumber']) ? $data['seatNumber'] : null, 'pending', 'pending', date('Y-m-d H:i:s')
        ]);
        
        echo json_encode(["id" => $conn->lastInsertId()]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
else if ($method == 'PUT') {
    $isAdmin = checkAdmin($conn);
    if (!$isAdmin) {
        http_response_code(403);
        echo json_encode(["error" => "Forbidden: Admin access required"]);
        exit();
    }

    $data = json_decode(file_get_contents("php://input"), true);
    if (!isset($data['id']) || !isset($data['status'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id or status"]);
        exit();
    }

    try {
        $stmt = $conn->prepare("UPDATE bookings SET booking_status = ? WHERE id = ?");
        $stmt->execute([$data['status'], $data['id']]);
        echo json_encode(["status" => true, "message" => "Booking status updated"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
?>
