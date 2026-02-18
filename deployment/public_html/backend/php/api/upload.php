<?php
// backend/php/api/upload.php
include_once '../db.php';
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

if ($fileError !== 0) {
    file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: File error code $fileError\n", FILE_APPEND);
    $msg = "Upload failed: ";
    if ($fileError == 1) $msg .= "File exceeds upload_max_filesize";
    else if ($fileError == 2) $msg .= "File exceeds MAX_FILE_SIZE";
    else $msg .= "Error code $fileError";
    
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
    if (!mkdir($uploadDir, 0777, true)) {
        file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: Failed to create dir $uploadDir\n", FILE_APPEND);
    }
}

$dest = $uploadDir . $newFileName;

if (move_uploaded_file($fileTmpName, $dest)) {
    file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: Success! Saved to $newFileName\n", FILE_APPEND);
    echo json_encode([
        "success" => true,
        "url" => "/api/uploads/" . $newFileName
    ]);
} else {
    file_put_contents($log_file, date('[Y-m-d H:i:s] ') . "Upload: Failed to move_uploaded_file to $dest\n", FILE_APPEND);
    http_response_code(500);
    echo json_encode(["error" => "Failed to move uploaded file"]);
}
