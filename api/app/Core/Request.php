<?php
namespace App\Core;

use Symfony\Component\HttpFoundation\Request as SymfonyRequest;

class Request
{
    protected SymfonyRequest $request;
    protected array $json = [];

    public function __construct(SymfonyRequest $request)
    {
        $this->request = $request;
        $content = $request->getContent();
        if ($content) {
            $this->json = json_decode($content, true) ?? [];
        }
    }

    public function all(): \stdClass
    {
        $data = array_merge(
            $this->request->query->all(),
            $this->request->request->all(),
            $this->json,
            $this->request->files->all()
        );

        // แปลง array -> stdClass
        return json_decode(json_encode($data));
    }

    public function get(): array
    {
        $data = array_merge(
            $this->request->query->all(),
            $this->request->request->all(),
            $this->json,
        );

        return $data;
    }

    public function input(string $key, $default = null)
    {
        $all = $this->all();
        return $all->$key ?? $default;
    }
    public function query(): array
    {
        return $this->request->query->all();
    }
    public function method(): string
    {
        return $this->request->getMethod();
    }

    public function header(string $key, $default = null)
    {
        return $this->request->headers->get($key, $default);
    }

    public function getSymfonyRequest(): SymfonyRequest
    {
        return $this->request;
    }

    public function getPathInfo(): string
    {
        return $this->request->getPathInfo();
    }

    public function getMethod(): string
    {
        return $this->request->getMethod();
    }

    public function getClientIp(): string
    {
        return $this->request->getClientIp();
    }

    public function file(string $key)
    {
        return $this->request->files->get($key) ?? ($_FILES[$key] ?? null);
    }
}
