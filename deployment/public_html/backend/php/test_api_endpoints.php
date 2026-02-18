<?php
// Test all API endpoints
include_once 'db.php';

echo "Testing All API Endpoints\n";
echo "========================\n\n";

$endpoints = [
    'announcements' => 'announcements.php',
    'spaces' => 'spaces.php', 
    'offers' => 'offers.php',
    'events' => 'events.php',
    'pricing' => 'pricing.php',
    'settings' => 'settings.php'
];

foreach ($endpoints as $name => $file) {
    echo "Testing $name endpoint:\n";
    
    try {
        // Simulate GET request
        $_SERVER['REQUEST_METHOD'] = 'GET';
        
        ob_start();
        include $file;
        $output = ob_get_clean();
        
        $data = json_decode($output, true);
        
        if (json_last_error() === JSON_ERROR_NONE) {
            echo "✓ $name: Valid JSON response\n";
            echo "  Records: " . (is_array($data) ? count($data) : 'N/A') . "\n";
        } else {
            echo "✗ $name: Invalid JSON - " . json_last_error_msg() . "\n";
            echo "  Raw output: " . substr($output, 0, 100) . "...\n";
        }
        
    } catch (Exception $e) {
        echo "✗ $name: Error - " . $e->getMessage() . "\n";
    }
    
    echo "\n";
}

// Test database tables
echo "Database Table Status:\n";
echo "=====================\n";

$tables = ['announcements', 'spaces', 'offers', 'events', 'pricing', 'user', 'session', 'account'];

foreach ($tables as $table) {
    try {
        $stmt = $conn->query("SELECT COUNT(*) as count FROM $table");
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        echo "✓ $table: " . $result['count'] . " records\n";
    } catch (Exception $e) {
        echo "✗ $table: " . $e->getMessage() . "\n";
    }
}

echo "\nTest completed!\n";
?>