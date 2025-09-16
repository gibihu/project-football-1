<?php

namespace App\Controllers;

use App\Core\Request;
use App\Models\User;
use App\Core\Auth;

class HomeController extends BaseController
{
    public function index(Request $request)
    {
        $user = Auth::user() ?? null;
        
        return $this->json([
            'message' => 'Welcome to PHP Router System',
            'timestamp' => date('Y-m-d H:i:s'),
            'method' => $request->getMethod(),
            'path' => $request->getPathInfo(),
            'user' => $user,
        ]);
    }

    public function hello(Request $request, $name = 'World')
    {
        return $this->json([
            'message' => "Hello, {$name}!",
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
}
