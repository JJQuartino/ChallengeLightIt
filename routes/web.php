<?php

use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('PatientsView');
});

Route::post('/createPatient', [PatientController::class, 'store']);
Route::get('/listPatients', [PatientController::class, 'listPatients']); 

require __DIR__.'/auth.php';
