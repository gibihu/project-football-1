<?php

namespace App\Controllers\Apis;

use App\Controllers\BaseController;
use App\Controllers\LiveScoreController;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;


use App\Core\Request;
use App\Models\User;
use App\Core\Auth;

use Ramsey\Uuid\Uuid;
class LiveScoreApiController extends BaseController{

    public function liveScoreData() {
        try{
            
            $jsonPath = __DIR__ . '/../../../livescore.json';

            if (!file_exists($jsonPath)) throw new Exception("ไม่สามารถดำเนินการได้!");

            $jsonString = file_get_contents($jsonPath);

            // แปลงเป็น array
            $data = json_decode($jsonString, true);
            if (json_last_error() !== JSON_ERROR_NONE) throw new Exception("ไม่สามารถดำเนินการได้!");
            return response([
                'message' => 'สำเร็จ',
                'data' => $data,
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

    public function LiveScore(){
        try{
            $data = LiveScoreController::LiveScore();
            if (!$data) throw new Exception("ไม่สามารถดำเนินการได้!");
            return response([
                'message' => 'สำเร็จ',
                'data' => $data->data,
                'code' => 200
            ], 200)->json();
        }catch (\Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response($response, 500)->json();
        }
    }

    
    public function event(Request $request){
        try{
            $req = $request->query();
            $match_id = $req['id'] ?? 0;
            $status = $req['status'] ?? 'FINISHED';
            try{
                $data = LiveScoreController::LiveEvent($match_id, $status);
                return response([
                    'message' => 'สำเร็จ',
                    'data' => $data,
                    'code' => 200
                ], 200)->json();
            }catch (\Throwable $e) {
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
        }catch (\Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
                'request' => $request->all(),
                'data' => $data,
            ];
            return response($response, 500)->json();
        }
    }

    public function history(Request $request){
        try{
            $req = $request->query();
            $page = $req['page'] ?? 1;
            $data = LiveScoreController::HistoryScore($page);
            if (!$data) throw new Exception("ไม่สามารถดำเนินการได้!");
            return response([
                'message' => 'สำเร็จ',
                'data' => $data->data,
                'code' => 200
            ], 200)->json();
        }catch (\Exception $e) {
            $response = [
                'message' => 'มีบางอย่างผิดพลาด โปรดลองอีกครั้งในภายหลัง',
                'code' => 500,
            ];
            if(env('APP_DEBUG')) $response['debug'] = [
                'message' => $e->getMessage(),
            ];
            return response($response, 500)->json();
        }
    }

}
