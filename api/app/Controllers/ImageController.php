<?php

namespace App\Controllers;

use App\Core\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Models\UploadFile;

class ImageController
{
    public function show(Request $resuest, $filename)
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Allow-Methods: GET, POST');
        $img = UploadFile::where('name', $filename)->first();

        if ($img) {
            $scriptDir = __DIR__;
            $filePath = realpath($scriptDir . '/../../public/storage/' . $img->root . '/' . $img->source_type . '/' . $img->source_id . '/' . $img->type . '/' . $img->name);

            if ($filePath && file_exists($filePath)) {
                // หาประเภทไฟล์ (MIME type)
                $mimeType = mime_content_type($filePath);

                // ตั้งค่า header สำหรับ response
                header('Content-Type: ' . $mimeType);
                header('Cache-Control: public, max-age=604800, immutable');
                header('Content-Length: ' . filesize($filePath));

                // อ่านไฟล์ส่งกลับ
                readfile($filePath);
                exit();
            } else {
                // ถ้าไม่พบไฟล์ ให้ส่ง 404
                http_response_code(404);
                echo 'File not found. || ' . $filePath;
                exit();
            }
        } else {
            // ถ้าไม่พบไฟล์ ให้ส่ง 404
            http_response_code(404);
            echo 'File not found. i || ' . $img;
            exit();
        }
    }
}
