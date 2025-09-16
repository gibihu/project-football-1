<?php

namespace App\Database;

use Illuminate\Database\Capsule\Manager as Capsule;

class Database
{
    private static $instance = null;

    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        $capsule = new Capsule;

        $capsule->addConnection([
            'driver' => env('DB_DRIVER', 'mysql'),
            'host' => env('DB_HOST', 'localhost'),
            'database' => env('DB_DATABASE', 'test'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => env('DB_CHARSET', 'utf8'),
            'collation' => env('DB_COLLATION', 'utf8_unicode_ci'),
            'prefix' => env('DB_PREFIX', ''),
            'strict' => true,
            'engine' => null,
        ], 'mysql');

        // Make this Capsule instance available globally
        $capsule->setAsGlobal();

        // Setup the Eloquent ORM
        $capsule->bootEloquent();
    }

    public function getConnection()
    {
        return Capsule::connection();
    }

    public function query($sql, $bindings = [])
    {
        return Capsule::select($sql, $bindings);
    }

    public function insert($sql, $bindings = [])
    {
        return Capsule::insert($sql, $bindings);
    }

    public function update($sql, $bindings = [])
    {
        return Capsule::update($sql, $bindings);
    }

    public function delete($sql, $bindings = [])
    {
        return Capsule::delete($sql, $bindings);
    }
}
