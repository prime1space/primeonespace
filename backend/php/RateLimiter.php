<?php
// backend/php/RateLimiter.php

class RateLimiter {
    private $conn;
    private $logFile;
    
    public function __construct($conn) {
        $this->conn = $conn;
        $this->logFile = __DIR__ . '/api/rate_limit.log';
        $this->createTableIfNotExists();
    }
    
    private function createTableIfNotExists() {
        try {
            $this->conn->exec("
                CREATE TABLE IF NOT EXISTS rate_limits (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    ip_address VARCHAR(45) NOT NULL,
                    endpoint VARCHAR(255) NOT NULL,
                    attempts INT DEFAULT 1,
                    last_attempt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    locked_until TIMESTAMP NULL,
                    INDEX idx_ip_endpoint (ip_address, endpoint),
                    INDEX idx_locked_until (locked_until)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ");
        } catch (PDOException $e) {
            error_log("RateLimiter table creation failed: " . $e->getMessage());
        }
    }
    
    /**
     * Check if request is allowed
     * @param string $endpoint - The endpoint being accessed
     * @param int $maxAttempts - Maximum attempts allowed
     * @param int $windowSeconds - Time window in seconds
     * @param int $lockoutSeconds - Lockout duration in seconds
     * @return array ['allowed' => bool, 'message' => string, 'retryAfter' => int]
     */
    public function checkLimit($endpoint, $maxAttempts = 5, $windowSeconds = 60, $lockoutSeconds = 900) {
        $ip = $this->getClientIP();
        
        try {
            // Clean up old records (older than 24 hours)
            $this->conn->exec("DELETE FROM rate_limits WHERE last_attempt < DATE_SUB(NOW(), INTERVAL 24 HOUR)");
            
            // Check if currently locked out
            $stmt = $this->conn->prepare("
                SELECT locked_until, attempts 
                FROM rate_limits 
                WHERE ip_address = ? AND endpoint = ? 
                AND locked_until > NOW()
            ");
            $stmt->execute([$ip, $endpoint]);
            $locked = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($locked) {
                $retryAfter = strtotime($locked['locked_until']) - time();
                $this->log("BLOCKED", $ip, $endpoint, $locked['attempts']);
                
                return [
                    'allowed' => false,
                    'message' => "Too many attempts. Please try again in " . ceil($retryAfter / 60) . " minutes.",
                    'retryAfter' => $retryAfter
                ];
            }
            
            // Get current attempts within window
            $stmt = $this->conn->prepare("
                SELECT attempts, last_attempt 
                FROM rate_limits 
                WHERE ip_address = ? AND endpoint = ?
                AND last_attempt > DATE_SUB(NOW(), INTERVAL ? SECOND)
            ");
            $stmt->execute([$ip, $endpoint, $windowSeconds]);
            $record = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($record) {
                $attempts = $record['attempts'] + 1;
                
                // Check if exceeded limit
                if ($attempts > $maxAttempts) {
                    $lockedUntil = date('Y-m-d H:i:s', time() + $lockoutSeconds);
                    
                    // Update with lockout
                    $stmt = $this->conn->prepare("
                        UPDATE rate_limits 
                        SET attempts = ?, locked_until = ?, last_attempt = NOW()
                        WHERE ip_address = ? AND endpoint = ?
                    ");
                    $stmt->execute([$attempts, $lockedUntil, $ip, $endpoint]);
                    
                    $this->log("LOCKED", $ip, $endpoint, $attempts);
                    
                    return [
                        'allowed' => false,
                        'message' => "Too many attempts. Account locked for " . ceil($lockoutSeconds / 60) . " minutes.",
                        'retryAfter' => $lockoutSeconds
                    ];
                }
                
                // Increment attempts
                $stmt = $this->conn->prepare("
                    UPDATE rate_limits 
                    SET attempts = ?, last_attempt = NOW()
                    WHERE ip_address = ? AND endpoint = ?
                ");
                $stmt->execute([$attempts, $ip, $endpoint]);
                
                $this->log("ATTEMPT", $ip, $endpoint, $attempts);
                
                return [
                    'allowed' => true,
                    'message' => 'OK',
                    'retryAfter' => 0,
                    'attemptsRemaining' => $maxAttempts - $attempts
                ];
            } else {
                // First attempt or outside window - create new record
                $stmt = $this->conn->prepare("
                    INSERT INTO rate_limits (ip_address, endpoint, attempts, last_attempt) 
                    VALUES (?, ?, 1, NOW())
                    ON DUPLICATE KEY UPDATE attempts = 1, last_attempt = NOW(), locked_until = NULL
                ");
                $stmt->execute([$ip, $endpoint]);
                
                $this->log("FIRST", $ip, $endpoint, 1);
                
                return [
                    'allowed' => true,
                    'message' => 'OK',
                    'retryAfter' => 0,
                    'attemptsRemaining' => $maxAttempts - 1
                ];
            }
            
        } catch (PDOException $e) {
            error_log("RateLimiter error: " . $e->getMessage());
            // On error, allow request (fail open)
            return ['allowed' => true, 'message' => 'OK', 'retryAfter' => 0];
        }
    }
    
    /**
     * Reset rate limit for IP/endpoint (e.g., after successful login)
     */
    public function reset($endpoint) {
        $ip = $this->getClientIP();
        try {
            $stmt = $this->conn->prepare("
                DELETE FROM rate_limits 
                WHERE ip_address = ? AND endpoint = ?
            ");
            $stmt->execute([$ip, $endpoint]);
            $this->log("RESET", $ip, $endpoint, 0);
        } catch (PDOException $e) {
            error_log("RateLimiter reset error: " . $e->getMessage());
        }
    }
    
    /**
     * Get client IP address (handles proxies)
     */
    private function getClientIP() {
        $ip = '';
        
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            // Get first IP in chain
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $ip = trim($ips[0]);
        } else {
            $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        }
        
        // Validate IP
        if (!filter_var($ip, FILTER_VALIDATE_IP)) {
            $ip = '0.0.0.0';
        }
        
        return $ip;
    }
    
    /**
     * Log rate limit events
     */
    private function log($action, $ip, $endpoint, $attempts) {
        $timestamp = date('[Y-m-d H:i:s]');
        $message = "$timestamp $action - IP: $ip, Endpoint: $endpoint, Attempts: $attempts\n";
        file_put_contents($this->logFile, $message, FILE_APPEND);
    }
}
?>
