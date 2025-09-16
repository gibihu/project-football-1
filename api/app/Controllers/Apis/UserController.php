<?php

namespace App\Controllers\Apis;

use App\Controllers\BaseController;
use Illuminate\Database\Eloquent\ModelNotFoundException;


use App\Core\Request;
use App\Models\User;
use App\Core\Auth;

use Ramsey\Uuid\Uuid;

class UserController extends BaseController{

    public function show(Request $request) {
        try{
            if(Auth::check()){
                
                $user = User::where('id', '!=', Auth::id())->get();

                return response([
                    'message' => 'สำเร็จ',
                    'data' => $user,
                    'code' => 200
                ], 200)->json();
            }else{
                throw new Exception("ไม่สามารถหารด้วยศูนย์ได้!");
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
