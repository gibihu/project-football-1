<?php

namespace App\Controllers;

use App\Core\Request;
use Symfony\Component\HttpFoundation\Response;

use KS\PromptPay;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;

class QrCodeController
{
    protected $generator;

    public function __construct()
    {
        $this->generator = new PromptPay();
    }

    public function show(Request $request, $id)
    {
        $target = '0899999999'; // เบอร์ PromptPay
        $amount = 420;

        // สร้าง payload string
        $payload = $this->generator->generatePayload($target, $amount);

        // ถ้าใช้ Endroid v3
        $qrCode = new QrCode($payload);
        $qrCode->setSize(300);
        $qrCode->setMargin(10);

        // ใช้ PngWriter render เป็นภาพ
        $writer = new PngWriter();
        $result = $writer->write($qrCode);

        // ส่ง response กลับเป็นรูป PNG
        $response = new Response(
            $result->getString(),
            200,
            ['Content-Type' => 'image/png']
        );

        return $response;
    }
}
