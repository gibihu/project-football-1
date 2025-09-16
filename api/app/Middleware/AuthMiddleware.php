<?php

namespace App\Middleware;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Core\Auth;

class AuthMiddleware
{
    public static function handle(Request $request)
    {
        if(!Auth::check()){
            return new Response('Unauthorized', 401, [
                'Content-Type' => 'application/json'
            ]);
        }
    }
    public static function handle_close(Request $request)
    {
        // ตรวจสอบ Authorization header
        $authHeader = $request->headers->get('Authorization');
        
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return new Response('Unauthorized', 401, [
                'Content-Type' => 'application/json'
            ]);
        }

        // ตรวจสอบ token (ตัวอย่างง่ายๆ)
        $token = substr($authHeader, 7);
        if ($token !== 'valid-token') {
            return new Response('Invalid token', 401, [
                'Content-Type' => 'application/json'
            ]);
        }

        // ถ้าผ่านการตรวจสอบ ให้ดำเนินการต่อ
        return null;
    }
}
