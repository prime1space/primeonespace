<?php
// backend/php/api/bookings.php
include_once __DIR__ . '/../db.php';
include_once __DIR__ . '/../send_email.php';

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
        // Check if columns exist first
        $columnsCheck = $conn->query("SHOW COLUMNS FROM bookings");
        $columns = $columnsCheck->fetchAll(PDO::FETCH_COLUMN);
        $hasGuestPhone = in_array('guest_phone', $columns);
        $hasSeatNumber = in_array('seat_number', $columns);
        $hasCountry = in_array('country', $columns);
        
        $guestPhoneSelect = $hasGuestPhone ? 'b.guest_phone as guestPhone,' : 'NULL as guestPhone,';
        $countrySelect = $hasCountry ? 'b.country,' : "'Sri Lanka' as country,";
        $seatNumberSelect = $hasSeatNumber ? 'b.seat_number as seatNumber,' : 'NULL as seatNumber,';
        $guestNameSelect = in_array('guest_name', $columns) ? 'b.guest_name as guestName,' : 'NULL as guestName,';
        $nicPassportSelect = in_array('nic_passport', $columns) ? 'b.nic_passport as nicPassport,' : 'NULL as nicPassport,';
        
        if ($isAdmin && !isset($_GET['userId'])) {
            // Admin sees all
            $stmt = $conn->prepare("SELECT b.id, b.user_id as userId, b.space_id as spaceId, 
                                    b.booking_date as bookingDate, b.start_time as startTime, 
                                    b.end_time as endTime, b.duration_type as durationType, 
                                    b.total_amount as totalAmount, b.payment_status as paymentStatus, 
                                    b.booking_status as bookingStatus, b.created_at as createdAt, 
                                    $guestPhoneSelect $countrySelect $seatNumberSelect $guestNameSelect $nicPassportSelect
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
                                    $guestPhoneSelect $countrySelect $seatNumberSelect $guestNameSelect $nicPassportSelect
                                    s.name as spaceName, s.type as spaceType, s.image_url as spaceImage 
                                    FROM bookings b 
                                    LEFT JOIN spaces s ON b.space_id = s.id 
                                    WHERE b.user_id = ? 
                                    ORDER BY b.booking_date DESC, b.created_at DESC");
            $stmt->execute([$targetUserId]);
        }
        $bookings = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Fetch refreshments for these bookings
        // Optimization: Could collect IDs and do WHERE IN, but for now loop is simple
        foreach ($bookings as &$booking) {
            $refStmt = $conn->prepare("SELECT r.name, br.quantity, r.price 
                                       FROM booking_refreshments br 
                                       JOIN refreshments r ON br.refreshment_id = r.id 
                                       WHERE br.booking_id = ?");
            $refStmt->execute([$booking['id']]);
            $booking['refreshments'] = $refStmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($bookings);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
} 
else if ($method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Check conflicts
    try {
        // Check if seat_number column exists
        $columnsCheck = $conn->query("SHOW COLUMNS FROM bookings");
        $columns = $columnsCheck->fetchAll(PDO::FETCH_COLUMN);
        $hasSeatNumber = in_array('seat_number', $columns);
        
        // Improved Conflict Detection (Cross-Day Support)
        
        $reqDate = $data['bookingDate'];
        $prevDate = date('Y-m-d', strtotime($reqDate . ' -1 day'));
        
        // Fetch candidates from Today and Yesterday
        $stmt = $conn->prepare("SELECT seat_number, booking_date, start_time, end_time FROM bookings 
                                WHERE space_id = ? 
                                AND (booking_date = ? OR booking_date = ?)
                                AND (booking_status = 'confirmed' OR booking_status = 'pending')");
        $stmt->execute([$data['spaceId'], $reqDate, $prevDate]);
        $candidates = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Calculate Request Timestamp Range
        $reqStartTs = strtotime("$reqDate " . $data['startTime']);
        $reqEndTs = strtotime("$reqDate " . $data['endTime']);
        if ($reqEndTs <= $reqStartTs) $reqEndTs += 86400; // Next day
        
        $requestedSeats = isset($data['seatNumber']) ? explode(", ", $data['seatNumber']) : [];

        foreach ($candidates as $row) {
            // Calculate Row Timestamp Range
            $bStartTs = strtotime($row['booking_date'] . ' ' . $row['start_time']);
            $bEndTs = strtotime($row['booking_date'] . ' ' . $row['end_time']);
            if ($bEndTs <= $bStartTs) $bEndTs += 86400;
            $bEndTs += 1800; // 30 min Buffer

            // Check Time Overlap
            if ($reqStartTs < $bEndTs && $reqEndTs > $bStartTs) {
                // If specific seat conflict
                if ($hasSeatNumber && $row['seat_number']) {
                    $takenSeats = explode(", ", $row['seat_number']);
                    foreach ($requestedSeats as $rs) {
                        if (in_array($rs, $takenSeats)) {
                            http_response_code(409);
                            echo json_encode(["error" => "Seat $rs is not available"]);
                            exit();
                        }
                    }
                } 
                // If general conflict (no seat number columns or no seats specified, e.g. capacity based?)
                // Actually if `hasSeatNumber` is false, ANY overlap is a conflict?
                // The original code: If `!$hasSeatNumber`, check count > 0.
                // Assuming capacity=1 for general spaces? Or we should check capacity?
                // Original logic: "Time slot is not available". Implies capacity 1 or strictly sequential.
                else if (!$hasSeatNumber) {
                     http_response_code(409);
                     echo json_encode(["error" => "Time slot is not available"]);
                     exit();
                }
            }
        }

        // Build INSERT query based on available columns
        $hasGuestPhone = in_array('guest_phone', $columns);
        $hasSeatNumber = in_array('seat_number', $columns);
        $hasGuestName = in_array('guest_name', $columns);
        $hasNicPassport = in_array('nic_passport', $columns);
        $hasCountry = in_array('country', $columns);
        
        $paymentStatus = (isset($data['paymentMethod']) && $data['paymentMethod'] === 'card') ? 'paid' : 'pending';
        $bookingStatus = (isset($data['paymentMethod']) && $data['paymentMethod'] === 'card') ? 'confirmed' : 'pending';

        $insertColumns = "user_id, space_id, booking_date, start_time, end_time, duration_type, total_amount, payment_status, booking_status, created_at";
        $insertValues = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?";
        $insertData = [
            $userId, $data['spaceId'], $data['bookingDate'], $data['startTime'], $data['endTime'],
            $data['durationType'], $data['totalAmount'], $paymentStatus, $bookingStatus, date('Y-m-d H:i:s')
        ];

        // Ensure payment method is saved if column exists
        if (in_array('payment_method', $columns) && isset($data['paymentMethod'])) {
            $insertColumns .= ", payment_method";
            $insertValues .= ", ?";
            $insertData[] = $data['paymentMethod'];
        }
        
        if ($hasGuestPhone) {
            $insertColumns .= ", guest_phone";
            $insertValues .= ", ?";
            $insertData[] = isset($data['guestPhone']) ? $data['guestPhone'] : null;
        }

        if ($hasCountry) {
            $insertColumns .= ", country";
            $insertValues .= ", ?";
            $insertData[] = isset($data['country']) ? $data['country'] : 'Sri Lanka';
        }
        
        if ($hasSeatNumber) {
            $insertColumns .= ", seat_number";
            $insertValues .= ", ?";
            $insertData[] = isset($data['seatNumber']) ? $data['seatNumber'] : null;
        }

        if ($hasGuestName) {
            $insertColumns .= ", guest_name";
            $insertValues .= ", ?";
            $insertData[] = isset($data['guestName']) ? $data['guestName'] : null;
        }

        if ($hasNicPassport) {
            $insertColumns .= ", nic_passport";
            $insertValues .= ", ?";
            $insertData[] = isset($data['nicPassport']) ? $data['nicPassport'] : null;
        }
        
        $stmt = $conn->prepare("INSERT INTO bookings ($insertColumns) VALUES ($insertValues)");
        $stmt->execute($insertData);
        $bookingId = $conn->lastInsertId();

        // Handle Refreshments
        if (isset($data['refreshments']) && is_array($data['refreshments'])) {
            $refStmt = $conn->prepare("INSERT INTO booking_refreshments (booking_id, refreshment_id, quantity) VALUES (?, ?, ?)");
            foreach ($data['refreshments'] as $ref) {
                if (isset($ref['id']) && isset($ref['quantity']) && $ref['quantity'] > 0) {
                    $refStmt->execute([$bookingId, $ref['id'], $ref['quantity']]);
                }
            }
        }
        
        // Fetch User and Space details to send the confirmation email
        try {
            $userStmt = $conn->prepare("SELECT email, name FROM user WHERE id = ?");
            $userStmt->execute([$userId]);
            $userRow = $userStmt->fetch(PDO::FETCH_ASSOC);
            $userEmail = $userRow ? $userRow['email'] : null;
            $userName = $userRow ? $userRow['name'] : 'Valued Customer';

            $spaceStmt = $conn->prepare("SELECT name FROM spaces WHERE id = ?");
            $spaceStmt->execute([$data['spaceId']]);
            $spaceRow = $spaceStmt->fetch(PDO::FETCH_ASSOC);
            $spaceName = $spaceRow ? $spaceRow['name'] : 'PrimeOne Space';

            if ($userEmail) {
                $bookingDetails = [
                    'id' => $bookingId,
                    'space_name' => $spaceName,
                    'date' => $data['bookingDate'],
                    'start_time' => $data['startTime'],
                    'end_time' => $data['endTime'],
                    'total_price' => number_format((float)$data['totalAmount'], 2),
                    'guest_name' => $userName,
                    'duration' => $data['durationType'] ?? 'N/A'
                ];
                // Send email synchronously (or we could log the result if needed)
                sendBookingConfirmationEmail($userEmail, $bookingDetails);
            }
        } catch (Exception $emailEx) {
            // Log but don't fail the booking if email fails
            error_log("Failed to send booking confirmation email for booking $bookingId: " . $emailEx->getMessage());
        }

        echo json_encode(["id" => $bookingId]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
else if ($method == 'PUT') {
    $isAdmin = checkAdmin($conn);
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id']) || !isset($data['status'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing booking id or status"]);
        exit();
    }

    $bookingId = (int)$data['id'];
    $newStatus = $data['status'];

    // Users can cancel their own upcoming bookings; admins can do anything
    if (!$isAdmin) {
        // Only cancellation is allowed for regular users
        if ($newStatus !== 'cancelled') {
            http_response_code(403);
            echo json_encode(["error" => "Forbidden: You can only cancel your own bookings"]);
            exit();
        }

        // Verify this booking belongs to the logged-in user
        $ownerCheck = $conn->prepare("SELECT id, booking_date FROM bookings WHERE id = ? AND user_id = ?");
        $ownerCheck->execute([$bookingId, $userId]);
        $ownedBooking = $ownerCheck->fetch(PDO::FETCH_ASSOC);

        if (!$ownedBooking) {
            http_response_code(403);
            echo json_encode(["error" => "Forbidden: Booking not found or does not belong to you"]);
            exit();
        }

        // Prevent cancelling past bookings
        if (strtotime($ownedBooking['booking_date']) < strtotime('today')) {
            http_response_code(400);
            echo json_encode(["error" => "Cannot cancel a past booking"]);
            exit();
        }
    }

    try {
        $stmt = $conn->prepare("UPDATE bookings SET booking_status = ? WHERE id = ?");
        $stmt->execute([$newStatus, $bookingId]);
        echo json_encode(["status" => true, "message" => "Booking status updated"]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}
?>
