# Cross-Domain Authentication Guide

## ปัญหาของ Remember Token ระหว่าง Frontend และ Backend

### **กรณีที่ Cookie ไม่ทำงาน**

1. **Cross Domain**
   ```
   Frontend: https://myapp.com
   Backend:  https://api.myapp.com
   ```

2. **Port ต่างกัน**
   ```
   Frontend: http://localhost:3000
   Backend:  http://localhost:8000
   ```

3. **Protocol ต่างกัน**
   ```
   Frontend: http://myapp.com
   Backend:  https://api.myapp.com
   ```

## วิธีแก้ไขด้วย JWT Token

### 1. การตั้งค่าใน Backend

```env
# ในไฟล์ .env
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_LIFETIME=10080
```

### 2. การใช้งานใน Frontend

#### **React/Vue/Angular**
```javascript
// เก็บ token ใน localStorage
localStorage.setItem('remember_token', jwtToken);

// ส่ง token ใน header ทุก request
const response = await fetch('https://api.myapp.com/api/user', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('remember_token')}`,
    'Content-Type': 'application/json'
  }
});
```

#### **jQuery/Ajax**
```javascript
$.ajaxSetup({
  beforeSend: function(xhr) {
    const token = localStorage.getItem('remember_token');
    if (token) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  }
});
```

### 3. การใช้งานใน Backend

```php
use App\Core\Auth;

// Login พร้อม remember token
$user = User::findByEmail('user@example.com');
Auth::login($user, 'password', true);

// ตรวจสอบสถานะ
if (Auth::check()) {
    $user = Auth::user();
    echo "Welcome " . $user->name;
}
```

## ตัวอย่างการใช้งาน

### **Frontend (JavaScript)**
```javascript
class AuthService {
  constructor() {
    this.baseURL = 'https://api.myapp.com';
  }
  
  async login(email, password, remember = false) {
    const response = await fetch(`${this.baseURL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, remember })
    });
    
    const data = await response.json();
    
    if (data.success && data.token) {
      // เก็บ JWT token
      localStorage.setItem('remember_token', data.token);
      return data;
    }
    
    throw new Error(data.message);
  }
  
  async getCurrentUser() {
    const token = localStorage.getItem('remember_token');
    if (!token) return null;
    
    const response = await fetch(`${this.baseURL}/api/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.json();
  }
  
  logout() {
    localStorage.removeItem('remember_token');
  }
}

// ใช้งาน
const auth = new AuthService();

// Login
auth.login('user@example.com', 'password', true)
  .then(data => console.log('Login success:', data))
  .catch(err => console.error('Login failed:', err));

// ตรวจสอบผู้ใช้ปัจจุบัน
auth.getCurrentUser()
  .then(user => console.log('Current user:', user))
  .catch(err => console.error('Auth failed:', err));
```

### **Backend API Endpoints**

```php
// app/Controllers/Apis/AuthController.php
class AuthController extends BaseController
{
    public function login(Request $request)
    {
        $email = $request->input('email');
        $password = $request->input('password');
        $remember = $request->input('remember', false);
        
        $user = User::findByEmail($email);
        
        if ($user && Auth::login($user, $password, $remember)) {
            // ส่ง JWT token กลับไป
            $token = \App\Core\JWT::getTokenFromRequest();
            
            return $this->json([
                'success' => true,
                'message' => 'เข้าสู่ระบบสำเร็จ',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email
                ]
            ]);
        }
        
        return $this->json([
            'success' => false,
            'message' => 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
        ], 401);
    }
    
    public function user(Request $request)
    {
        if (!Auth::check()) {
            return $this->json([
                'success' => false,
                'message' => 'กรุณาเข้าสู่ระบบ'
            ], 401);
        }
        
        $user = Auth::user();
        return $this->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'username' => $user->username
            ]
        ]);
    }
    
    public function logout(Request $request)
    {
        Auth::logout();
        return $this->json([
            'success' => true,
            'message' => 'ออกจากระบบแล้ว'
        ]);
    }
}
```

## ข้อดีของระบบ JWT

1. **Cross-Domain Support**: ทำงานได้กับ domain และ port ต่างกัน
2. **Stateless**: ไม่ต้องเก็บ session ใน server
3. **Scalable**: รองรับ multiple servers
4. **Secure**: มี signature verification
5. **Flexible**: สามารถเก็บข้อมูลเพิ่มเติมใน token

## ข้อควรระวัง

1. **JWT Secret**: ต้องเก็บ secret key อย่างปลอดภัย
2. **Token Expiration**: ตั้งค่าเวลาหมดอายุที่เหมาะสม
3. **HTTPS**: ควรใช้ HTTPS ใน production
4. **Token Storage**: เก็บ token ใน localStorage หรือ sessionStorage
5. **Logout**: ลบ token เมื่อ logout

## การตั้งค่า CORS

```php
// ในไฟล์ core/cors.php
header('Access-Control-Allow-Origin: https://myapp.com');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Allow-Credentials: true');
```

ตอนนี้ระบบ Remember Token จะทำงานได้กับ Frontend และ Backend ที่แยกกันอยู่แล้ว!
