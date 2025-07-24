<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Middleware\UserActiveStatus;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CommonController;
use App\Http\Controllers\JWTAuthController;

Route::get('status', function( ) {
    return response()->json(['Route'=> 'api status', 'message' => 'api enabled']);
});
Route::post('register', [JWTAuthController::class, 'register']);
Route::post('login', [JWTAuthController::class, 'login']);
Route::post('verify-otp', [JWTAuthController::class, 'verify_otp']);
Route::post('auth/refresh', [JWTAuthController::class, 'refresh_token']);

Route::middleware([JwtMiddleware::class, UserActiveStatus::class])->group(function () {
    Route::get('user', [JWTAuthController::class, 'getuser']);
    Route::post('logout', [JWTAuthController::class, 'logout']);
    Route::get('dashboard', [TaskController::class, 'dashboard']);

    Route::group(['prefix' => 'tasks'], function () {
        Route::get('/', [TaskController::class, 'tasks']);
        Route::get('create', [TaskController::class, 'create']);
        Route::post('store', [TaskController::class, 'store']);
        Route::put('update', [TaskController::class, 'update']);
        Route::delete('delete', [TaskController::class, 'destroy']);
    });

    Route::group(['prefix' => 'categories'], function () {
        Route::get('/', [CommonController::class, 'categories']);
        Route::get('create', [TaskController::class, 'storeCategory']);
    });

    Route::group(['prefix' => 'priorities'], function () {
        Route::get('/', [CommonController::class, 'categories']);
        Route::get('create', [TaskController::class, 'storePriority']);
    });

    Route::group(['prefix' => 'statuses'], function () {
        Route::get('/', [CommonController::class, 'statuses']);
        Route::get('create', [TaskController::class, 'storeStatus']);
    });

});
