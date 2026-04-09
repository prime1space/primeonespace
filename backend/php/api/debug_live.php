<?php
// debug_live.php — Upload to cPanel and access via browser to diagnose issues
// DELETE THIS FILE after fixing!
header('Content-Type: text/plain; charset=UTF-8');

echo "=== PrimeOne Space — Live Server Diagnostic ===\n";
echo "Time: " . date('Y-m-d H:i:s') . "\n";
echo "PHP Version: " . PHP_VERSION . "\n\n";

// --- 1. Find and load .env ---
echo "--- 1. Finding .env file ---\n";
$envPaths = [
    __DIR__ . '/.env',
    __DIR__ . '/../.env',
    __DIR__ . '/../../.env',
];
$envFound = false;
foreach ($envPaths as $path) {
    $realPath = realpath($path);
    echo "Checking: $path => " . ($realPath ?: 'NOT FOUND') . "\n";
    if ($realPath && file_exists($realPath)) {
        echo "✅ Found .env at: $realPath\n";
        $envFound = true;
        $envDir = dirname($realPath);
        break;
    }
}
if (!$envFound) {
    echo "❌ .env NOT FOUND in any expected location!\n";
    echo "   Upload the .env file to the same folder as your PHP files.\n\n";
}

// --- 2. Load autoload + dotenv ---
echo "\n--- 2. Loading vendor/autoload.php ---\n";
$autoloadPaths = [
    __DIR__ . '/vendor/autoload.php',
    __DIR__ . '/../vendor/autoload.php',
];
$autoloaded = false;
foreach ($autoloadPaths as $path) {
    if (file_exists($path)) {
        require_once $path;
        echo "✅ Autoload loaded from: $path\n";
        $autoloaded = true;
        break;
    }
}
if (!$autoloaded) {
    echo "❌ vendor/autoload.php NOT FOUND!\n";
    echo "   The vendor/ folder is missing. Did you upload it?\n\n";
}

if ($autoloaded && $envFound) {
    $dotenv = Dotenv\Dotenv::createImmutable($envDir);
    $dotenv->safeLoad();
    echo "✅ .env loaded\n";
}

// --- 3. Print ENV variables ---
echo "\n--- 3. Environment Variables ---\n";
$vars = ['DB_HOST','DB_PORT','DB_NAME','DB_USER','DB_PASS','SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','APP_URL'];
foreach ($vars as $var) {
    $val = $_ENV[$var] ?? '(NOT SET)';
    // Mask passwords
    if (str_contains(strtolower($var), 'pass') || str_contains(strtolower($var), 'secret')) {
        $val = empty($val) || $val === '(NOT SET)' ? '(NOT SET ❌)' : str_repeat('*', strlen($val)) . ' ✅';
    }
    echo "$var = $val\n";
}

// --- 4. Test DB connection ---
echo "\n--- 4. Database Connection Test ---\n";
$host     = $_ENV['DB_HOST'] ?? 'localhost';
$port     = $_ENV['DB_PORT'] ?? '3306';
$dbName   = $_ENV['DB_NAME'] ?? '';
$dbUser   = $_ENV['DB_USER'] ?? '';
$dbPass   = $_ENV['DB_PASS'] ?? '';

echo "Connecting to MySQL: $dbUser@$host:$port / $dbName\n";
try {
    $dsn  = "mysql:host=$host;port=$port;dbname=$dbName;charset=utf8mb4";
    $conn = new PDO($dsn, $dbUser, $dbPass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Database connection SUCCESSFUL!\n";

    // List tables
    $tables = $conn->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo "\nTables found (" . count($tables) . "):\n";
    if (empty($tables)) {
        echo "  ❌ NO TABLES FOUND — you need to import your SQL file!\n";
        echo "  Go to: cPanel → phpMyAdmin → select '$dbName' → Import → upload primeone_database_export.sql\n";
    } else {
        foreach ($tables as $t) {
            $count = $conn->query("SELECT COUNT(*) FROM `$t`")->fetchColumn();
            echo "  ✅ $t ($count rows)\n";
        }
    }
} catch (PDOException $e) {
    echo "❌ DB Connection FAILED: " . $e->getMessage() . "\n\n";
    echo "Common fixes:\n";
    if (str_contains($e->getMessage(), 'Access denied')) {
        echo "  → Wrong DB_USER or DB_PASS in .env\n";
        echo "  → In cPanel: MySQL Databases → Add User to Database → give ALL PRIVILEGES\n";
    } elseif (str_contains($e->getMessage(), 'Unknown database')) {
        echo "  → DB_NAME '$dbName' does not exist on cPanel\n";
        echo "  → Check cPanel → MySQL Databases for the exact database name\n";
    } elseif (str_contains($e->getMessage(), "Can't connect")) {
        echo "  → DB_HOST is wrong. On cPanel it should be 'localhost'\n";
    }
}

// --- 5. Check file structure ---
echo "\n--- 5. File Structure Check ---\n";
$important = [
    __DIR__ . '/../.env'           => '.env',
    __DIR__ . '/../send_email.php' => 'send_email.php',
    __DIR__ . '/../db.php'         => 'db.php',
    __DIR__ . '/../vendor'         => 'vendor/ folder',
    __DIR__ . '/router.php'        => 'api/router.php',
    __DIR__ . '/bookings.php'      => 'api/bookings.php',
];
foreach ($important as $path => $label) {
    echo (file_exists($path) ? "✅" : "❌") . " $label\n";
}

echo "\n=== End of Diagnostic ===\n";
echo "⚠️  DELETE THIS FILE after reading the output!\n";
?>
