<?php

namespace App\Models;

use Ramsey\Uuid\Uuid;

class Flag extends BaseModel
{
    protected $table = 'flags';
    
    protected $fillable = [
        'flag_id',
        'type',
        'path',
    ];

    protected $hidden = [
        'id',
    ];

    public $timestamps = true;

    const TEAM = 'team';
    const COUNTRY = 'country';

    public static $typeLabels = [
        self::TEAM => 'team',
        self::COUNTRY => 'country',
    ];


    // Accessor สำหรับ type status
    public function getTypeTextAttribute()
    {
        return self::$typeLabels[$this->type] ?? 'Unknown type Status';
    }
}
