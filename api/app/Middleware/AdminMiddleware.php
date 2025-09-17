<?php

namespace App\Middleware;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Core\Auth;

class AdminMiddleware
{
    public static function handle(Request $request)
    {
        
        if(!Auth::check() || Auth::user()->role == 'user'){
            return new Response('Unauthorized', 401, [
                'Content-Type' => 'application/json'
            ]);
        }
    }
}
