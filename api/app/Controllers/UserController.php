<?php

namespace App\Controllers;

use App\Core\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserController
{
    public function index(Request $request)
    {
        return new JsonResponse([
            'message' => 'Get all users',
            'users' => []
        ]);
    }

    public function show(Request $request, $id)
    {
        return new JsonResponse([
            'message' => 'Get user by ID',
            'user_id' => $id
        ]);
    }

    public function store(Request $request)
    {
        return new JsonResponse([
            'message' => 'Create new user',
            'data' => $request->all()
        ]);
    }

    public function update(Request $request, $id)
    {
        return new JsonResponse([
            'message' => 'Update user',
            'user_id' => $id,
            'data' => $request->all()
        ]);
    }

    public function destroy(Request $request, $id)
    {
        return new JsonResponse([
            'message' => 'Delete user',
            'user_id' => $id
        ]);
    }
}
