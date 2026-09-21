<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class StatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $nama,
        public string $pesan,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: 'Pembaruan Layanan Kelurahan Betet — '.$this->pesan);
    }

    public function content(): Content
    {
        return new Content(view: 'mails.status');
    }
}