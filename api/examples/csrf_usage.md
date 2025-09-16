# การใช้งาน CSRF Protection

## ภาพรวม
ระบบ CSRF protection จะตรวจสอบ CSRF token โดยอัตโนมัติสำหรับทุก API request ที่ไม่ใช่ GET method

## การทำงาน
- **GET requests**: ไม่ต้องตรวจสอบ CSRF token
- **POST, PUT, DELETE requests**: ต้องมี CSRF token ที่ถูกต้อง

## การใช้งาน

### 1. ดึง CSRF Token
```bash
GET /csrf-token
```

Response:
```json
{
    "csrf_token": "abc123def456..."
}
```

### 2. ส่ง CSRF Token ใน Request

#### วิธีที่ 1: ส่งใน Header (แนะนำ)
```bash
POST /login
Headers:
  X-CSRF-TOKEN: abc123def456...
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

#### วิธีที่ 2: ส่งใน Form Data
```bash
POST /login
Content-Type: application/x-www-form-urlencoded

email=user@example.com&password=password123&_token=abc123def456...
```

### 3. ตัวอย่าง JavaScript/AJAX

```javascript
// ดึง CSRF token ก่อน
fetch('/csrf-token')
    .then(response => response.json())
    .then(data => {
        const csrfToken = data.csrf_token;
        
        // ส่ง request พร้อม CSRF token
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                email: 'user@example.com',
                password: 'password123'
            })
        })
        .then(response => response.json())
        .then(data => console.log(data));
    });
```

### 4. ตัวอย่าง HTML Form

```html
<form action="/login" method="POST">
    <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
    <input type="email" name="email" required>
    <input type="password" name="password" required>
    <button type="submit">Login</button>
</form>
```

## Error Responses

### CSRF Token Missing
```json
{
    "error": "CSRF token missing",
    "message": "CSRF token is required for this request"
}
```
Status: 403 Forbidden

### Invalid CSRF Token
```json
{
    "error": "Invalid CSRF token",
    "message": "CSRF token is invalid or expired"
}
```
Status: 403 Forbidden

## Helper Functions

### csrf_token()
สร้างและคืนค่า CSRF token ใหม่

### csrf_field()
คืนค่า HTML input field สำหรับ CSRF token
```php
echo csrf_field(); // <input type="hidden" name="_token" value="...">
```

### csrf_meta()
คืนค่า HTML meta tag สำหรับ CSRF token
```php
echo csrf_meta(); // <meta name="csrf-token" content="...">
```

### csrf_header()
คืนค่า CSRF token สำหรับใช้ใน JavaScript/AJAX
```php
echo csrf_header(); // abc123def456...
```

## หมายเหตุ
- CSRF token จะถูกเก็บใน PHP session
- Token จะถูกสร้างใหม่ทุกครั้งที่เรียกใช้ `csrf_token()`
- ระบบจะใช้ `hash_equals()` เพื่อป้องกัน timing attack
