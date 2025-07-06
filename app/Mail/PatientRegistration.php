<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Patient;

class PatientRegistration extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $patientName)
    {
        
    }

    /**
     * El envelope define cosas como la metadata y la información de ruteo.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Patient Registration',
        );
    }
    
    public function content(): Content
    {
        return new Content(
            view: 'emails.patient-registration',
            with: [
                'patientName' => $this->patientName,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
