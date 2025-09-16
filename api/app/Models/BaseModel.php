<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Database\Database;

abstract class BaseModel extends Model
{
    protected $connection = 'mysql';

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        
        // Initialize database connection
        Database::getInstance();
    }

    /**
     * Get all records
     * 
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getAll()
    {
        return static::all();
    }

    /**
     * Find record by ID
     * 
     * @param int $id
     * @return static|null
     */
    public static function findById($id)
    {
        return static::find($id);
    }

    /**
     * Create new record
     * 
     * @param array $data
     * @return static
     */
    public static function createRecord(array $data)
    {
        return static::create($data);
    }

    /**
     * Update record by ID
     * 
     * @param int $id
     * @param array $data
     * @return bool
     */
    public static function updateById($id, array $data)
    {
        return static::where('id', $id)->update($data);
    }

    /**
     * Delete record by ID
     * 
     * @param int $id
     * @return bool
     */
    public static function deleteById($id)
    {
        return static::destroy($id);
    }

    /**
     * Get records with pagination
     * 
     * @param int $perPage
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public static function paginate($perPage = 15)
    {
        return static::paginate($perPage);
    }
}
