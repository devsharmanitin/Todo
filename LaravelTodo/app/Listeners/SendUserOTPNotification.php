<?php

namespace App\Listeners;

use App\Events\UserRegistered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Services\Otp\OtpService;
use App\Notifications\SendOtpNotification;
use App\Notifications\SlackNotification;

class SendUserOTPNotification
{
    /**
     * Create the event listener.
     */
    public function __construct(protected OtpService $otpService)
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(UserRegistered $event): void
    {
        //
        $user = $event->user;
        $otp = $this->otpService->generate("user_{$user->id}");


        /**
         * Trigger Otp notificatios
         * App\Notifications\SendOTPNotification
         * 
         */
        // $user->notify(new SendOTPNotification($otp));


        /**
         * Trigger Slack notificatios
         * App\Notifications\SendOTPNotification
         * Uses Slack Api 
         */
        
        $user->notify(new SlackNotification($user));

        /**
         * Uses Slack Webhook
         */
        $notification = new SlackNotification($user);
        $notification->handle();
    }
}
