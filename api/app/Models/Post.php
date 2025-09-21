<?php

namespace App\Models;

use Ramsey\Uuid\Uuid;

class Post extends BaseModel
{
    protected $table = 'posts';
    protected $keyType = 'string';
    public $incrementing = false;
    
    protected $fillable = [
        'id',
        'user_id',
        'title',
        'contents',
        'points',
        'status',
    ];

    public $timestamps = true;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')
                ->select('id', 'name', 'username');
    }
}
