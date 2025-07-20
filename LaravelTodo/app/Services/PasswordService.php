<?php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PasswordService
{
    /**
     * Change the user's password.
     *
     * @param int $userId
     * @param string $currentPassword
     * @param string $newPassword
     * @return array
     */
    public function changePassword(int $userId, string $currentPassword, string $newPassword): array
    {
        $user = User::find($userId);

        if (!$user) {
            return [
                'success' => false,
                'status' => 404,
                'message' => 'User not found'
            ];
        }

        if (!Hash::check($currentPassword, $user->password)) {
            return [
                'success' => false,
                'status' => 400,
                'message' => 'Current password is incorrect'
            ];
        }

        $user->password = Hash::make($newPassword);
        $user->save();

        return [
            'success' => true,
            'status' => 200,
            'message' => 'Password changed successfully'
        ];
    }
}
