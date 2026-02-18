<?php
// Add sample spaces to database
include_once 'backend/php/db.php';

try {
    $conn->beginTransaction();
    
    // Check if spaces already exist
    $stmt = $conn->prepare("SELECT COUNT(*) FROM spaces");
    $stmt->execute();
    $count = $stmt->fetchColumn();
    
    if ($count == 0) {
        echo "Adding sample spaces...\n";
        
        // Add sample spaces
        $spaces = [
            [
                'name' => 'Hot Desk Area',
                'type' => 'hot_desk',
                'capacity' => 20,
                'amenities' => json_encode(['WiFi', 'Power Outlets', 'Shared Printer']),
                'image_url' => '/uploads/hot-desk.jpg',
                'description' => 'Flexible workspace for daily use',
                'available' => 1
            ],
            [
                'name' => 'Private Office 1',
                'type' => 'private_office',
                'capacity' => 4,
                'amenities' => json_encode(['WiFi', 'Phone', 'Whiteboard', 'AC']),
                'image_url' => '/uploads/private-office.jpg',
                'description' => 'Private office space for teams',
                'available' => 1
            ],
            [
                'name' => 'Meeting Room A',
                'type' => 'meeting_room',
                'capacity' => 8,
                'amenities' => json_encode(['WiFi', 'Projector', 'Whiteboard', 'AC']),
                'image_url' => '/uploads/meeting-room.jpg',
                'description' => 'Professional meeting room with AV equipment',
                'available' => 1
            ],
            [
                'name' => 'Conference Hall',
                'type' => 'conference_room',
                'capacity' => 50,
                'amenities' => json_encode(['WiFi', 'Sound System', 'Projector', 'AC', 'Catering']),
                'image_url' => '/uploads/conference-hall.jpg',
                'description' => 'Large conference hall for events',
                'available' => 1
            ]
        ];
        
        foreach ($spaces as $space) {
            $stmt = $conn->prepare("INSERT INTO spaces (name, type, capacity, amenities, image_url, description, available) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $space['name'],
                $space['type'],
                $space['capacity'],
                $space['amenities'],
                $space['image_url'],
                $space['description'],
                $space['available']
            ]);
            echo "Added: " . $space['name'] . "\n";
        }
        
        // Add pricing for each space type
        $pricing = [
            ['space_type' => 'hot_desk', 'hourly_rate' => 500, 'daily_rate' => 3000, 'monthly_rate' => 25000],
            ['space_type' => 'private_office', 'hourly_rate' => 1500, 'daily_rate' => 8000, 'monthly_rate' => 75000],
            ['space_type' => 'meeting_room', 'hourly_rate' => 2000, 'daily_rate' => 12000, 'monthly_rate' => null],
            ['space_type' => 'conference_room', 'hourly_rate' => 5000, 'daily_rate' => 30000, 'monthly_rate' => null]
        ];
        
        foreach ($pricing as $price) {
            $stmt = $conn->prepare("INSERT INTO pricing (space_type, hourly_rate, daily_rate, monthly_rate, features) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE hourly_rate = VALUES(hourly_rate), daily_rate = VALUES(daily_rate), monthly_rate = VALUES(monthly_rate)");
            $stmt->execute([
                $price['space_type'],
                $price['hourly_rate'],
                $price['daily_rate'],
                $price['monthly_rate'],
                json_encode(['Standard Features'])
            ]);
            echo "Added pricing for: " . $price['space_type'] . "\n";
        }
        
        $conn->commit();
        echo "Sample spaces and pricing added successfully!\n";
    } else {
        echo "Spaces already exist in database ($count spaces found)\n";
    }
    
} catch (PDOException $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
?>