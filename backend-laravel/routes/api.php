<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\CarController;
use App\Http\Controllers\Api\PromoController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\StatsController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:auth');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:auth');

Route::get('cars', [CarController::class, 'index']);
Route::get('cars/{car}', [CarController::class, 'show']);
Route::get('cars/{car}/reviews', [ReviewController::class, 'index']);
Route::post('reviews', [ReviewController::class, 'store']);
Route::post('promos/validate', [PromoController::class, 'validate']);
Route::post('bookings', [BookingController::class, 'store']);

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);

    Route::middleware(['admin'])->group(function () {
        Route::get('/stats', [StatsController::class, 'index']);

        Route::post('cars', [CarController::class, 'store']);
        Route::put('cars/{car}', [CarController::class, 'update']);
        Route::delete('cars/{car}', [CarController::class, 'destroy']);

        Route::get('bookings', [BookingController::class, 'index']);
        Route::get('bookings/{booking}', [BookingController::class, 'show']);
        Route::put('bookings/{booking}', [BookingController::class, 'update']);
        Route::put('bookings/{booking}/status', [BookingController::class, 'updateStatus']);
        Route::delete('bookings/{booking}', [BookingController::class, 'destroy']);
        Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);
        Route::get('promos', [PromoController::class, 'index']);
        Route::post('promos', [PromoController::class, 'store']);
        Route::put('promos/{promo}', [PromoController::class, 'update']);
        Route::delete('promos/{promo}', [PromoController::class, 'destroy']);
        Route::get('calendar', [CalendarController::class, 'index']);
    });
});
