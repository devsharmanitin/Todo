<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users,email,' . auth()->id(),
            'username' => 'required|string|min:4|unique:users,username,' . auth()->id(),
            'password' => 'sometimes|string|min:8',
            'phone'    => 'sometimes|min:10',
            'address'  => 'sometimes|string',
            'city'     => 'sometimes|string',
            'state'    => 'sometimes|string',
            'country'  => 'sometimes|string',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'     => 'Name is required',
            'name.max'          => 'Name cannot exceed 255 characters',
            'email.required'    => 'Email address is required',
            'email.email'       => 'Please provide a valid email address',
            'email.unique'      => 'This email address is already registered',
            'username.required' => 'Username is required',
            'username.unique'   => 'This username is already taken',
            'username.min'      => 'Username must be at least 4 characters long',
            'password.required' => 'Password is required',
            'password.min'      => 'Password must be at least 8 characters long',
            'phone.numeric'    => 'Number must be numeric',
            'phone.digits_between' => 'Number must be between 10 and 15 digits',
        ];
    }
}
