<?php
// $allowed_origins = [
//     'http://localhost:5173',
//     'http://project1.uat',
// ];

// $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// if (in_array($origin, $allowed_origins, true)) {
//     header("Access-Control-Allow-Origin: $origin");
//     header("Access-Control-Allow-Credentials: true");
//     header("Vary: Origin");
// }

// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-TOKEN");

// // Handle preflight
// if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
//     http_response_code(200);
//     exit();
// }