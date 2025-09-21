<?php

namespace App\Controllers\Apis;

use App\Controllers\BaseController;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Carbon\Carbon;
use Exception;


use App\Core\Request;
use App\Core\Auth;

use App\Models\User;

use Ramsey\Uuid\Uuid;

class SessionController extends BaseController{

    public function show(Request $request) {
        try{
            if(Auth::check()){
                $user = Auth::user();
                $user->retrieval_at = Carbon::now();
                return response([
                    'message' => 'สำเร็จ',
                    'data' => $user,
                    'code' => 200
                ], 200)->json();
            }
        }catch (\Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
                'request' => $request->all(),
            ];
            return response($response, 500)->json();
        }
    }
}
