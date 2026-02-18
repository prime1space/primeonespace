<?php
// Test upload configuration
echo "Upload Configuration Test\n";
echo "========================\n";
echo "upload_max_filesize: " . ini_get('upload_max_filesize') . "\n";
echo "post_max_size: " . ini_get('post_max_size') . "\n";
echo "max_execution_time: " . ini_get('max_execution_time') . "\n";
echo "memory_limit: " . ini_get('memory_limit') . "\n";
echo "file_uploads: " . (ini_get('file_uploads') ? 'Enabled' : 'Disabled') . "\n";

$uploadDir = __DIR__ . '/uploads/';
echo "\nUpload Directory: $uploadDir\n";
echo "Directory exists: " . (is_dir($uploadDir) ? 'Yes' : 'No') . "\n";
echo "Directory writable: " . (is_writable($uploadDir) ? 'Yes' : 'No') . "\n";

if (!is_dir($uploadDir)) {
    echo "Creating upload directory...\n";
    if (mkdir($uploadDir, 0755, true)) {
        echo "Directory created successfully\n";
    } else {
        echo "Failed to create directory\n";
    }
}
?>