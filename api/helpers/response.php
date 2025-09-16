<?php
// helper/response.php

if (!function_exists('response')) {
    /**
     * Response helper
     *
     * @param mixed $data
     * @param int $status
     * @param array $headers
     * @return object
     */
    function response($data = null, int $status = 200, array $headers = []) {
        return new class($data, $status, $headers) {
            private $data;
            private $status;
            private $headers;

            public function __construct($data, $status, $headers) {
                $this->data = $data;
                $this->status = $status;
                $this->headers = $headers;
            }

            /**
             * ส่ง JSON response สำหรับ API
             * เพิ่ม key "code" ให้ response
             */
            public function json(int $statusCode = null) {
                if ($statusCode !== null) {
                    $this->status = $statusCode;
                }
                http_response_code($this->status);
                header('Content-Type: application/json; charset=utf-8');

                foreach ($this->headers as $key => $value) {
                    header("$key: $value");
                }

                // เตรียม response สำหรับ API

                echo json_encode($this->data, JSON_UNESCAPED_UNICODE);
                exit;
            }

            /**
             * ส่งข้อความธรรมดา
             */
            public function send() {
                http_response_code($this->status);
                foreach ($this->headers as $key => $value) {
                    header("$key: $value");
                }
                echo $this->data;
                exit;
            }

            /**
             * Redirect
             */
            public function redirect(string $url, int $statusCode = 302) {
                http_response_code($statusCode);
                header("Location: $url");
                exit;
            }
        };
    }
}
