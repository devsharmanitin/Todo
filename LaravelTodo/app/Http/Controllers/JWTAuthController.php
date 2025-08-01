<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ChangePasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuthService;
use App\Services\Otp\OtpService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use App\Http\Middleware\JwtMiddleware;


class JWTAuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
        
    }

     /**
     * Set JWT token in HTTP-only cookie
     */
    private function setTokenCookie($response, string $token)
    {
        return $response->cookie(
            'jwt_token',
            $token,
            config('jwt.ttl', 60), // TTL in minutes
            '/',
            null, // domain
            config('app.env') === 'production', // secure (HTTPS only in production)
            true, // httpOnly
            false, // raw (don't encode)
            'Lax' // sameSite
        );
    }

    private function getTokenFromRequest(Request $request): ?string
    {
        $token = JWTAuth::getToken();
        if (!$token && $request->cookie('jwt_token')) {
            $token = $request->cookie('jwt_token');
        }
        return $token;
    }

    private function getTokenExpiryTime(string $token)
    {
        try {

            $payload = JWTAuth::getPayload($token);
            $expirationTime = $payload['exp'];
            $currentTime = time();
            return max( 0, $expirationTime - $currentTime );
        } catch (\Throwable $th) {
            return config('jwt.ttl', 60) * 60;  // Convert minutes to seconds
        }
    }

    /**
     * User Registration
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->register($request->validated());
            
            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'],
                    'errors' => $result['errors'] ?? null
                ], 400);
            }

            $expire_in = $this->getTokenExpiryTime($result['token']);

            $response = response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'data' => [
                    'user' => new UserResource($result['user']),
                    'access_token' => $result['token'],
                    'expires_in' => $expire_in,
                    'requires_verification' => !$result['user']->email_verified_at
                ]
            ], 201);

            // Set JWT token in HTTP-only cookie
            return $this->setTokenCookie($response, $result['token']);

        } catch (\Exception $e) {
            \Log::error('Registration error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
            ], 500);
        }
    }

    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->login($request->validated());
            
            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message']
                ], 401);
            }

            $expires_in = $this->getTokenExpiryTime($result['token']);

            $response = response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data'    => [
                    'user' => new UserResource($result['user']),
                    'access_token' => $result['token'],
                    'expires_in'   => $expires_in, 
                    'requires_verification' => !$result['user']->email_verified_at
                ],
            ], 200);

            // Set JWT token in HTTP-only cookie
            return $this->setTokenCookie($response, $result['token']);

        } catch (\Exception $e) {
            \Log::error('Login error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Login failed. Please try again.',
            ], 500);
        }
    }

    /**
     * Get authenticated user
     */
    public function getUser(): JsonResponse
    {
        try {
            // The user is already authenticated by the middleware
            $user = auth()->user();
            $token = $this->getTokenFromRequest(request());
            
            $expires_in = $token ? $this->getTokenExpiryTime($token) : 0;
            return response()->json([
                'success' => true,
                'message' => 'User retrieved successfully',
                'data' => [
                    'user' => new UserResource($user),
                    'expires_in' => $expires_in
                ]
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Get user error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve user data',
            ], 500);
        }
    }

    /**
     * Refresh JWT Token
     */
    public function refreshToken(Request $request): JsonResponse
    {
        try {
            $token = $this->getTokenFromRequest($request);
            
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'No token provided for refresh',
                    'error_code' => 'TOKEN_NOT_PROVIDED'
                ], 401);
            }

            $newToken = JWTAuth::setToken($token)->refresh();
            $expiresIn = $this->getTokenExpiryTime($newToken);
            
            $response = response()->json([
                'success' => true,
                'message' => 'Token refreshed successfully',
                'data' => [
                    'expires_in' => $expiresIn
                ]
            ], 200);

            return $this->setTokenCookie($response, $newToken);

        } catch (TokenExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token has expired and cannot be refreshed. Please log in again.',
                'error_code' => 'TOKEN_EXPIRED'
            ], 401);

        } catch (TokenInvalidException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid token provided',
                'error_code' => 'TOKEN_INVALID'
            ], 401);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not refresh token',
                'error_code' => 'JWT_ERROR'
            ], 500);
        }
    }

    public function logout(): JsonResponse
    {
        try {
            $token = $this->getTokenFromRequest(request());
            
            if ($token) {
                JWTAuth::setToken($token)->invalidate();
            }

            $response = response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ], 200);

            // Clear the JWT cookie
            return $response->cookie(
                'jwt_token',
                '',
                -1, // Expire immediately
                '/',
                null,
                config('app.env') === 'production',
                true,
                false,
                'Lax'
            );

        } catch (\Exception $e) {
            \Log::error('Logout error: ' . $e->getMessage());
            
            // Even if token invalidation fails, clear the cookie
            $response = response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ], 200);

            return $response->cookie(
                'jwt_token',
                '',
                -1,
                '/',
                null,
                config('app.env') === 'production',
                true,
                false,
                'Lax'
            );
        }
    }

    public function checkAuth(): JsonResponse
    {
        try {
            // If we reach here, the middleware has already authenticated the user
            $user = auth()->user();
            $token = $this->getTokenFromRequest(request());
            $expiresIn = $token ? $this->getTokenExpiryTime($token) : 0;
            
            return response()->json([
                'success' => true,
                'authenticated' => !!$user,
                'data' => [
                    'user' => $user ? new UserResource($user) : null,
                    'isAuthenticated' => !!$user,
                    'expires_in' => $expiresIn
                ]
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Auth check error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'authenticated' => false,
                'data' => [
                    'user' => null,
                    'isAuthenticated' => false,
                    'expires_in' => 0,
                    // 'error_code' => 'UNAUTHORIZED'
                ],
                'message' => 'Authentication check failed'
            ], 500);
        }
    }

    /**
     * Verify OTP
     */
     public function verifyOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'otp' => 'required|string|size:6',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        try {
            $result = $this->authService->verifyOtp(
                $request->user_id,
                $request->otp
            );
            
            return response()->json([
                'success' => $result['success'],
                'message' => $result['message']
            ], $result['success'] ? 200 : 400);
        } catch (\Exception $e) {
            \Log::error('OTP verification error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'OTP verification failed. Please try again.',
            ], 500);
        }
    }

    public function resendOtp(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid user ID',
                'errors' => $validator->errors(),
            ], 422);
        }
        
        try {
            $result = $this->authService->resendOtp($request->user_id);

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message']
            ], $result['success'] ? 200 : 400);
        } catch (\Exception $e) {
            \Log::error('Resend OTP error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to resend OTP. Please try again.',
            ], 500);
        }
    }

    /**
     * Change Password
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        try {
            $result = $this->authService->changePassword(
                auth()->id(),
                $request->current_password,
                $request->new_password
            );

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message']
            ], $result['success'] ? 200 : 400);

        } catch (\Exception $e) {
            \Log::error('Password change error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Password change failed. Please try again.',
            ], 500);
        }
    }

   
    

   
}