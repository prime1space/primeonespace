<?php
// backend/php/CSRFProtection.php

class CSRFProtection {
    private $conn;
    private $tokenLifetime = 3600; // 1 hour
    
    public function __construct($conn) {
        $this->conn = $conn;
        $this->createTableIfNotExists();
    }
    
    private function createTableIfNotExists() {
        try {
            $this->conn->exec("
                CREATE TABLE IF NOT EXISTS csrf_tokens (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    token VARCHAR(64) NOT NULL UNIQUE,
                    user_id VARCHAR(255) NULL,
                    session_id VARCHAR(255) NULL,
                    ip_address VARCHAR(45) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    expires_at TIMESTAMP NOT NULL,
                    used BOOLEAN DEFAULT FALSE,
                    INDEX idx_token (token),
                    INDEX idx_expires (expires_at)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
            ");
        } catch (PDOException $e) {
            error_log("CSRF table creation failed: " . $e->getMessage());
        }
    }
    
    /**
     * Generate a new CSRF token
     * @param string|null $userId - Optional user ID
     * @param string|null $sessionId - Optional session ID
     * @return string - The generated token
     */
    public function generateToken($userId = null, $sessionId = null) {
        // Clean up expired tokens
        $this->cleanupExpiredTokens();
        
        // Generate cryptographically secure token
        $token = bin2hex(random_bytes(32));
        $ip = $this->getClientIP();
        $expiresAt = date('Y-m-d H:i:s', time() + $this->tokenLifetime);
        
        try {
            $stmt = $this->conn->prepare("
                INSERT INTO csrf_tokens (token, user_id, session_id, ip_address, expires_at)
                VALUES (?, ?, ?, ?, ?)
            ");
            $stmt->execute([$token, $userId, $sessionId, $ip, $expiresAt]);
            
            return $token;
        } catch (PDOException $e) {
            error_log("CSRF token generation failed: " . $e->getMessage());
            return '';
        }
    }
    
    /**
     * Validate a CSRF token
     * @param string $token - The token to validate
     * @param string|null $userId - Optional user ID to match
     * @param bool $singleUse - Whether token should be invalidated after use
     * @return bool - True if valid, false otherwise
     */
    public function validateToken($token, $userId = null, $singleUse = true) {
        if (empty($token)) {
            return false;
        }
        
        $ip = $this->getClientIP();
        
        try {
            // Check if token exists, not expired, not used, and matches IP
            $stmt = $this->conn->prepare("
                SELECT id, user_id, used 
                FROM csrf_tokens 
                WHERE token = ? 
                AND expires_at > NOW() 
                AND used = FALSE
                AND ip_address = ?
            ");
            $stmt->execute([$token, $ip]);
            $record = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$record) {
                error_log("CSRF validation failed: Token not found or expired for IP $ip");
                return false;
            }
            
            // If userId provided, verify it matches
            if ($userId !== null && $record['user_id'] !== $userId) {
                error_log("CSRF validation failed: User ID mismatch");
                return false;
            }
            
            // Mark token as used if single-use
            if ($singleUse) {
                $stmt = $this->conn->prepare("
                    UPDATE csrf_tokens 
                    SET used = TRUE 
                    WHERE id = ?
                ");
                $stmt->execute([$record['id']]);
            }
            
            return true;
            
        } catch (PDOException $e) {
            error_log("CSRF validation error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get token from request headers or body
     * @return string|null
     */
    public function getTokenFromRequest() {
        // Check header first
        $headers = getallheaders();
        if (isset($headers['X-CSRF-Token'])) {
            return $headers['X-CSRF-Token'];
        }
        if (isset($headers['x-csrf-token'])) {
            return $headers['x-csrf-token'];
        }
        
        // Check POST data
        if (isset($_POST['csrf_token'])) {
            return $_POST['csrf_token'];
        }
        
        // Check JSON body
        $input = file_get_contents('php://input');
        if ($input) {
            $data = json_decode($input, true);
            if (isset($data['csrf_token'])) {
                return $data['csrf_token'];
            }
        }
        
        return null;
    }
    
    /**
     * Clean up expired tokens
     */
    private function cleanupExpiredTokens() {
        try {
            $this->conn->exec("
                DELETE FROM csrf_tokens 
                WHERE expires_at < NOW() 
                OR (used = TRUE AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR))
            ");
        } catch (PDOException $e) {
            error_log("CSRF cleanup error: " . $e->getMessage());
        }
    }
    
    /**
     * Get client IP address
     */
    private function getClientIP() {
        $ip = '';
        
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $ip = trim($ips[0]);
        } else {
            $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        }
        
        if (!filter_var($ip, FILTER_VALIDATE_IP)) {
            $ip = '0.0.0.0';
        }
        
        return $ip;
    }
    
    /**
     * Revoke all tokens for a user (e.g., on logout)
     */
    public function revokeUserTokens($userId) {
        try {
            $stmt = $this->conn->prepare("
                UPDATE csrf_tokens 
                SET used = TRUE 
                WHERE user_id = ?
            ");
            $stmt->execute([$userId]);
        } catch (PDOException $e) {
            error_log("CSRF revoke error: " . $e->getMessage());
        }
    }
}
?>
