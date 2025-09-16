<?php

// เริ่ม session สำหรับ CSRF
if (session_status() === PHP_SESSION_NONE) {
    // ตั้งค่า session cookie parameters
    ini_set('session.cookie_httponly', 0); // อนุญาตให้ JavaScript อ่านได้
    ini_set('session.cookie_secure', 0); // สำหรับ localhost
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_samesite', 'Lax'); // รองรับ cross-site requests
    
    session_start();
}

require_once 'vendor/autoload.php';
require_once 'core/cors.php';
require_once 'helpers/response.php';
require_once 'helpers/csrf.php';

use App\Router;
use Dotenv\Dotenv;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;
use App\Core\Request as CustomRequest;

use App\Middleware\AuthMiddleware;
use App\Middleware\LogMiddleware;
use App\Middleware\CsrfMiddleware;
use App\Middleware\AdminMiddleware;

use App\Controllers\HomeController;
use App\Controllers\LiveScoreController;
use App\Controllers\Apis\AuthController;
use App\Controllers\Apis\SessionController;
use App\Controllers\Apis\UserController;
use App\Controllers\Apis\LiveScoreApiController;
use App\Controllers\Apis\PointsApiController;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();



// สร้าง Symfony Request จาก globals
$symfonyRequest = SymfonyRequest::createFromGlobals();
// แปลงเป็น CustomRequest
$request = new CustomRequest($symfonyRequest);

// Create router instance
$router = new Router();

// Register middlewares
$router->middleware('auth', [AuthMiddleware::class, 'handle']);
$router->middleware('admin', [AdminMiddleware::class, 'handle']);
$router->middleware('log', [LogMiddleware::class, 'handle']);
$router->middleware('csrf', [CsrfMiddleware::class, 'handle']);

// Define routes
$router->get('/', [HomeController::class, 'index'], ['log']);
$router->get('/csrf-token', function($request) {
    return new \Symfony\Component\HttpFoundation\JsonResponse([
        'csrf_token' => csrf_token()
    ]);
}, ['log']);
$router->post('/login', [AuthController::class, 'login'], ['log']);
$router->get('/logout', [AuthController::class, 'logout'], ['log']);
$router->post('/register ', [AuthController::class, 'store'], ['log']);
// $router->get('/', [HomeController::class, 'hello'], ['log']);
$router->get('/session', [SessionController::class, 'show'], ['log', 'auth']);
// User routes
$router->get('/users', [UserController::class, 'show'], ['log', 'auth', 'admin']);



$router->get('/live/live_score ', [LiveScoreApiController::class, 'LiveScore'], ['log']);
$router->get('/live/match/event', [LiveScoreApiController::class, 'event'], ['log']);
$router->get('/flag', [LiveScoreController::class, 'showFlag'], ['log']);



$router->get('/package-points', [PointsApiController::class, 'show'], ['log', 'auth']);

// $router->get('/users/{id}', [UserController::class, 'show'], ['log']);
// $router->post('/users', [UserController::class, 'store'], ['log']);
// $router->put('/users/{id}', [UserController::class, 'update'], ['log']);
// $router->delete('/users/{id}', [UserController::class, 'destroy'], ['log']);

// Handle request
$response = $router->handle($request);

// Send response
$response->send();
