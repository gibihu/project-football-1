<?php

namespace App\Models;

use Ramsey\Uuid\Uuid;

class UploadFile extends BaseModel
{
    protected $table = 'uploadfiles';
    
    protected $fillable = [
        'name',
        'root',
        'path',
        'type',
        'source_type',
        'source_id',
        'status',
    ];

    protected $hidden = [];

    public $timestamps = true;
}
