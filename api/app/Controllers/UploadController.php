<?php

namespace App\Controllers;

use App\Core\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Ramsey\Uuid\Uuid;

use App\Models\UploadFile;

class UploadController
{

    private static function storeFile($file, $path = 'uploads/other/', $newFileName = 'blog_qoochub')
    {
        // ตรวจสอบว่าสร้างโฟลเดอร์ได้ไหม
        $scriptDir = __DIR__;
        $uploadDir = realpath($scriptDir . '/../../public/storage/'.$path);

        // ถ้าโฟลเดอร์ไม่เจอ ให้สร้างเอง (realpath จะ return false ถ้าไม่มีอยู่จริง)
        if ($uploadDir === false) {
            $uploadDir = $scriptDir . '/../../public/storage/'.$path;
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }
        }

        // สร้างชื่อไฟล์ใหม่
        $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = substr($newFileName, 0, 100) . '_' . date('Ymd_His') . '_' . Uuid::uuid4()->toString() . '.' . $ext;

        $targetPath = $uploadDir . '/' . $filename;

        if (move_uploaded_file($file['tmp_name'], $targetPath)) {
            return $filename;
        }

        return false;
    }

    public static function uploadFileGetId($file, $source, $id, $type)
    {
        $root = "uploads/";
        $path = "{$source}/{$id}/{$type}";
        $fullPath = $root . $path;

        $fileSaveToName = self::storeFile($file, $fullPath, $source);

        $data = new \stdClass();

        if (!$fileSaveToName) {
            $data->uploadSuccess = false;
            $data->status = false;
        } else {
            $data->uploadSuccess = true;
            $data->status = true;

            $file = UploadFile::create([
                'name'        => $fileSaveToName,
                'root'        => $root,
                'path'        => $path."/" ,
                'type'        => $type,
                'source_type' => $source,
                'source_id'   => $id,
                'status'      => 'active'
            ]);
            
            $fileId = $file->id;

            

            if ($fileId) {
                $data->status = true;
                $data->id = $fileId;
                $data->name = $fileSaveToName;
            } else {
                $data->status = false;
            }
        }

        return $data;
    }
}
