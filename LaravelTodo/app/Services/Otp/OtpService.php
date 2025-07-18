<?php

namespace App\Services\Otp;

use Illuminate\Support\Facades\Cache;

class OtpService
{
    public function generate(string $identifier, int $ttl = 300): string
    {
        $otp = rand(100000, 999999);
        Cache::put("otp_{$identifier}", $otp, $ttl);
        return $otp;
    }

    public function verify(string $identifier, string $input): bool
    {
        $key = "otp_{$identifier}";
        $otp = Cache::get($key);

        \Log::info("OTP verification", [
            'key' => $key,
            'cached' => $otp,
            'input' => $input,
            'types' => ['cached' => gettype($otp), 'input' => gettype($input)]
        ]);

        // Convert both to string before comparing
        if (!$otp || (string) $otp !== (string) $input) {
            return false;
        }

        Cache::forget($key);
        return true;
    }
}