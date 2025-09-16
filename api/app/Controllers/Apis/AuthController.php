<?php

namespace App\Controllers\Apis;

use App\Controllers\BaseController;
use Illuminate\Database\Eloquent\ModelNotFoundException;


use App\Core\Request;
use App\Core\Auth;

use App\Models\User;
use App\Models\Wallet;

use Ramsey\Uuid\Uuid;

class AuthController extends BaseController{
    public function login(Request $request) {
        try{
            $username = $request->input('username');
            $password = $request->input('password');

            $user = User::where('username', $username)->firstOrFail();
            if($user && Auth::login($user, $password, true)){
                
                $data = $user;

                return response([
                    'message' => 'สำเร็จ',
                    'data' => $data,
                    'code' => 200
                ], 200)->json();
            }else{
                
                $response = [
                    'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                    'code' => 404,
                    'errors' => [
                        'password' => 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
                    ]
                ];
                if(env('APP_DEBUG')) $response['debug'] = [
                    'request' => $request->all(),
                    'user' => $user,
                ];
                return response($response, $response['code'])->json();
            }
        } catch (ModelNotFoundException $e) {
            $response = [
                'message' => 'ไม่พบผู้ใช้',
                'code' => 404,
                'errors' => [
                    'password' => 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
                ]
            ];
            if(env('APP_DEBUG')) $response['debug'] = [$e->getMessage()];
            return response($response, 404)->json();
        } catch (\Exception $e) {
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

    public function store(Request $request) {
        try{
            $username = $request->input('username');
            $password = $request->input('password');

            $uuid = Uuid::uuid4()->toString();
            $user = [
                'id' => $uuid,
                'username' => $username,
                'password' => User::hashPassword($password),
            ];

            $insert = User::create($user);
            if(!$insert){
                $response = [
                    'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                    'code' => 400,
                    'errors' => [
                        'password' => 'ไม่สามารถบันทึกข้อมูลได้'
                    ]
                ];
                if(env('APP_DEBUG')) $response['debug'] = [
                    'message' => $e->getMessage(),
                    'request' => $request->all(),
                ];
                return response($response, 400)->json();
            }

            if(Wallet::create([
                'id' => Uuid::uuid4()->toString(),
                'user_id' => $uuid,
            ])){}
            
            $response = [
                'message' => 'สำเร็จ',
                'code' => 201,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'request' => $request->all(),
                'insert' => $insert,
            ];
            return response($response, 200)->json();
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

    public function logout(){
        if(Auth::check()) {
            Auth::logout();
        }
    }

}

// [
//     'message' => '',
//     'errors' => [
//         'detail' => '',
//         'message' => '',
//         'username' => '',
//         'password' => '',
//     ],
//     'code' => 200
// ]