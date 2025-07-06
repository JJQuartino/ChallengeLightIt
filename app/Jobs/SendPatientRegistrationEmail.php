<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use App\Mail\PatientRegistration;
//use App\Models\Patient;

class SendPatientRegistrationEmail implements ShouldQueue
{
    //Dispatchable permite usar dispatch(), InteractsWithQueue es para controlar la cola, Queueable es para configurar la cola
    use Dispatchable, InteractsWithQueue, Queueable;

    public function __construct(public string $patientName, public string $patientEmail)
    {
        //Las propiedades se asignan automáticamente con los parámetros del constructor
    }

    public function handle(): void
    {
        Mail::to($this->patientEmail)->send(new PatientRegistration($this->patientName));
    }
}
