<?php

namespace App;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Route;
use Symfony\Component\Routing\RouteCollection;
use Symfony\Component\Routing\RequestContext;
use Symfony\Component\Routing\Matcher\UrlMatcher;
use Symfony\Component\Routing\Exception\ResourceNotFoundException;

class Router
{
    private $routes;
    private $context;
    private $matcher;
    private $middlewares = [];

    public function __construct()
    {
        $this->routes = new RouteCollection();
        $this->context = new RequestContext();
    }

    /**
     * Add GET route
     * 
     * @param string $path
     * @param callable|string $handler
     * @param array $middlewares
     * @return void
     */
    public function get($path, $handler, $middlewares = [])
    {
        $this->addRoute('GET', $path, $handler, $middlewares);
    }

    /**
     * Add POST route
     * 
     * @param string $path
     * @param callable|string $handler
     * @param array $middlewares
     * @return void
     */
    public function post($path, $handler, $middlewares = [])
    {
        $this->addRoute('POST', $path, $handler, $middlewares);
    }

    /**
     * Add PUT route
     * 
     * @param string $path
     * @param callable|string $handler
     * @param array $middlewares
     * @return void
     */
    public function put($path, $handler, $middlewares = [])
    {
        $this->addRoute('PUT', $path, $handler, $middlewares);
    }

    /**
     * Add DELETE route
     * 
     * @param string $path
     * @param callable|string $handler
     * @param array $middlewares
     * @return void
     */
    public function delete($path, $handler, $middlewares = [])
    {
        $this->addRoute('DELETE', $path, $handler, $middlewares);
    }

    /**
     * Add route with any method
     * 
     * @param string $method
     * @param string $path
     * @param callable|string $handler
     * @param array $middlewares
     * @return void
     */
    private function addRoute($method, $path, $handler, $middlewares = [])
    {
        $routeName = $method . '_' . str_replace(['/', '{', '}'], ['_', '', ''], $path);
        
        // เพิ่ม CSRF middleware โดยอัตโนมัติสำหรับ non-GET requests
        if ($method !== 'GET' && !in_array('csrf', $middlewares)) {
            array_unshift($middlewares, 'csrf');
        }
        
        $route = new Route($path, [
            '_controller' => $handler,
            '_middlewares' => $middlewares
        ], [], [], '', [], [$method]);

        $this->routes->add($routeName, $route);
    }

    /**
     * Add middleware
     * 
     * @param string $name
     * @param callable $middleware
     * @return void
     */
    public function middleware($name, $middleware)
    {
        $this->middlewares[$name] = $middleware;
    }

    /**
     * Handle request
     * 
     * @param Request|App\Core\Request $request
     * @return Response
     */
    public function handle($request)
    {
        // ถ้าเป็น App\Core\Request ให้ดึง Symfony Request ออกมา
        if ($request instanceof \App\Core\Request) {
            $symfonyRequest = $request->getSymfonyRequest();
        } else {
            $symfonyRequest = $request;
        }
        
        $this->context->fromRequest($symfonyRequest);
        $this->matcher = new UrlMatcher($this->routes, $this->context);

        try {
            $parameters = $this->matcher->match($symfonyRequest->getPathInfo());
            
            // Execute middlewares
            $middlewares = $parameters['_middlewares'] ?? [];
            foreach ($middlewares as $middlewareName) {
                if (isset($this->middlewares[$middlewareName])) {
                    $middleware = $this->middlewares[$middlewareName];
                    $response = $middleware($symfonyRequest);
                    if ($response instanceof Response) {
                        return $response;
                    }
                }
            }

            // Execute controller
            $controller = $parameters['_controller'];
            unset($parameters['_controller'], $parameters['_middlewares']);

            // สร้าง App\Core\Request จาก Symfony Request
            $customRequest = new \App\Core\Request($symfonyRequest);

            if (is_array($controller) && count($controller) === 2) {
                // [HomeController::class, 'index']
                [$controllerClass, $method] = $controller;
                $controllerInstance = new $controllerClass();
                return $controllerInstance->$method($customRequest, ...array_values($parameters));

            } elseif (is_string($controller) && strpos($controller, '@') !== false) {
                // "App\Controllers\HomeController@index"
                [$controllerClass, $method] = explode('@', $controller);
                $controllerInstance = new $controllerClass();
                return $controllerInstance->$method($customRequest, ...array_values($parameters));

            } elseif (is_callable($controller)) {
                return $controller($customRequest, ...array_values($parameters));
            }

            throw new \Exception('Invalid controller');


        } catch (ResourceNotFoundException $e) {
            return new Response('Not Found', 404);
        } catch (\Exception $e) {
            return new Response('Internal Server Error: ' . $e->getMessage(), 500);
        }
    }
}
