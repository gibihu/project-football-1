<?php

namespace App\Models;

use Ramsey\Uuid\Uuid;

class WalletHistory extends BaseModel
{
    protected $table = 'wallet_history';
    protected $keyType = 'string';
    public $incrementing = false;
    
    protected $fillable = [
        'id',
        'wallet_id',
        'change_amount',
        'role',
        'type',
        'description',
        'change_amount',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;
    
    public function wallet()
    {
        // สมมติว่า transactions มีคอลัมน์ user_id ที่ชี้ไปที่ users.id
        return $this->belongsTo(Wallet::class, 'wallet_id', 'id');
    }
}
