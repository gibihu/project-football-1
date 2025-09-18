<?php

namespace App\Controllers;

use App\Core\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;

use App\Models\Wallet;
use App\Models\WalletHistory;

use Ramsey\Uuid\Uuid;

class WalletController
{
    public static function AddPoint($user_id, $points, $type, $description){
        try{
            if($user_id && $points){
                try{
                    $wallet = Wallet::where('user_id', $user_id)->firstOrFail();
                    if($wallet){
                        $history = self::history($wallet->id, $points, $type, $description);
                        if($history){
                            $wallet->update([
                                'points' => $wallet->points + $points,
                            ]);
                            if($wallet){
                                return $wallet;
                            }
                        }
                    }
                    throw new Exception('มีบางอย่างทำงานผิดพลาด');
                }catch(ModelNotFoundException $e){
                    throw $e;
                }
            }else{
                throw new Exception('เงื่อนไขไม่ครบ');
            }
        }catch (Exception $e) {
            throw $e;
        }
    }


    private static function history($wallet_id, $amount, $type = 'bonus', $description = ''){
        try{
            $history = WalletHistory::create([
                'id' => Uuid::uuid4()->toString(),
                'wallet_id' => $wallet_id,
                'change_amount' => $amount,
                'role' => $amount >= 0 ? 'add' : 'subtract',
                'type' => $type,
                'description' => $description
            ]);
            return $history;
        }catch (Exception $e) {
            throw $e;
        }
    }
}
