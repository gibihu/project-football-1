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

    public function all(): array
    {
        return array_merge(
            $this->request->query->all(),
            $this->request->request->all(),
            $this->json
        );
    }

    public function input(string $key, $default = null)
    {
        return $this->all()[$key] ?? $default;
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
}
