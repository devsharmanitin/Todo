<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

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
        //
        Gate::define('CAN_EDIT', function(USER $user, Task $task) {
            return $task->checkPermission($user, 'CAN_EDIT');
        });

        Gate::define('CAN_VIEW', function(USER $user, TASK $task) {
            return $task->checkPermission($user, 'CAN_VIEW');
        });

        Gate::define('CAN_DELETE', function(USer $user, TASK $task){
            return $task->checkPermission($user, 'CAN_DELETE');
        });

        Gate::define('CAN_INVITE', function(USer $user, TASK $task){
            return $task->checkPermission($user, 'CAN_INVITE');
        });
    }
}
