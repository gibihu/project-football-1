<?php

namespace App\Controllers\Apis;

use App\Controllers\BaseController;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Carbon\Carbon;
use Exception;

use App\Core\Request;
use App\Core\Auth;

use App\Models\User;
use App\Models\Post;

use Ramsey\Uuid\Uuid;

class PostApisController extends BaseController
{
    public function store(Request $request)
    {
        try {
            $title = $request->input('title');
            $points = $request->input('points');
            $content = $request->input('content');
            $submit = $request->input('submit');
            $user_id = Auth::id();

            $create = Post::create([
                'id' => Uuid::uuid4()->toString(),
                'user_id' => $user_id,
                'title' => $title ?? '',
                'contents' => $content ?? '',
                'points' => $points ?? 100,
                'status' => $submit ?? 'private',
            ]);
            if ($create) {
                return response(
                    [
                        'message' => 'สำเร็จ',
                        'data' => $create,
                        'code' => 201,
                    ],
                    201,
                )->json();
            }
            throw new Exception('ไม่สามารถดำเนินการได้!');
        } catch (\Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if (env('APP_DEBUG')) {
                $response['debug'] = [
                    'message' => $e->getMessage(),
                    'request' => $request->all(),
                ];
            }
            return response($response, 500)->json();
        }
    }

    public function showAuth(Request $request)
    {
        try {
            $req = $request->query();
            $type = $req['type'];
            $user = Auth::user();
            $posts = Post::where('user_id', $user->id)->orderBy('created_at', 'DESC')->get();

            if (!empty($type) && $type === 'hidden') {
                $posts->transform(function ($item) {
                    return [
                        'id' => $item->id,
                        'user_id' => $item->user_id,
                        'title' => $item->title,
                        'contents' => 'hidden', // แทนค่าตรงนี้
                        'points' => $item->points,
                        'status' => $item->status,
                        'created_at' => $item->created_at,
                        'updated_at' => $item->updated_at,
                    ];
                });
            }

            return response(
                [
                    'message' => 'สำเร็จ',
                    'data' => $posts,
                    'code' => 200,
                ],
                200,
            )->json();
        } catch (\Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if (env('APP_DEBUG')) {
                $response['debug'] = [
                    'message' => $e->getMessage(),
                    'request' => $request->all(),
                ];
            }
            return response($response, 500)->json();
        }
    }

    public function show()
    {
        try {
            $posts = Post::with('user')->where('status', 'public')->orderBy('created_at', 'DESC')->get();
            if ($posts) {
                $posts->transform(function ($item) {
                    $item->content = 'hidden';
                    return $item;
                });
                return response(
                    [
                        'message' => 'สำเร็จ',
                        'data' => $posts,
                        'code' => 200,
                    ],
                    200,
                )->json();
            }
        } catch (\Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if (env('APP_DEBUG')) {
                $response['debug'] = [
                    'message' => $e->getMessage(),
                    'request' => $request->all(),
                ];
            }
            return response($response, 500)->json();
        }
    }
}
