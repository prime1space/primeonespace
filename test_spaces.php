<?php
// Test spaces API
echo "Testing spaces API...\n";

$url = 'http://localhost/coworking-space-website-project-main%204/coworking-space-website-project-main%202/backend/php/api/spaces.php';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n";

if ($httpCode == 200) {
    $data = json_decode($response, true);
    if (is_array($data)) {
        echo "Found " . count($data) . " spaces:\n";
        foreach ($data as $space) {
            echo "- " . $space['name'] . " (Type: " . $space['type'] . ")\n";
        }
    }
} else {
    echo "Error: HTTP $httpCode\n";
}
?>