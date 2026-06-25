<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Car;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function index(): JsonResponse
    {
        $totalCars = Car::count();
        $totalBookings = Booking::count();

        $revenue = Booking::whereIn('status', ['confirmed', 'completed'])
            ->sum('total_price');

        $bookingsByStatus = Booking::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $monthlyRevenue = Booking::whereIn('status', ['confirmed', 'completed'])
            ->select(DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month"), DB::raw('sum(total_price) as revenue'), DB::raw('count(*) as bookings'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $recentBookings = Booking::with('car')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'customer_name' => $b->customer_name,
                    'car_name' => $b->car->name ?? '-',
                    'total_price' => $b->total_price,
                    'status' => $b->status,
                    'created_at' => $b->created_at->format('d M Y'),
                ];
            });

        return response()->json([
            'data' => [
                'total_cars' => $totalCars,
                'total_bookings' => $totalBookings,
                'total_revenue' => $revenue,
                'bookings_by_status' => $bookingsByStatus,
                'monthly_revenue' => $monthlyRevenue,
                'recent_bookings' => $recentBookings,
            ],
        ]);
    }
}
