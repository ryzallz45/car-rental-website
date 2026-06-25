<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Promo;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 10);
        $query = Booking::with('car');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('customer_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $bookings = $query->orderBy('created_at', 'desc')->paginate($perPage);
        return response()->json($bookings);
    }

    public function show(Booking $booking): JsonResponse
    {
        $booking->load('car');
        return response()->json(['data' => $booking]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'car_id' => 'required|exists:cars,id',
            'customer_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'address' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'nullable|string|in:confirmed,pending,completed,cancelled',
            'notes' => 'nullable|string',
            'promo_code' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        $car = \App\Models\Car::findOrFail($data['car_id']);
        $start = Carbon::parse($data['start_date']);
        $end = Carbon::parse($data['end_date']);
        $data['days'] = $start->diffInDays($end) + 1;
        $subtotal = $data['days'] * $car->price;

        $data['discount_amount'] = 0;
        unset($data['promo_code']);

        if (!empty($request->promo_code)) {
            $promo = Promo::where('code', $request->promo_code)->first();
            if ($promo && $promo->isValid($data['days'])) {
                $discount = $promo->calculateDiscount($subtotal, $data['days']);
                $data['discount_amount'] = $discount;
                $data['promo_id'] = $promo->id;
                $promo->increment('used_count');
            }
        }

        $data['total_price'] = $subtotal - $data['discount_amount'];

        $booking = Booking::create($data);
        $booking->load('car', 'promo');

        return response()->json(['data' => $booking], 201);
    }

    public function updateStatus(Request $request, Booking $booking): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:confirmed,pending,completed,cancelled',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $booking->update(['status' => $request->status]);
        $booking->load('car');

        return response()->json(['data' => $booking]);
    }

    public function update(Request $request, Booking $booking): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'car_id' => 'sometimes|exists:cars,id',
            'customer_name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:20',
            'email' => 'sometimes|email|max:255',
            'address' => 'sometimes|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'status' => 'nullable|string|in:confirmed,pending,completed,cancelled',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if (isset($data['car_id']) || isset($data['start_date']) || isset($data['end_date'])) {
            $car = \App\Models\Car::findOrFail($data['car_id'] ?? $booking->car_id);
            $start = Carbon::parse($data['start_date'] ?? $booking->start_date);
            $end = Carbon::parse($data['end_date'] ?? $booking->end_date);
            $data['days'] = $start->diffInDays($end) + 1;
            $data['total_price'] = $data['days'] * $car->price - $booking->discount_amount;
        }

        $booking->update($data);
        $booking->load('car', 'promo');

        return response()->json(['data' => $booking]);
    }

    public function destroy(Booking $booking): JsonResponse
    {
        $booking->delete();
        return response()->json(null, 204);
    }

    public function myBookings(): JsonResponse
    {
        $user = auth()->user();
        $bookings = Booking::with('car')
            ->where('email', $user->email)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['data' => $bookings]);
    }
}
