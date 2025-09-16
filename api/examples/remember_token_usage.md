# Remember Token Usage Example

## การใช้งาน Remember Token

ระบบ Remember Token จะช่วยให้ผู้ใช้สามารถเข้าสู่ระบบได้โดยอัตโนมัติแม้หลังจากปิดเบราว์เซอร์แล้ว

### 1. การ Login พร้อม Remember Token

```php
use App\Models\User;
use App\Core\Auth;

// หาผู้ใช้จาก email
$user = User::findByEmail('user@example.com');

if ($user) {
    // Login พร้อม remember token (true = จำการเข้าสู่ระบบ)
    $loginSuccess = Auth::login($user, 'password123', true);
    
    if ($loginSuccess) {
        echo "เข้าสู่ระบบสำเร็จ และจำการเข้าสู่ระบบ";
    }
}
```

### 2. การเช็คสถานะการเข้าสู่ระบบ

```php
use App\Core\Auth;

// เช็คว่าผู้ใช้เข้าสู่ระบบหรือไม่ (จะเช็คทั้ง session และ remember token)
if (Auth::check()) {
    echo "ผู้ใช้เข้าสู่ระบบแล้ว";
    
    // ดึงข้อมูลผู้ใช้ปัจจุบัน
    $user = Auth::user();
    echo "ชื่อผู้ใช้: " . $user->name;
} else {
    echo "ผู้ใช้ยังไม่ได้เข้าสู่ระบบ";
}
```

### 3. การ Logout

```php
use App\Core\Auth;

// Logout จะลบทั้ง session และ remember token
Auth::logout();
echo "ออกจากระบบแล้ว";
```

### 4. การใช้งานใน Controller

```php
class AuthController extends BaseController
{
    public function login()
    {
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        $remember = isset($_POST['remember']); // checkbox for remember me
        
        $user = User::findByEmail($email);
        
        if ($user && Auth::login($user, $password, $remember)) {
            return response()->json([
                'success' => true,
                'message' => 'เข้าสู่ระบบสำเร็จ'
            ]);
        }
        
        return response()->json([
            'success' => false,
            'message' => 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        ], 401);
    }
    
    public function logout()
    {
        Auth::logout();
        return response()->json([
            'success' => true,
            'message' => 'ออกจากระบบแล้ว'
        ]);
    }
    
    public function profile()
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'กรุณาเข้าสู่ระบบ'
            ], 401);
        }
        
        $user = Auth::user();
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username
            ]
        ]);
    }
}
```

### 5. การใช้งานใน Middleware

```php
class AuthMiddleware
{
    public function handle($request, $next)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'กรุณาเข้าสู่ระบบ'
            ], 401);
        }
        
        return $next($request);
    }
}
```

## การตั้งค่า Remember Token

### ในไฟล์ .env
```env
# Session Configuration
SESSION_DRIVER=database
SESSION_LIFETIME=10080
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null
```

- `SESSION_LIFETIME`: จำนวนนาทีที่ remember token จะหมดอายุ
- หากไม่ได้ตั้งค่าหรือไม่มีในไฟล์ `.env` ระบบจะใช้ค่าเริ่มต้น **1440 นาที (1 วัน)**

### ตัวอย่างการตั้งค่า
```env
# หมดอายุใน 1 วัน (1440 นาที)
SESSION_LIFETIME=1440

# หมดอายุใน 7 วัน (10080 นาที)
SESSION_LIFETIME=10080

# หมดอายุใน 30 วัน (43200 นาที)
SESSION_LIFETIME=43200

# หมดอายุใน 1 ชั่วโมง (60 นาที)
SESSION_LIFETIME=60
```

## คุณสมบัติของระบบ Remember Token

1. **ความปลอดภัย**: ใช้ random token ขนาด 64 ตัวอักษร
2. **อายุการใช้งาน**: Cookie จะหมดอายุตามการตั้งค่าใน `.env` (ค่าเริ่มต้น 1440 นาที = 1 วัน)
3. **การตรวจสอบอัตโนมัติ**: ระบบจะเช็ค remember token ทุกครั้งที่เรียก `Auth::user()` หรือ `Auth::check()`
4. **การลบอัตโนมัติ**: เมื่อ logout จะลบทั้ง session และ remember token
5. **การป้องกัน**: หาก token ไม่ถูกต้อง จะลบ cookie อัตโนมัติ
6. **การตั้งค่าที่ยืดหยุ่น**: สามารถปรับอายุการใช้งานผ่านไฟล์ `.env` (หน่วยเป็นนาที)
7. **ความแม่นยำ**: ใช้หน่วยนาทีทำให้สามารถตั้งค่าได้ละเอียดมากขึ้น

## หมายเหตุสำคัญ

- Remember token จะถูกเก็บในฐานข้อมูลในคอลัมน์ `remember_token`
- Cookie จะถูกตั้งค่าเป็น HttpOnly เพื่อความปลอดภัย
- ระบบจะสร้าง session ใหม่จาก remember token เมื่อจำเป็น
- การ logout จะลบทั้ง session และ remember token จากฐานข้อมูล
