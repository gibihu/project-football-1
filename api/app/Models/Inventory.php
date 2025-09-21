<?php

namespace App\Models;

use Ramsey\Uuid\Uuid;

class Inventory extends BaseModel
{
    protected $table = 'inventory';
    
    protected $fillable = [
        'id',
        'source_id',
        'source_type',
        'amount',
    ];

    public $timestamps = true;
}
