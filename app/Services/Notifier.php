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
            Mail::to($user->email)->send(new StatusMail(
                nama: $user->name,
                pesan: $message,
            ));
        } catch (\Throwable $e) {
            Log::error('Gagal kirim email ke '.$user->email.': '.$e->getMessage());
        }
    }
}