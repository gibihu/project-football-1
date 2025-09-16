<?php

namespace App\Middleware;

use Symfony\Component\HttpFoundation\Request;

class LogMiddleware
{
    public static function handle(Request $request)
    {
        $logData = [
            'timestamp' => date('Y-m-d H:i:s'),
            'method' => $request->getMethod(),
            'path' => $request->getPathInfo(),
            'ip' => $request->getClientIp(),
            'user_agent' => $request->headers->get('User-Agent')
        ];

        // Log to file (ตัวอย่าง)
        $logMessage = json_encode($logData) . PHP_EOL;
        file_put_contents('logs/access.log', $logMessage, FILE_APPEND | LOCK_EX);

        // ดำเนินการต่อ
        return null;
    }
}
