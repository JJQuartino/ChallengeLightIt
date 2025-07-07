<?php

namespace App\Jobs;

use Exception; 
use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendPatientSMS implements ShouldQueue
{
    use Queueable;
    
    public function __construct(public string $patientNumber)
    {
        
    }

    public function handle(): void
    {
        try
        {
            $accountSid = getenv("TWILIO_SID");
            $token = getenv("TWILIO_AUTH_TOKEN");
            $twilioNumber = getenv("TWILIO_NUMBER");
            $client = new Client($accountSid, $token);
            $client->messages->create($this->patientNumber, ['from' => $twilioNumber, 'body' => "This is a message from the clinic"] );

            Log::info("SMS sent successfully to ".$this->patientNumber);
        }
        catch(Exception $e)
        {
            Log::error("Could not send SMS to ".$this->patientNumber);
            throw $e;
        }
    }
}
