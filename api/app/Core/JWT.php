<?php

namespace App\Core;

class JWT
{
    private static $secretKey;
    
    public static function init()
    {
        self::$secretKey = env('JWT_SECRET', 'your-secret-key-here');
    }
    
    /**
     * Create JWT token
     * 
     * @param array $payload
     * @param int $expireMinutes
     * @return string
     */
    public static function createToken(array $payload, int $expireMinutes = 1440): string
    {
        self::init();
        
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload['exp'] = time() + ($expireMinutes * 60);
        $payload['iat'] = time();
        $payload = json_encode($payload);
        
        $base64Header = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64Payload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));
        
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, self::$secretKey, true);
        $base64Signature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        return $base64Header . "." . $base64Payload . "." . $base64Signature;
    }
    
    /**
     * Verify JWT token
     * 
     * @param string $token
     * @return array|null
     */
    public static function verifyToken(string $token): ?array
    {
        self::init();
        
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }
        
        list($base64Header, $base64Payload, $base64Signature) = $parts;
        
        // Verify signature
        $signature = hash_hmac('sha256', $base64Header . "." . $base64Payload, self::$secretKey, true);
        $expectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));
        
        if (!hash_equals($base64Signature, $expectedSignature)) {
            return null;
        }
        
        // Decode payload
        $payload = json_decode(base64_decode(str_replace(['-', '_'], ['+', '/'], $base64Payload)), true);
        
        // Check expiration
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null;
        }
        
        return $payload;
    }
    
    /**
     * Get token from Authorization header
     * 
     * @return string|null
     */
    public static function getTokenFromHeader(): ?string
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;
        
        if ($authHeader && strpos($authHeader, 'Bearer ') === 0) {
            return substr($authHeader, 7);
        }
        
        return null;
    }
    
    /**
     * Get token from request
     * 
     * @return string|null
     */
    public static function getTokenFromRequest(): ?string
    {
        // Try Authorization header first
        $token = self::getTokenFromHeader();
        if ($token) {
            return $token;
        }
        
        // Try cookie as fallback
        return $_COOKIE['remember_token'] ?? null;
    }
}
