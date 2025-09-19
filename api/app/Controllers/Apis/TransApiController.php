<?php

namespace App\Controllers\Apis;

use App\Controllers\BaseController;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Carbon\Carbon;
use Exception;

use App\Controllers\UploadController;
use App\Controllers\WalletController;

use App\Core\Auth;
use App\Core\Request;
use App\Core\Functions;

use App\Models\User;
use App\Models\PackPoints;
use App\Models\Transaction;
use App\Models\Wallet;

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
            if($type == 'admin') {$trans = Transaction::with('user')->whereIn('status', ['awaiting_approval'])->orderBy('updated_at', 'ASC')->get();}
            else {$trans = Transaction::with('user')->where('user_id', $user->id)->orderBy('updated_at', 'DESC')->get();}
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

    public function UplodSlip(Request $request){
        try{
            $tran_id = $request->input('id');
            $status = $request->input('status');
            $file = $_FILES['file'];
            $user = Auth::user();
            try{
                $transac = Transaction::where('id', $tran_id)->first();
                if($transac->user_id == $user->id){
                    $upload = UploadController::uploadFileGetId($file, 'users', $user->id, 'slip');
                    if($upload->status){
                        $save = Transaction::where('id', $tran_id)->update([
                            'status' => $status,
                            'slip_url' => env('APP_URL').'api/image/'.$upload->name,
                            'paid_at' => Carbon::now(),
                        ]);
                        if($save){
                            return response([
                                'message' => 'สำเร็จ',
                                'data' => $save,
                                'code' => 200
                            ], 200)->json();
                        }else{
                            throw new Exception("ไม่สามารถอัพเดทหลักฐานได้");
                        }
                    }else{
                        throw new Exception("ไม่สามารถบันทึกรูปได้");
                    }
                }else{
                    throw new Exception("ไม่ใช่เจ้าของหมายเลข");
                }
            }catch (\Exception $e) {
                $response = [
                    'message' => $e->getMessage() ?? 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                    'code' => 500,
                ];
                if(env('APP_DEBUG')) $response['debug'] = [
                    'message' => $e->getMessage(),
                    'request' => $request->all(),
                    'file' => $file,
                ];
                return response($response, 500)->json();
            }
        }catch (\Exception $e) {
            $response = [
                'message' => $e->getMessage() ?? 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
                'request' => $request->all(),
            ];
            return response($response, 500)->json();
        }
    }

    public function adminUpdate(Request $request){
        try{
            $user = Auth::user();
            if($user->role !== 'admin'){
                $response = [
                    'message' => 'ไม่ได้รับอนุญาติ',
                    'code' => 403,
                ];
                if(env('APP_DEBUG')) $response['debug'] = [
                    'request' => $request->all(),
                    'id' => $id,
                ];
                return response($response, 403)->json();
            }

            $req = $request->all();
            $tran_id = $req->id;
            $status = $req->status;

            if($status && $tran_id){
                $flows = false;
                switch($status){
                    case 'approved':
                        $tranDB = Transaction::where('id', $tran_id)->first();
                        if($tranDB){
                            if($tranDB->status == 'approved' || $tranDB->status == 'rejected') { throw new Exception("ไม่สามารถบันทึกซ้ำได้"); }

                            $tranDB->update([
                                'status' => $status,
                                'admin_id' => $user->id,
                                'approved_at' => Carbon::now(),
                            ]);
                            $wallet = Wallet::where('user_id', $tranDB->user_id)->first();
                            if($wallet){
                                $update = WalletController::AddPoint($wallet->user_id, $tranDB->points, 'topup', 'เติมพอยต์ผ่านการยินยัน');
                                return response([
                                    'message' => 'สำเร็จ',
                                    'data' => $update,
                                    'code' => 200
                                ], 200)->json();
                            }
                            throw new Exception("ไม่พบกระเป๋า");
                        }
                        throw new Exception("อนุมัติไม่ได้");
                        break;
                    case 'rejected':
                        $tranDB = Transaction::where('id', $tran_id)->first();
                        if($tranDB){
                            if($tranDB->status == 'approved' || $tranDB->status == 'rejected') { throw new Exception("ไม่สามารถบันทึกซ้ำได้"); }
                            $tranDB->update([
                                'status' => $status,
                                'admin_id' => $user->id,
                            ]);
                            if($tranDB){
                                return response([
                                    'message' => 'สำเร็จ',
                                    'data' => $update,
                                    'code' => 200
                                ], 200)->json();
                            }
                        }
                        throw new Exception("อัพเดทไม่ผ่าน");
                        break;
                    default:
                        $flows = false;
                        break;
                }
            }
            throw new Exception('เงื่อนไขไม่ครบ');


        }catch (\Exception $e) {
            $response = [
                'message' => $e->getMessage() ?? 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
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
