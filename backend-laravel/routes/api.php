<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CarController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::get('cars', [CarController::class, 'index']);
Route::get('cars/{car}', [CarController::class, 'show']);
Route::post('bookings', [BookingController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::post('cars', [CarController::class, 'store']);
    Route::put('cars/{car}', [CarController::class, 'update']);
    Route::delete('cars/{car}', [CarController::class, 'destroy']);

    Route::get('bookings', [BookingController::class, 'index']);
    Route::get('bookings/{booking}', [BookingController::class, 'show']);
    Route::put('bookings/{booking}/status', [BookingController::class, 'updateStatus']);
    Route::delete('bookings/{booking}', [BookingController::class, 'destroy']);
});
