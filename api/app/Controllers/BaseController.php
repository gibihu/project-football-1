<?php

namespace App\Controllers;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

abstract class BaseController
{
    /**
     * Return JSON response
     * 
     * @param mixed $data
     * @param int $status
     * @return JsonResponse
     */
    protected function json($data, $status = 200)
    {
        return new JsonResponse($data, $status);
    }

    /**
     * Return text response
     * 
     * @param string $content
     * @param int $status
     * @return Response
     */
    protected function text($content, $status = 200)
    {
        return new Response($content, $status);
    }

    /**
     * Return HTML response
     * 
     * @param string $content
     * @param int $status
     * @return Response
     */
    protected function html($content, $status = 200)
    {
        return new Response($content, $status, ['Content-Type' => 'text/html']);
    }
}
