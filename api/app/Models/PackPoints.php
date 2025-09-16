<?php

namespace App\Models;

use Ramsey\Uuid\Uuid;

class PackPoints extends BaseModel
{
    protected $table = 'packages';
    protected $keyType = 'string';
    public $incrementing = false;
    
    protected $fillable = [
        'id',
        'points',
        'price',
        'price_per_points',
        'published',
        'is_promo',
        'promo_title',
        'note',
    ];

    protected $hidden = [];

    public $timestamps = true;
}
