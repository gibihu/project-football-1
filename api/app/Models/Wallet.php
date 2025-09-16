<?php

namespace App\Models;

use Ramsey\Uuid\Uuid;

class Wallet extends BaseModel
{
    protected $table = 'wallet';
    
    protected $fillable = [
        'id',
        'user_id',
        'points',
    ];

    protected $hidden = [
        'id',
        'user_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
