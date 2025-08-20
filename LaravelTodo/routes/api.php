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

// public routes 
Route::prefix('auth')->group(function () {
    Route::post('/register', [JWTAuthController::class, 'register']);
    Route::post('/login', [JWTAuthController::class, 'login']);
    Route::post('/verify-otp', [JWTAuthController::class, 'verifyOtp']);
    Route::post('/resend-otp', [JWTAuthController::class, 'resendOtp']);
    Route::post('/refresh', [JWTAuthController::class, 'refreshToken']);
    
    // Move /me endpoint to auth prefix to match frontend expectations
    Route::get('/me', [JWTAuthController::class, 'getUser'])->middleware([JwtMiddleware::class]);
    Route::get('/check', [JWTAuthController::class, 'checkAuth'])->middleware([JwtMiddleware::class]);
});

// Protected routes requiring authentication
Route::middleware([JwtMiddleware::class])->group(function () {
    // User management - keep these for backward compatibility
    Route::get('/user', [JWTAuthController::class, 'getUser']);
    Route::get('/users', [JWTAuthController::class, 'getAllUsers']);
    Route::post('/logout', [JWTAuthController::class, 'logout']);
    Route::post('/change-password', [JWTAuthController::class, 'changePassword']);
    Route::post('/update-profile', [JWTAuthController::class, 'UpdateProfile']);
    
    // Routes requiring active user status
    Route::middleware([UserActiveStatus::class])->group(function () {
        Route::get('/dashboard', [TaskController::class, 'dashboard']);
        Route::post('/tasks/{id}/invite', [TaskController::class, 'inviteUser']);

        Route::prefix('tasks')->group(function () {
            Route::get('/', [TaskController::class, 'tasks']);
            Route::get('create', [TaskController::class, 'create']);
            Route::post('store', [TaskController::class, 'store']);
            Route::get('/{id}', [TaskController::class, 'view']);
            Route::post('update/{id}', [TaskController::class, 'update']);
            Route::delete('delete/{id}', [TaskController::class, 'destroy']);
        });

        Route::group(['prefix' => 'categories'], function () {
            Route::get('/', [CommonController::class, 'categories']);
            Route::post('create', [CommonController::class, 'storeCategory']);
            Route::post('update/{id}', [CommonController::class, 'updateCategory']);
            Route::post('delete/{id}', [CommonController::class, 'deleteCategory']);
        });

        Route::group(['prefix' => 'priorities'], function () {
            Route::get('/', [CommonController::class, 'priorities']);
            Route::post('create', [CommonController::class, 'storePriority']);
            Route::post('update/{id}', [CommonController::class, 'updatePriority']);
            Route::post('delete/{id}', [CommonController::class, 'deletePriority']);
        });

        Route::group(['prefix' => 'statuses'], function () {
            Route::get('/', [CommonController::class, 'statuses']);
            Route::post('create', [CommonController::class, 'storeStatus']);
            Route::post('update/{id}', [CommonController::class, 'updateStatus']);
            Route::post('delete/{id}', [CommonController::class, 'deleteStatus']);
        });
    });
});
