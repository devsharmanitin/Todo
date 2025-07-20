<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id'          => 'required|exists:users,id',
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:6|confirmed',
        ];
    }
}