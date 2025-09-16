# PHP Router System with Database Integration

ระบบ Router สำหรับ PHP ที่รองรับ Middleware, Controller และการเชื่อมต่อฐานข้อมูล

## คุณสมบัติ

- ✅ Router system ที่รองรับ GET, POST, PUT, DELETE
- ✅ Middleware support (Auth, Logging)
- ✅ Controller-based architecture
- ✅ Database integration ด้วย Eloquent ORM
- ✅ env() helper function
- ✅ JSON API responses

## การติดตั้ง

1. ติดตั้ง dependencies:
```bash
composer install
```

2. คัดลอกไฟล์ environment:
```bash
cp env.example .env
```

3. แก้ไขการตั้งค่าฐานข้อมูลในไฟล์ `.env`:
```
DB_DRIVER=mysql
DB_HOST=localhost
DB_DATABASE=your_database_name
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

4. สร้างฐานข้อมูลและตาราง:
```sql
-- รันไฟล์ database/schema.sql ในฐานข้อมูลของคุณ
```

## การใช้งาน

### Routes

```php
// Basic routes
$router->get('/', 'App\Controllers\HomeController@index');
$router->get('/hello/{name}', 'App\Controllers\HomeController@hello');

// Routes with middleware
$router->get('/protected', 'App\Controllers\HomeController@index', ['log', 'auth']);

// API routes
$router->get('/users', 'App\Controllers\UserController@index');
$router->post('/users', 'App\Controllers\UserController@store');
$router->put('/users/{id}', 'App\Controllers\UserController@update');
$router->delete('/users/{id}', 'App\Controllers\UserController@destroy');
```

### Middleware

```php
// Register middleware
$router->middleware('auth', [AuthMiddleware::class, 'handle']);
$router->middleware('log', [LogMiddleware::class, 'handle']);

// Use middleware in routes
$router->get('/protected', 'Controller@method', ['log', 'auth']);
```

### Controllers

```php
class HomeController extends BaseController
{
    public function index(Request $request)
    {
        return $this->json([
            'message' => 'Hello World',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    }
}
```

### Models

```php
class User extends BaseModel
{
    protected $table = 'users';
    protected $fillable = ['name', 'email', 'password'];
    
    public static function findByEmail($email)
    {
        return static::where('email', $email)->first();
    }
}
```

### Environment Variables

```php
// ใช้ env() helper function
$dbHost = env('DB_HOST', 'localhost');
$debug = env('APP_DEBUG', false);
```

## API Endpoints

### Users API

- `GET /users` - ดึงรายการ users ทั้งหมด
- `GET /users/{id}` - ดึงข้อมูล user ตาม ID
- `POST /users` - สร้าง user ใหม่
- `PUT /users/{id}` - อัปเดตข้อมูล user
- `DELETE /users/{id}` - ลบ user

### Example API Usage

```bash
# Get all users
curl http://localhost/users

# Create new user
curl -X POST http://localhost/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secret123"}'

# Get user by ID
curl http://localhost/users/1

# Update user
curl -X PUT http://localhost/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'

# Delete user
curl -X DELETE http://localhost/users/1
```

## Authentication

สำหรับ routes ที่ต้องการ authentication ให้ส่ง Authorization header:

```bash
curl -H "Authorization: Bearer valid-token" http://localhost/protected
```

## Logging

ระบบจะบันทึก log การเข้าถึงในไฟล์ `logs/access.log` โดยอัตโนมัติ
