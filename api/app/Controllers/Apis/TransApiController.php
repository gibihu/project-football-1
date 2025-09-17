<?php

namespace App\Controllers\Apis;

use App\Controllers\BaseController;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Carbon\Carbon;
use Exception;


use App\Core\Auth;
use App\Core\Request;
use App\Core\Functions;

use App\Models\User;
use App\Models\PackPoints;
use App\Models\Transaction;

use Ramsey\Uuid\Uuid;

class TransApiController extends BaseController{

    public function update(Request $request) {
        try{
            $pack_id = $request->input('id');
            $pack = PackPoints::where('id', $pack_id)->first();
            if($pack){
                $create = Transaction::create([
                    'id' => Uuid::uuid4()->toString(),
                    'user_id' => Auth::id(),
                    'package_id' => $pack->id,
                    'user_reference' => Functions::generateRandomCode(),
                    'amount' => $pack->price,
                    'points' => $pack->points,
                    'expired_at' => Carbon::now()->addDays(3),
                ]);
                if($create){
                    return response([
                        'message' => 'สำเร็จ',
                        'data' => $create,
                        'code' => 200
                    ], 200)->json();
                }
            }
            throw new Exception("ไม่สามารถหารด้วยศูนย์ได้!");
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

    public function show(Request $request, $id, $routeName = null) {
        try{
            $trans = Transaction::where('id', $id)->first();
            if($trans && ($trans->user_id = Auth::id() || Auth::user()->role == 'admin')){
                return response([
                    'message' => 'สำเร็จ',
                    'data' => $trans,
                    'code' => 200
                ], 200)->json();
            }else{
                return response([
                    'message' => 'ไม่พบ',
                    'errors' => [
                        'detail' => 'ไม่พบการทำธุรกรรทนี้'
                    ],
                    'code' => 404
                ], 404)->json();
            }
            throw new Exception("ไม่สามารถหารด้วยศูนย์ได้!");
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

    public function showAll(Request $request){
        try{
            $user = Auth::user();
            $req = $request->query();
            $type = $user->role == 'admin' ? (isset($req['type']) ? $req['type'] : 'user') : 'user' ;
            if($type == 'admin') {$trans = Transaction::with('user')->whereIn('status', ['awaiting_approval', 'refund', 'approved'])->orderBy('created_at', 'DESC')->get();}
            else {$trans = Transaction::with('user')->where('user_id', $user->id)->orderBy('created_at', 'DESC')->get();}
            return response([
                'message' => 'สำเร็จ',
                'data' => $trans,
                'code' => 200
            ], 200)->json();
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
    
    public function update_onec(Request $request, $id){
        try{
            $req = $request->all();
            $status = $req->status;
            $user = Auth::user();
            if(!isset($id)){
                throw new Exception("ไม่สามารถดำเนินการได้!");
            }

            if($user->role == 'admin'){
                $allowedStatuses = ['pending', 'cancle', 'awaiting_approval','approved', 'rejected'];
            }else{
                $allowedStatuses = ['pending', 'cancle', 'awaiting_approval'];
            }

            $update = [
                'status' => $status
            ];
            if(in_array($status, $allowedStatuses)){
                if(!Transaction::where('id', $id)->update($update)) throw new Exception("ไม่สามารถดำเนินการได้!");
                
                return response([
                    'message' => 'สำเร็จ',
                    'data' => $status,
                    'code' => 200
                ], 200)->json();
            }

            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 403,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'request' => $request->all(),
                'status' => $status,
                'allow' => $allowedStatuses
            ];
            return response($response, 403)->json();

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
