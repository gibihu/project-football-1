<?php

namespace App\Middleware;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class CsrfMiddleware
{
    public static function handle(Request $request)
    {
        // ข้าม CSRF check สำหรับ GET requests
        if ($request->getMethod() === 'GET') {
            return null;
        }

        // ตรวจสอบ CSRF token
        $csrfToken = null;
        
        // ลองหา token จาก header ก่อน
        $csrfToken = $request->headers->get('X-CSRF-TOKEN');
        
        // ถ้าไม่มีใน header ลองหาใน request data
        if (!$csrfToken) {
            $csrfToken = $request->request->get('_token');
        }

        // ถ้าไม่มี token
        if (!$csrfToken) {
            return new Response(json_encode([
                'error' => 'CSRF token missing',
                'message' => 'CSRF token is required for this request'
            ]), 403, [
                'Content-Type' => 'application/json'
            ]);
        }

        // ตรวจสอบ token กับ session
        if (!self::validateCsrfToken($csrfToken)) {
            return new Response(json_encode([
                'error' => 'Invalid CSRF token',
                'message' => 'CSRF token is invalid or expired'
            ]), 403, [
                'Content-Type' => 'application/json'
            ]);
        }

        // ถ้าผ่านการตรวจสอบ ให้ดำเนินการต่อ
        return null;
    }

    /**
     * ตรวจสอบ CSRF token
     * 
     * @param string $token
     * @return bool
     */
    private static function validateCsrfToken($token)
    {
        // เริ่ม session ถ้ายังไม่ได้เริ่ม
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // ตรวจสอบ token กับ session
        if (!isset($_SESSION['csrf_token'])) {
            return false;
        }

        // ใช้ hash_equals เพื่อป้องกัน timing attack
        return hash_equals($_SESSION['csrf_token'], $token);
    }

    /**
     * สร้าง CSRF token
     * 
     * @return string
     */
    public static function generateToken()
    {
        // เริ่ม session ถ้ายังไม่ได้เริ่ม
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // สร้าง random token
        $token = bin2hex(random_bytes(32));
        
        // เก็บ token ใน session
        $_SESSION['csrf_token'] = $token;
        
        return $token;
    }

    /**
     * ดึง CSRF token ปัจจุบัน
     * 
     * @return string|null
     */
    public static function getToken()
    {
        // เริ่ม session ถ้ายังไม่ได้เริ่ม
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        return $_SESSION['csrf_token'] ?? null;
    }
}
