<?php

namespace App\Controllers;

use GuzzleHttp\Client;
use Carbon\Carbon;
use stdClass;

use App\Core\Auth;

use App\Core\Request;
use App\Models\User;
use App\Models\Flag;
use App\Models\MatchEvent;

class LiveScoreController extends BaseController
{
    public static function LiveScore()
    {

        try{
            $client = new Client();
            $API_KEY = env('LIVE_SCORE_API_KEY');
            $API_SECRET = env('LIVE_SCORE_API_SECRET');
            $LANG = env('APP_LOCALE');
            
            $response = $client->get("https://livescore-api.com/api-client/matches/live.json?&key=$API_KEY&secret=$API_SECRET&lang=$LANG");

            // ตรวจสอบสถานะ
            if ($response->getStatusCode() === 200) {
                $data = json_decode($response->getBody()->getContents());
                return $data;
            }
            return false;
        }catch(\Exception $e){
            throw $e;
            return false;
        }
    }

    // แก้ไขจาก private เป็น protected หรือ public
    protected function getFlag($type, $id)
    {
        try {
            $flag = Flag::where('type', $type)->where('flag_id', $id)->first();

            if (!$flag) {
                // ถ้าไม่มีใน DB → ดึงจาก API
                $client = new Client();
                $API_KEY = env('LIVE_SCORE_API_KEY');
                $API_SECRET = env('LIVE_SCORE_API_SECRET');
                $LANG = env('APP_LOCALE');

                $response = $client->get("https://livescore-api.com/api-client/countries/flag.json?country_id=$id&key=$API_KEY&secret=$API_SECRET&lang=$LANG");

                if ($response->getStatusCode() === 200) {
                    $imageData = $response->getBody()->getContents();

                    $saveDir = __DIR__ . "/../../public/storage/uploads/$type/";
                    if (!is_dir($saveDir)) {
                        mkdir($saveDir, 0755, true);
                    }

                    $savePath = $saveDir . "$id.png";
                    file_put_contents($savePath, $imageData);

                    // บันทึก record ลง DB
                    Flag::create([
                        'type' => $type,
                        'flag_id' => $id,
                        'path' => "/storage/uploads/$type/$id.png"
                    ]);

                    return "/storage/uploads/$type/$id.png";
                }
            } else {
                // ถ้ามีใน DB → return path
                return $flag->path;
            }
        } catch (\Exception $e) {
            return false;
            // return [
            //     'message' => $e->getMessage(),
            //     'status' => false,
            // ];
        }
    }

    public function showFlag(Request $request)
    {
        $req = $request->query();
        $type = $req['type'] ?? 'country';
        $id = $req['id'] ?? 23;

        $path = $this->getFlag($type, $id); // เรียกใช้ function ที่แก้ไขแล้ว
        
        if ($path) {
            // ใช้ __DIR__ แทน public_path()
            $fullPath = __DIR__ . "/../../public" . $path;

            if (!file_exists($fullPath)) {
                http_response_code(404);
                exit('Flag file not found');
            }

            // ส่งกลับรูปภาพ
            header('Content-Type: image/png');
            readfile($fullPath);
            exit;
        }else{
            echo $path['message'];
            // return response($path, 404);
        }
    }

    public static function LiveEvent($match_id, $status)
    {
        try {
            $match = MatchEvent::where('match_id', $match_id)->first();
            
            if ($match) {
                $item = json_decode($match->json, true);
                
                // ถ้าสถานะ FINISHED แล้ว ไม่ต้องเรียก API อีก
                if (isset($item['status']) && $item['status'] == 'FINISHED') {
                    return $item;
                }
                
                // เช็คเวลาว่าผ่านมากกว่า 1 นาที และไม่มีใครกำลังเรียก API อยู่
                $updated_at = Carbon::parse($match->updated_at)->format('Y-m-d H:i');
                $now = Carbon::now()->format('Y-m-d H:i');
                
                // ถ้ายังไม่เกิน 1 นาที หรือมีคนกำลังเรียก API อยู่ ให้ return ข้อมูลเดิม
                if ($updated_at == $now || $match->is_updating == 1) {
                    return $item;
                }
                $match->update(['is_updating' => 1]);
            }else{
                $match = MatchEvent::create([
                    'match_id' => $match_id,
                    'is_updating' => 1,
                    'status' => $status,
                ]);
            }
            
            try {
                // เรียก API
                $client = new Client();
                $API_KEY = env('LIVE_SCORE_API_KEY');
                $API_SECRET = env('LIVE_SCORE_API_SECRET');
                
                $response = $client->get("https://livescore-api.com/api-client/scores/events.json?id=$match_id&key=$API_KEY&secret=$API_SECRET");

                if ($response->getStatusCode() === 200) {
                    $responseBody = $response->getBody()->getContents();
                    $data = json_decode($responseBody);
                    
                    if ($data && $data->success) {
                        // เช็คว่า data มีข้อมูลจริงๆ หรือไม่
                        if (!empty($data->data)) {
                            // อัพเดทข้อมูลและยกเลิกสถานะ updating
                            $match->update([
                                'json' => json_encode($data->data),
                                'is_updating' => 0,
                                'status' => $data->data->match->status
                            ]);
                            
                            return $data->data;
                        }
                    }
                }

                // ถ้า API ไม่สำเร็จ ยกเลิกสถานะ updating
                $match->update(['is_updating' => 0]);
                return json_decode($match->json);
                
            } catch (\Exception $apiException) {
                // ถ้าเกิดข้อผิดพลาดในการเรียก API ยกเลิกสถานะ updating
                $match->update(['is_updating' => 0]);
                throw $apiException;
                return $apiException;
            }
        } catch(\Exception $e) {
            error_log($e);
            throw $e;
            return $e;
        }
    }

    public static function HistoryScore($page = 1){
        
        try{
            $client = new Client();
            $API_KEY = env('LIVE_SCORE_API_KEY');
            $API_SECRET = env('LIVE_SCORE_API_SECRET');
            $LANG = env('APP_LOCALE');
            $now = Carbon::now()->format('Y-m-d');
            $twoWeeksAgo = Carbon::now()->subWeeks(2)->format('Y-m-d');
            
            $url = "https://livescore-api.com/api-client/matches/history.json?from=$twoWeeksAgo&to=$now&page=$page&key=$API_KEY&secret=$API_SECRET&lang=$LANG";
            $response = $client->get($url);
            
            // ตรวจสอบสถานะ
            if ($response->getStatusCode() === 200) {
                $data = json_decode($response->getBody()->getContents());
                return $data;
            }
            return false;
        }catch(\Exception $e){
            throw $e;
            return false;
        }
    }
}
