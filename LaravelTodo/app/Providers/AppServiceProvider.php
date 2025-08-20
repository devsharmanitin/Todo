<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;   // ✅ correct
use App\Models\Task; 

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    
    public function boot(): void
    {
        Gate::define('CAN_EDIT', function (User $user, Task $task) {
            return $task->checkPermission($user, 'CAN_EDIT');
        });

        Gate::define('CAN_VIEW', function (User $user, Task $task) {
            return $task->checkPermission($user, 'CAN_VIEW');
        });

        Gate::define('CAN_DELETE', function (User $user, Task $task) {
            return $task->checkPermission($user, 'CAN_DELETE');
        });

        Gate::define('CAN_INVITE', function (User $user, Task $task) {
            return $task->checkPermission($user, 'CAN_INVITE');
        });
    }
}
