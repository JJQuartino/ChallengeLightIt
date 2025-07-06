<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePatientRequest;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Jobs\SendPatientRegistrationEmail;

class PatientController extends Controller
{
    public function listPatients()
    {
        try {
            $patients = Patient::all();
            
            return response()->json([
                'patients' => $patients
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error retrieving patients',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(StorePatientRequest $request)
    {
        try {
            
            $documentPath = null;
            if ($request->hasFile('document_photo')) {
                $documentPath = $request->file('document_photo')->store('patient_documents', 'public');
            }

            $patient = Patient::create([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'country_code' => $request->country_code,
                'phone_number' => $request->phone_number,
                'photo_path' => $documentPath,
            ]);

            SendPatientRegistrationEmail::dispatch($request->full_name, $request->email);

            return response()->json([
                'patient' => $patient
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}