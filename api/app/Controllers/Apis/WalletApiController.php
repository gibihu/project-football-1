<?php

namespace App\Controllers\Apis;

use App\Controllers\BaseController;
use Illuminate\Database\Eloquent\ModelNotFoundException;


use App\Core\Request;
use App\Core\Auth;

use App\Models\User;
use App\Models\WalletHistory;

use Ramsey\Uuid\Uuid;

class WalletApiController extends BaseController{

    public function showHistory(Request $request) {
        try{
            if(Auth::check()){
                $wallet_id = Auth::user()->wallet->id;
                $history = WalletHistory::where('wallet_id', $wallet_id)->orderBy('created_at', 'DESC')->get();
                if($history){
                    return response([
                        'message' => 'สำเร็จ',
                        'data' => $history,
                        'code' => 200
                    ], 200)->json();
                }
            }

            throw new Exception("ไม่สามารถดำเนินการได้!");
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
