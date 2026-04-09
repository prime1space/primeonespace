<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../db.php';
$conn = getDBConnection();

$data = ['spaceId' => 2, 'bookingDate' => '2026-02-25', 'startTime' => '12:00:00', 'endTime' => '13:00:00', 'durationType' => 'hourly', 'totalAmount' => 1500, 'seatNumber' => 'A1', 'guestName' => 'Test User', 'guestPhone' => '12345678901', 'country' => 'Sri Lanka', 'nicPassport' => '123456789X'];
$userId = 1;

try {
    $columnsCheck = $conn->query("SHOW COLUMNS FROM bookings");
    $columns = $columnsCheck->fetchAll(PDO::FETCH_COLUMN);
    
    $hasGuestPhone = in_array('guest_phone', $columns);
    $hasSeatNumber = in_array('seat_number', $columns);
    $hasGuestName = in_array('guest_name', $columns);
    $hasNicPassport = in_array('nic_passport', $columns);
    $hasCountry = in_array('country', $columns);
    
    $insertColumns = "user_id, space_id, booking_date, start_time, end_time, duration_type, total_amount, payment_status, booking_status, created_at";
    $insertValues = "?, ?, ?, ?, ?, ?, ?, ?, ?, ?";
    $insertData = [
        $userId, $data['spaceId'], $data['bookingDate'], $data['startTime'], $data['endTime'],
        $data['durationType'], $data['totalAmount'], 'pending', 'pending', date('Y-m-d H:i:s')
    ];
    
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
    
    echo "Columns: $insertColumns\n";
    echo "Values: $insertValues\n";
    print_r($insertData);
    
    $stmt = $conn->prepare("INSERT INTO bookings ($insertColumns) VALUES ($insertValues)");
    $stmt->execute($insertData);
    $bookingId = $conn->lastInsertId();
    echo "Success! Booking ID: $bookingId\n";
    
    // delete it
    $conn->exec("DELETE FROM bookings WHERE id = $bookingId");
    
} catch (PDOException $e) {
    echo "Database error: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "General error: " . $e->getMessage() . "\n";
}
?>
