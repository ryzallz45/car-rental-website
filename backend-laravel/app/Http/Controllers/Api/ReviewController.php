<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index(Car $car): JsonResponse
    {
        $reviews = $car->reviews()->latest()->get();
        return response()->json(['data' => $reviews]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'car_id' => 'required|exists:cars,id',
            'customer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['user_id'] = auth()->check() ? auth()->id() : null;

        $review = Review::create($data);
        $review->load('user');

        return response()->json(['data' => $review], 201);
    }

    public function destroy(Review $review): JsonResponse
    {
        $review->delete();
        return response()->json(null, 204);
    }
}
