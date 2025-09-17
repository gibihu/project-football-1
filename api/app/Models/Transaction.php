<?php

namespace App\Models;

use Ramsey\Uuid\Uuid;

class Transaction extends BaseModel
{
    protected $table = 'transactions';
    protected $keyType = 'string';
    public $incrementing = false;
    
    protected $fillable = [
        'id',
        'user_id',
        'package_id',
        'user_reference',
        'reference_code',
        'payment_method',
        'amount',
        'points',
        'currency',
        'status',
        'slip_url',
        'paid_at',
        'approved_at',
        'expired_at',
        'updated_at',
        'created_at',
        'gateway',
        'gateway_txn_id',
        'raw_response',
    ];

    protected $hidden = [];

    public $timestamps = true;
    public function user()
    {
        // สมมติว่า transactions มีคอลัมน์ user_id ที่ชี้ไปที่ users.id
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
