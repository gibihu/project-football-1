<?php

use App\Middleware\CsrfMiddleware;

/**
 * สร้าง CSRF token
 * 
 * @return string
 */
function csrf_token()
{
    return CsrfMiddleware::generateToken();
}

/**
 * ดึง CSRF token ปัจจุบัน
 * 
 * @return string|null
 */
function csrf_field()
{
    $token = CsrfMiddleware::getToken();
    if (!$token) {
        $token = csrf_token();
    }
    
    return '<input type="hidden" name="_token" value="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';
}

/**
 * สร้าง CSRF meta tag สำหรับใช้ใน HTML head
 * 
 * @return string
 */
function csrf_meta()
{
    $token = CsrfMiddleware::getToken();
    if (!$token) {
        $token = csrf_token();
    }
    
    return '<meta name="csrf-token" content="' . htmlspecialchars($token, ENT_QUOTES, 'UTF-8') . '">';
}

/**
 * สร้าง CSRF token สำหรับใช้ใน JavaScript/AJAX
 * 
 * @return string
 */
function csrf_header()
{
    $token = CsrfMiddleware::getToken();
    if (!$token) {
        $token = csrf_token();
    }
    
    return $token;
}
