<?php

namespace App\Services\Otp;

use Illuminate\Support\Facades\Cache;

class OtpService
{
    public function generate(string $identifier, int $ttl = 300): int
    {
        $otp = rand(100000, 999999);
        Cache::put("otp_{$identifier}", $otp, $ttl);
        return $otp;
    }

    public function verify(string $identifier, string $input): array
    {
        $key = "otp_{$identifier}";
        $otp = Cache::get($key);

        if( !$otp) {
            return ['error_code' => 'OTP_EXPIRED', 'success' => false];
        }

        \Log::info("OTP verification", [
            'key' => $key,
            'cached' => $otp,
            'input' => $input,
            'types' => ['cached' => gettype($otp), 'input' => gettype($input)]
        ]);

        // Convert both to string before comparing
        if (!$otp || (string) $otp !== (string) $input) {
            return ['error_code' => 'OTP_INVALID', 'success' => false];
        }

        Cache::forget($key);
        return ['success' => true];
    }
}