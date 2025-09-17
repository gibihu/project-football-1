<?php

namespace App\Models;

use Ramsey\Uuid\Uuid;

class User extends BaseModel
{
    protected $table = 'users';
    protected $keyType = 'string';  // ✅ PK เป็น string
    public $incrementing = false;   // ✅ ไม่ใช่ auto-increment
    
    protected $fillable = [
        'id',
        'name',
        'username',
        'email',
        'password',
        'tier',
        'exp',
        'role',
        'remember_token',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'wallet',
    ];

    protected $casts = [
        'id' => 'string',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public $timestamps = true;

    /**
     * Find user by email
     * 
     * @param string $email
     * @return User|null
     */
    public static function findByEmail($email)
    {
        return static::where('email', $email)->first();
    }

    /**
     * Verify password
     * 
     * @param string $password
     * @return bool
     */
    public static function verifyPassword($password, $hashedPassword)
    {
        return password_verify($password, $hashedPassword);
    }

    /**
     * Hash password before saving
     * 
     * @param string $password
     * @return string
     */
    public static function hashPassword($password)
    {
        return password_hash($password, PASSWORD_DEFAULT);
    }

    /**
     * Generate remember token
     * 
     * @return string
     */
    public static function generateRememberToken()
    {
        return bin2hex(random_bytes(32));
    }

    /**
     * Find user by remember token
     * 
     * @param string $token
     * @return User|null
     */
    public static function findByRememberToken($token)
    {
        return static::where('remember_token', $token)->first();
    }

    /**
     * Set remember token for user
     * 
     * @param string $token
     * @return bool
     */
    public function setRememberToken($token)
    {
        $this->remember_token = $token;
        $result = $this->save();
        
        // Debug: Log the result
        error_log("Remember token save result: " . ($result ? 'SUCCESS' : 'FAILED'));
        error_log("Remember token value: " . $token);
        error_log("User ID: " . $this->id);
        
        return $result;
    }

    /**
     * Clear remember token for user
     * 
     * @return bool
     */
    public function clearRememberToken()
    {
        $this->remember_token = null;
        return $this->save();
    }

    protected $appends = ['point']; // เพิ่ม field point อัตโนมัติใน json

    public function wallet()
    {
        return $this->hasOne(Wallet::class, 'user_id');
    }

    public function getPointAttribute()
    {
        // ดึงค่าจาก wallet แต่ถ้าไม่มีให้เป็น 0
        return optional($this->wallet)->points ?? 0;
    }

    // join transaction
    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'user_id', 'id');
    }
}
