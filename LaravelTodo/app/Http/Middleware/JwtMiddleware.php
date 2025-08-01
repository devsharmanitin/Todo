<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;


class JwtMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Try to get token from Authorization header first
            $token = JWTAuth::getToken();
            
            // If no token in header, try to get from cookie
            if (!$token && $request->cookie('jwt_token')) {
                $token = $request->cookie('jwt_token');
                JWTAuth::setToken($token);
            }

            if (!$token) {
                return $this->unauthorizedResponse('Token not provided', 'TOKEN_NOT_PROVIDED');
            }

            // Authenticate the user
            $user = JWTAuth::authenticate();

            if (!$user) {
                return $this->unauthorizedResponse('User not found', 'USER_NOT_FOUND');
            }

            // Set the authenticated user in the request (this is important!)
            $request->setUserResolver(function () use ($user) {
                return $user;
            });

        } catch (TokenExpiredException $e) {
            return $this->unauthorizedResponse('Token has expired', 'TOKEN_EXPIRED');
            
        } catch (TokenInvalidException $e) {
            return $this->unauthorizedResponse('Token is invalid', 'TOKEN_INVALID');
            
        } catch (JWTException $e) {
            return $this->unauthorizedResponse('Token error: ' . $e->getMessage(), 'TOKEN_ERROR');
            
        } catch (\Exception $e) {
            \Log::error('JWT Middleware error: ' . $e->getMessage());
            return $this->unauthorizedResponse('Authentication failed', 'AUTH_ERROR');
        }

        return $next($request);
    }

    /**
     * Return unauthorized response
     */
    private function unauthorizedResponse(string $message, string $errorCode = 'UNAUTHORIZED'): Response
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error_code' => $errorCode
        ], 401);
    }
}