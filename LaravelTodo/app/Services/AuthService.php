<?php
namespace App\Services;

use App\Models\User;
use App\Events\UserRegistered;
use App\Services\Otp\OtpService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Notifications\SendOTPNotification;

class AuthService
{
    protected OtpService $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
        $this->user = auth()->user();
    }

    /**
     * Register a new user
     */
    public function register(array $data): array
    {
        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'username' => $data['username'],
                'password' => Hash::make($data['password']),
                'status' => 0, // Inactive until email verification
            ]);
            $user->assignRole('user');

            $token = JWTAuth::fromUser($user);

            // Send OTP for email verification
            // $this->sendVerificationOtp($user);

            event(new UserRegistered($user));

            DB::commit();

            return [
                'success' => true,
                'user' => $user,
                'token' => $token,
                'message' => 'Registration successful. Please verify your email.'
            ];

        } catch (JWTException $e) {
            DB::rollBack();
            \Log::error('JWT error during registration: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Registration failed due to token generation error'
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Registration error: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Registration failed'
            ];
        }
    }

    /**
     * Login user
     */
    public function login(array $credentials): array
    {
        try {
            $token = JWTAuth::attempt($credentials);

            if (!$token) {
                return [
                    'success' => false,
                    'message' => 'Invalid credentials'
                ];
            }

            $user = auth()->user();

            // Check if user account is active (if email verification is required)
            if (!$user->email_verified_at && config('auth.require_email_verification', true)) {
                // Send new OTP if user is not verified
                $this->sendVerificationOtp($user);
            }

            return [
                'success' => true,
                'user' => $user,
                'token' => $token,
                'message' => 'Login successful'
            ];

        } catch (JWTException $e) {
            \Log::error('JWT error during login: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Login failed due to authentication error'
            ];
        }
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(int $userId, string $otp): array
    {
        $user = User::find($userId);
        
        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found'
            ];
        }

        $identifier = "user_{$user->id}";
        $result = $this->otpService->verify($identifier, $otp);
        \Log::info("Result:- ", $result);
        if (!$result['success'] === true) {
            return [
                'success' => $result['success'],
                'message' => 'Invalid or Expired OTP',
            ];
        }
        \Log::info("update user");

        // Mark user as verified and active
        $user->update([
            'email_verified_at' => now(),
            'status' => 1 // Active
        ]);
        $user->save();

        return [
            'success' => true,
            'message' => 'Email verified successfully'
        ];
    }

    /**
     * Change user password
     */
    public function changePassword(int $userId, string $currentPassword, string $newPassword): array
    {
        $user = User::find($userId);

        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found'
            ];
        }

        if (!Hash::check($currentPassword, $user->password)) {
            return [
                'success' => false,
                'message' => 'Current password is incorrect'
            ];
        }

        $user->update([
            'password' => Hash::make($newPassword)
        ]);

        return [
            'success' => true,
            'message' => 'Password changed successfully'
        ];
    }

    /**
     * Resend OTP
     */
    public function resendOtp(int $userId): array
    {
        $user = User::find($userId);
        
        if (!$user) {
            return [
                'success' => false,
                'message' => 'User not found'
            ];
        }

        if ($user->email_verified_at) {
            return [
                'success' => false,
                'message' => 'Email is already verified'
            ];
        }

        try {
            $response = $this->sendVerificationOtp($user);
            if( $response ) {

                return [
                    'success' => true,
                    'message' => 'OTP sent successfully'
                ];
            }else {
                 return [
                    'success' => false,
                    'message' => 'Something went wrong'
                ];
            }

        } catch (\Exception $e) {
            \Log::error('Failed to resend OTP: ' . $e->getMessage());
            
            return [
                'success' => false,
                'message' => 'Failed to send OTP'
            ];
        }
    }

    /**
     * Send verification OTP
     */
    private function sendVerificationOtp(User $user): bool
    {
        $identifier = "user_{$user->id}";
        $otp = $this->otpService->generate($identifier); // This returns an int

        try {
            $user->notify(new SendOTPNotification($otp)); // No need to store $response, notify() returns void
            return true;
        } catch (\Throwable $th) {
            \Log::error("Failed to send OTP", ['error' => $th->getMessage()]);
            return false;
        }
    }
}