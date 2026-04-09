<?php
// backend/php/api/test_email.php
// DIAGNOSTIC SCRIPT — DELETE after fixing.

header('Content-Type: text/plain');

$rootDir = __DIR__ . '/..';
require_once $rootDir . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable($rootDir);
$dotenv->safeLoad();

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

echo "=== PrimeOne Space — Email SMTP Finder ===\n\n";

$smtpUser = $_ENV['SMTP_USER'] ?? 'hello@primeone.space';
$smtpPass = $_ENV['SMTP_PASS'] ?? '';

echo "SMTP_USER : $smtpUser\n";
echo "SMTP_PASS : " . (empty($smtpPass) ? '(EMPTY - not set!)' : str_repeat('*', strlen($smtpPass))) . "\n\n";

// Try every combination of host + port + encryption
$combinations = [
    ['host' => 'localhost',      'port' => 465, 'enc' => 'ssl',  'label' => 'localhost:465 SSL'],
    ['host' => 'localhost',      'port' => 587, 'enc' => 'tls',  'label' => 'localhost:587 TLS'],
    ['host' => 'localhost',      'port' => 25,  'enc' => '',      'label' => 'localhost:25 (plain)'],
    ['host' => '127.0.0.1',     'port' => 465, 'enc' => 'ssl',  'label' => '127.0.0.1:465 SSL'],
    ['host' => '127.0.0.1',     'port' => 587, 'enc' => 'tls',  'label' => '127.0.0.1:587 TLS'],
    ['host' => 'primeone.space', 'port' => 465, 'enc' => 'ssl',  'label' => 'primeone.space:465 SSL'],
    ['host' => 'primeone.space', 'port' => 587, 'enc' => 'tls',  'label' => 'primeone.space:587 TLS'],
];

$winner = null;

foreach ($combinations as $c) {
    echo "Testing {$c['label']} ... ";
    flush();

    // Quick TCP test first (3 second timeout)
    $prefix = ($c['enc'] === 'ssl') ? 'ssl://' : '';
    $sock = @fsockopen($prefix . $c['host'], $c['port'], $errno, $errstr, 3);
    if (!$sock) {
        echo "❌ TCP FAIL ($errno: $errstr)\n";
        continue;
    }
    fclose($sock);
    echo "✅ TCP OK → ";

    // Now try PHPMailer
    $mail = new PHPMailer(true);
    try {
        set_time_limit(20);
        $mail->isSMTP();
        $mail->Host     = $c['host'];
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUser;
        $mail->Password = $smtpPass;
        $mail->Port     = $c['port'];
        $mail->Timeout  = 8;

        if ($c['enc'] === 'ssl') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        } elseif ($c['enc'] === 'tls') {
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        } else {
            $mail->SMTPSecure = '';
            $mail->SMTPAutoTLS = false;
        }

        $mail->SMTPOptions = [
            'ssl' => [
                'verify_peer'       => false,
                'verify_peer_name'  => false,
                'allow_self_signed' => true,
            ],
        ];

        $mail->setFrom($smtpUser, 'PrimeOne Space');
        $mail->addAddress($smtpUser);
        $mail->Subject = '✅ PrimeOne SMTP Test — ' . $c['label'];
        $mail->isHTML(true);
        $mail->Body    = '<h2>PrimeOne Space — Email Test Successful!</h2><p>Working config: <strong>' . $c['label'] . '</strong></p>';
        $mail->AltBody = 'PrimeOne Space email test works! Config: ' . $c['label'];

        $mail->send();
        echo "✅ EMAIL SENT!\n";
        echo "\n🎉 WINNER: {$c['label']}\n";
        echo "   Update your .env with:\n";
        echo "   SMTP_HOST={$c['host']}\n";
        echo "   SMTP_PORT={$c['port']}\n";
        echo "   SMTP_SECURE={$c['enc']}\n";
        $winner = $c;
        break;

    } catch (Exception $e) {
        echo "❌ AUTH FAIL: " . $mail->ErrorInfo . "\n";
    }
}

if (!$winner) {
    echo "\n❌ No working SMTP configuration found.\n";
    echo "Possible causes:\n";
    echo "1. Wrong SMTP_PASS in .env — check your cPanel Email Account password\n";
    echo "2. cPanel firewall blocking all SMTP — contact your hosting provider\n";
    echo "3. The email account hello@primeone.space doesn't exist in cPanel\n";
}

echo "\n=== Done ===\n";
echo "⚠️  DELETE THIS FILE after fixing!\n";
?>
