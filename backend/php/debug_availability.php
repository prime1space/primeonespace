<?php
require_once 'db.php';

// 1. Setup Test Data
$spaceId = 1; // Assuming space 1 exists
$dateA = '2026-02-01';
$dateB = '2026-02-02';
$timeStart = '09:00:00';
$timeEnd = '10:00:00';
$seat = 'T1'; // Test seat

// Get valid user
$userStmt = $conn->query("SELECT id FROM user LIMIT 1");
$user = $userStmt->fetch(PDO::FETCH_ASSOC);
if (!$user) die("No users found to test with.");
$userId = $user['id'];

// Cleanup Previous Tests (Careful: this deletes bookings for this real user if I hardcode)
// I will use a specific seat + date to identify test booking instead of User ID for cleanup
$conn->prepare("DELETE FROM bookings WHERE seat_number = 'T1' AND booking_date = ?")->execute([$dateA]);

// Insert Booking on Date A
$stmt = $conn->prepare("INSERT INTO bookings (user_id, space_id, booking_date, start_time, end_time, seat_number, booking_status, duration_type, total_amount, created_at) VALUES (?, ?, ?, ?, ?, ?, 'confirmed', 'hourly', 0.0, NOW())");
$stmt->execute([$userId, $spaceId, $dateA, $timeStart, $timeEnd, $seat]);

echo "Inserted Booking on $dateA $timeStart for Seat $seat\n";

// 2. Check Availability on Date A (Should be Occupied)
echo "Checking Date A ($dateA)...\n";
checkConflict($conn, $spaceId, $dateA, $timeStart, $timeEnd);

// 3. Check Availability on Date B (Should be Free)
echo "Checking Date B ($dateB)...\n";
checkConflict($conn, $spaceId, $dateB, $timeStart, $timeEnd);

// Cleanup
$conn->prepare("DELETE FROM bookings WHERE user_id = 99999")->execute();

function checkConflict($conn, $spaceId, $date, $startTime, $endTime) {
    echo "Querying: Date=$date, Start=$startTime, End=$endTime\n";
    $stmt = $conn->prepare("SELECT seat_number, booking_date FROM bookings 
                            WHERE space_id = ? AND booking_date = ? 
                            AND (booking_status = 'confirmed' OR booking_status = 'pending')
                            AND (? < ADDTIME(end_time, '00:30:00') AND ? > start_time)");
    $stmt->execute([$spaceId, $date, $startTime, $endTime]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if (count($results) > 0) {
        echo "RESULT: CONFLICT FOUND! (Rows: " . count($results) . ")\n";
        foreach($results as $r) {
            echo " - Overlap with: " . $r['booking_date'] . " Seat: " . $r['seat_number'] . "\n";
        }
    } else {
        echo "RESULT: NO CONFLICT (Available)\n";
    }
    echo "-------------------\n";
}
?>
