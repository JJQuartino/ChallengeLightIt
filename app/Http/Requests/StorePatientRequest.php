<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePatientRequest extends FormRequest
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
            'full_name' => ['required', 'regex:/^[\pL\s]+$/u'],
            'email' => ['required', 'email', 'ends_with:@gmail.com', 'unique:patients,email'],
            'country_code' => ['required', 'regex:/^\+\d{1,4}$/'],
            'phone_number' => ['required', 'digits_between:5,15'],
            'document_photo' => ['required', 'image', 'mimes:jpg', 'max:2048'],
        ];
    }
}
