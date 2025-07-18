<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Slack\SlackMessage;
use Illuminate\Support\Facades\Http;

class SlackNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public $user)
    {
        //
    }

    public function via(object $notifiable): array
    {
        return [];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    public function toSlack(object $notifiable): SlackMessage
    {
        return (new SlackMessage)
            ->text("🎉 New User Registered: {$this->user->name} ({$this->user->email})");
    }

    public function toArray(object $notifiable): array
    {
        return [];
    }


    public function handle()
    {
        $webhookUrl = config('services.slack.webhook_url');
        
        if (!$webhookUrl) {
            throw new \Exception('Slack webhook URL not configured');
        }

        $payload = [
            'text' => "🎉 New User Registered: {$this->user->name} ({$this->user->email})",
            'channel' => '#notifications',
            'username' => 'Laravel Bot',
            'icon_emoji' => ':bell:'
        ];

        Http::post($webhookUrl, $payload);
    }


}
