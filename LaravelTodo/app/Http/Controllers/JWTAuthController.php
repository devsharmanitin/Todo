<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Events\UserRegistered;
use App\Services\Otp\OtpService;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\ChangePasswordRequest;
use App\Services\PasswordService;
use App\Http\Resources\UserResource;

class JWTAuthController extends Controller
{
    /**
     * Token Authentication and Refresh Token
     */
    public function refresh_token(Request $request) {
        try {
            // When refreshing, the *expired* access token should be sent in the Authorization header.
            // JWTAuth::refresh() will then issue a new token.
            $newToken = JWTAuth::refresh(JWTAuth::getToken());

            return response()->json([
                'success' => true,
                'message' => 'Token refreshed successfully',
                'access_token'   => $newToken, // Renamed 'token' to 'access_token'
            ], 200);
        } catch (TokenExpiredException $e) {
            // This happens if the grace period for refreshing the token has also expired.
            // This means the refresh token (i.e., the old access token used for refreshing) is no longer valid.
            return response()->json([
                'success' => false,
                'message' => 'Token has expired and cannot be refreshed (refresh grace period elapsed). Please log in again.',
                'error'   => $e->getMessage(),
            ], 401); // 401 Unauthorized, forcing re-login
        } catch (TokenInvalidException $e) {
            // Token is malformed or invalid for some other reason
            return response()->json([
                'success' => false,
                'message' => 'Invalid token for refresh.',
                'error'   => $e->getMessage(),
            ], 401);
        } catch (JWTException $e) {
            // Other JWT related errors
            return response()->json([
                'success' => false,
                'message' => 'Could not refresh token (JWT issue)',
                'error'   => $e->getMessage(),
            ], 500);
        } catch (\Exception $e) {
            // Generic errors
            return response()->json([
                'success' => false,
                'message' => 'An unexpected error occurred while refreshing the token',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }


    // User Registration
    public function register(Request $request) {
        $validator = Validator::make( $request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if( $validator->fails() ) {
            return response()->json([
                'success' => false,
                'message' => 'validation Failed',
                'error'   => $validator->errors()->ToJson(),
            ], 400);
        }

        try {
            Db::beginTransaction();

            $user = User::create([
                'name' => $request->get('name'),
                'email' => $request->get('email'),
                'password' => Hash::make($request->get('password')), 
            ]);

            $token = JWTAuth::fromUser($user);

            event(new UserRegistered($user));

            DB::commit();

            return response()->json([
                'success' => true,
                'messgae' => 'User Register Successful',
                'token'   => $token,
                'user'    => $user
            ], 200);
        } catch (JWTException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(), 
            ], 502);
        }
        

    }

    public function login(Request $request) {
        $credentials = $request->only('email', 'password');
        try {
            $token = JWTAuth::attempt($credentials);   
            if( !$token ) {
                return response()->json([
                    'success'  => false,
                    'message'  => 'unauthorized',
                    'errors'   => 'Invalid credientials',
                ], 401);
            }  
            $user = auth()->user();   
            $token = JWTAuth::fromUser($user);
            return response()->json([
                'success'  => true,
                'message'  => 'success',
                'user'   => new UserResource($user),
                'access_token'    => $token,
            ], 200);   
        } catch (JWTException $e) {
            return response()->json([
                'success'  => false,
                'message'  => 'unauthorized',
                'errors'   => 'Could not create token',
            ], 500);
        }
    }

    public function getuser() {
        try {
            if( ! $user = JWTAuth::parseToken()->authenticate() ) {
                return response()-json([
                    'success'  => false,
                    'messgae'  => 'not found',
                    'errors'   => 'User not found'
                ], 404);
            }
        } catch (JWTException $e) {
            return response()->json([
                'success'  => false,
                'messgae'  => 'unauthorized',
                'errors'   => 'Invalid Token'
            ],400);
        }
        return response()->json([
            'success'  => true,
            'messgae'  => 'user fetched successfully',
            'user'   => $user
        ]);

    }

    public function logout() {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json([
            'success'  => true,
            'message' => 'Successfully logged out'
        ]);
    }

    public function verify_otp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'otp'     => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $user = User::find($request->user_id);
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                ], 404);
            }

            $identifier = "user_{$user->id}";
            $otpService = app(OtpService::class);

            if (!$otpService->verify($identifier, $request->otp)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired OTP',
                ], 400);
            }

            // Mark user as verified
            $user->email_verified_at = now();
            $user->status = 1; // assuming 1 means active
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'User verified successfully',
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Could not verify OTP, please try again later.',
                'error'   => $th->getMessage(), // For debugging; remove in production
            ], 500);
        }
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        $service = new PasswordService();

        try {
            $result = $service->changePassword(
                $request->user_id,
                $request->current_password,
                $request->new_password
            );

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message']
            ], $result['status']);

        } catch (\Throwable $th) {
            return response()->json([
                'success' => false,
                'message' => 'Could not change password, please try again later.',
                'error'   => $th->getMessage(), // remove in prod
            ], 500);
        }
    }

}
