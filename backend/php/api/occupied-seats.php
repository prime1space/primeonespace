<?php
include_once __DIR__ . '/../db.php';

$spaceId = isset($_GET['spaceId']) ? $_GET['spaceId'] : null;
$date = isset($_GET['date']) ? $_GET['date'] : null;
$startTime = isset($_GET['startTime']) ? $_GET['startTime'] : null;
$endTime = isset($_GET['endTime']) ? $_GET['endTime'] : null;

if (!$spaceId || !$date || !$startTime || !$endTime) {
    echo json_encode([]);
    exit();
}

try {
    // Fetch bookings for the requested date AND the previous day (to catch midnight crossovers)
    // We assume seat_number column exists; if not, logic simplifies (or fails, but frontend expects seats).
    
    // Calculate previous date
    $prevDate = date('Y-m-d', strtotime($date . ' -1 day'));

    $stmt = $conn->prepare("SELECT seat_number, booking_date, start_time, end_time FROM bookings 
                            WHERE space_id = ? 
                            AND (booking_date = ? OR booking_date = ?)
                            AND (booking_status = 'confirmed' OR booking_status = 'pending')");
    
    $stmt->execute([$spaceId, $date, $prevDate]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $occupied = [];
    
    // Request Interval (timestamp)
    $reqStartTs = strtotime("$date $startTime");
    $reqEndTs = strtotime("$date $endTime");
    // If endTime is smaller than startTime (meaning next day relative to date, e.g. 01:00 request for date), 
    // frontend usually sends correct date+time? 
    // Wait, the API params are `date`, `startTime`, `endTime`.
    // If request is "23:00" to "01:00", does frontend send specific date?
    // Frontend sends `date` (e.g. 2026-02-01). `startTime` (23:00). `endTime` (01:00).
    // If reqEnd < reqStart, we assume reqEnd is next day.
    if ($reqEndTs <= $reqStartTs) {
        $reqEndTs += 86400; // Add 24h
    }

    foreach ($results as $row) {
        if (!$row['seat_number']) continue;
        
        // Determine Row Booking Interval
        $bStartTs = strtotime($row['booking_date'] . ' ' . $row['start_time']);
        $bEndTs = strtotime($row['booking_date'] . ' ' . $row['end_time']);
        
        // Handle crossover (if stored end time is less than start time)
        if ($bEndTs <= $bStartTs) {
            $bEndTs += 86400;
        }

        // Add Buffer (30 mins)
        $bEndTs += 1800; 

        // Check Overlap: (StartA < EndB) && (EndA > StartB)
        if ($reqStartTs < $bEndTs && $reqEndTs > $bStartTs) {
            $seats = explode(", ", $row['seat_number']);
            $occupied = array_merge($occupied, $seats);
        }
    }
    
    echo json_encode(array_values(array_unique($occupied)));

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
