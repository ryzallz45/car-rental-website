<?php

use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CarController;
use Illuminate\Support\Facades\Route;

Route::apiResource('cars', CarController::class);

Route::get('bookings', [BookingController::class, 'index']);
Route::post('bookings', [BookingController::class, 'store']);
Route::get('bookings/{booking}', [BookingController::class, 'show']);
Route::put('bookings/{booking}/status', [BookingController::class, 'updateStatus']);
Route::delete('bookings/{booking}', [BookingController::class, 'destroy']);
