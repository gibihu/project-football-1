<?php

namespace App\Models;

use Ramsey\Uuid\Uuid;

class MatchEvent extends BaseModel
{
    protected $table = 'match_events';
    
    protected $fillable = [
        'match_id',
        'json',
        'status',
        'is_updating',
    ];

    protected $hidden = [
        'id',
    ];

    public $timestamps = true;
}
