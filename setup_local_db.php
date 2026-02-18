<?php
// Local WAMP database setup
$host = 'localhost';
$db_name = 'coworking_space';
$username = 'root';
$password = '';

try {
    // Connect to MySQL server
    $conn = new PDO("mysql:host=$host", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if not exists
    $conn->exec("CREATE DATABASE IF NOT EXISTS $db_name");
    echo "Database '$db_name' created or already exists.\n";
    
    // Connect to the specific database
    $conn = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create tables
    $sql = "
    CREATE TABLE IF NOT EXISTS user (
        id VARCHAR(191) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(191) UNIQUE NOT NULL,
        email_verified BOOLEAN DEFAULT FALSE,
        image VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS account (
        id VARCHAR(191) PRIMARY KEY,
        account_id VARCHAR(191) NOT NULL,
        provider_id VARCHAR(100) NOT NULL,
        user_id VARCHAR(191) NOT NULL,
        password VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS session (
        id VARCHAR(191) PRIMARY KEY,
        token VARCHAR(191) UNIQUE NOT NULL,
        user_id VARCHAR(191) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS spaces (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        capacity INT NOT NULL,
        amenities JSON,
        image_url VARCHAR(500),
        description TEXT,
        available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pricing (
        id INT AUTO_INCREMENT PRIMARY KEY,
        space_type VARCHAR(100) UNIQUE NOT NULL,
        hourly_rate DECIMAL(10,2),
        daily_rate DECIMAL(10,2),
        monthly_rate DECIMAL(10,2),
        features JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(191) NOT NULL,
        space_id INT NOT NULL,
        booking_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        duration_type ENUM('hourly', 'daily', 'monthly') NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'cash',
        payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
        booking_status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
        guest_phone VARCHAR(20),
        seat_number VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
    );
    ";
    
    $conn->exec($sql);
    echo "Tables created successfully.\n";
    
    // Insert admin user
    $adminEmail = 'prime1@gmail.com';
    $adminPassword = password_hash('Admin@123', PASSWORD_BCRYPT);
    $adminId = 'admin_' . bin2hex(random_bytes(8));
    
    $stmt = $conn->prepare("SELECT id FROM user WHERE email = ?");
    $stmt->execute([$adminEmail]);
    
    if (!$stmt->fetch()) {
        $stmt = $conn->prepare("INSERT INTO user (id, name, email, email_verified) VALUES (?, ?, ?, 1)");
        $stmt->execute([$adminId, 'Admin User', $adminEmail]);
        
        $accountId = 'account_' . bin2hex(random_bytes(8));
        $stmt = $conn->prepare("INSERT INTO account (id, account_id, provider_id, user_id, password) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$accountId, $adminId, 'email', $adminId, $adminPassword]);
        
        echo "Admin user created.\n";
    } else {
        echo "Admin user already exists.\n";
    }
    
    // Add sample spaces
    $stmt = $conn->prepare("SELECT COUNT(*) FROM spaces");
    $stmt->execute();
    $count = $stmt->fetchColumn();
    
    if ($count == 0) {
        $spaces = [
            [
                'name' => 'Hot Desk Area',
                'type' => 'hot_desk',
                'capacity' => 20,
                'amenities' => json_encode(['WiFi', 'Power Outlets', 'Shared Printer']),
                'image_url' => 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500',
                'description' => 'Flexible workspace for daily use',
                'available' => 1
            ],
            [
                'name' => 'Private Office 1',
                'type' => 'private_office',
                'capacity' => 4,
                'amenities' => json_encode(['WiFi', 'Phone', 'Whiteboard', 'AC']),
                'image_url' => 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500',
                'description' => 'Private office space for teams',
                'available' => 1
            ],
            [
                'name' => 'Meeting Room A',
                'type' => 'meeting_room',
                'capacity' => 8,
                'amenities' => json_encode(['WiFi', 'Projector', 'Whiteboard', 'AC']),
                'image_url' => 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500',
                'description' => 'Professional meeting room with AV equipment',
                'available' => 1
            ],
            [
                'name' => 'Conference Hall',
                'type' => 'conference_room',
                'capacity' => 50,
                'amenities' => json_encode(['WiFi', 'Sound System', 'Projector', 'AC', 'Catering']),
                'image_url' => 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=500',
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
        }
        echo "Sample spaces added.\n";
        
        // Add pricing
        $pricing = [
            ['space_type' => 'hot_desk', 'hourly_rate' => 500, 'daily_rate' => 3000, 'monthly_rate' => 25000],
            ['space_type' => 'private_office', 'hourly_rate' => 1500, 'daily_rate' => 8000, 'monthly_rate' => 75000],
            ['space_type' => 'meeting_room', 'hourly_rate' => 2000, 'daily_rate' => 12000, 'monthly_rate' => null],
            ['space_type' => 'conference_room', 'hourly_rate' => 5000, 'daily_rate' => 30000, 'monthly_rate' => null]
        ];
        
        foreach ($pricing as $price) {
            $stmt = $conn->prepare("INSERT INTO pricing (space_type, hourly_rate, daily_rate, monthly_rate, features) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $price['space_type'],
                $price['hourly_rate'],
                $price['daily_rate'],
                $price['monthly_rate'],
                json_encode(['Standard Features'])
            ]);
        }
        echo "Pricing data added.\n";
    }
    
    echo "Local database setup completed successfully!\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>