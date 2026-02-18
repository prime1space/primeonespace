<?php
// backend/php/api/upload.php
include_once __DIR__ . '/../db.php';
$log_file = __DIR__ . '/auth_debug.log';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

if (!checkAdmin($conn)) {
    file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: Admin check failed\n", FILE_APPEND);
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

if (!isset($_FILES['file'])) {
    if ($_SERVER['CONTENT_LENGTH'] > 0 && empty($_FILES)) {
        file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: POST size exceeded limit. Content-Length: " . $_SERVER['CONTENT_LENGTH'] . "\n", FILE_APPEND);
        http_response_code(413);
        echo json_encode(["error" => "File too large (exceeds server limit)"]);
        exit();
    }
    file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: No 'file' key in _FILES. Keys: " . implode(', ', array_keys($_FILES)) . "\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(["error" => "No file uploaded"]);
    exit();
}

$file = $_FILES['file'];
$fileName = $file['name'];
$fileTmpName = $file['tmp_name'];
$fileError = $file['error'];
$fileSize = $file['size'];

// Check file size (10MB limit)
$maxFileSize = 10 * 1024 * 1024; // 10MB in bytes
if ($fileSize > $maxFileSize) {
    file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: File too large - Size: $fileSize bytes, Max: $maxFileSize bytes\n", FILE_APPEND);
    http_response_code(413);
    echo json_encode(["error" => "File too large. Maximum size allowed is 10MB."]);
    exit();
}

if ($fileError !== 0) {
    file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: File error code $fileError\n", FILE_APPEND);
    $msg = "Upload failed: ";
    switch ($fileError) {
        case 1:
            $msg .= "File exceeds upload_max_filesize (" . ini_get('upload_max_filesize') . ")";
            break;
        case 2:
            $msg .= "File exceeds MAX_FILE_SIZE";
            break;
        case 3:
            $msg .= "File was only partially uploaded";
            break;
        case 4:
            $msg .= "No file was uploaded";
            break;
        case 6:
            $msg .= "Missing a temporary folder";
            break;
        case 7:
            $msg .= "Failed to write file to disk";
            break;
        case 8:
            $msg .= "A PHP extension stopped the file upload";
            break;
        default:
            $msg .= "Unknown error code $fileError";
    }
    
    http_response_code(400);
    echo json_encode(["error" => $msg]);
    exit();
}

$fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
$allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

if (!in_array($fileExt, $allowed)) {
    file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: Invalid extension $fileExt\n", FILE_APPEND);
    http_response_code(400);
    echo json_encode(["error" => "Invalid file type"]);
    exit();
}

$newFileName = uniqid('', true) . "." . $fileExt;
$uploadDir = __DIR__ . '/uploads/';

if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: Failed to create dir $uploadDir\n", FILE_APPEND);
        http_response_code(500);
        echo json_encode(["error" => "Failed to create upload directory"]);
        exit();
    }
}

// Check if directory is writable
if (!is_writable($uploadDir)) {
    file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: Directory not writable $uploadDir\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(["error" => "Upload directory is not writable"]);
    exit();
}

$dest = $uploadDir . $newFileName;

if (move_uploaded_file($fileTmpName, $dest)) {
    file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: Success! Saved to $newFileName\n", FILE_APPEND);
    echo json_encode([
        "success" => true,
        "url" => "/uploads/" . $newFileName
    ]);
} else {
    file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: Failed to move_uploaded_file to $dest\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(["error" => "Failed to move uploaded file"]);
}
