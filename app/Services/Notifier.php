<?php

namespace App\Services;

use App\Mail\StatusMail;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class Notifier
{
    public static function notify(User $user, string $message): void
    {
        $user->notifications()->create(['message' => $message]);

        if (!filter_var($user->email, FILTER_VALIDATE_EMAIL)) {
            return;
        }

        try {
            // Queue agar request tidak menunggu SMTP; butuh queue:work.
            Mail::to($user->email)->queue(new StatusMail(
                nama: $user->name,
                pesan: $message,
            ));
        } catch (\Throwable $e) {
            Log::error('Gagal antre email ke '.$user->email.': '.$e->getMessage());
        }
    }
}