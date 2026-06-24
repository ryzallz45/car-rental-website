<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Car;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CarController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->integer('per_page', 12);
        $cars = Car::paginate($perPage);
        return response()->json($cars);
    }

    public function show(Car $car): JsonResponse
    {
        return response()->json(['data' => $car]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|in:MPV,SUV,Sedan,Hatchback,Luxury',
            'price' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'seats' => 'required|integer|min:1',
            'transmission' => 'required|string|in:Manual,Automatic',
            'fuel' => 'nullable|string|max:50',
            'available' => 'nullable|boolean',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('cars', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $car = Car::create($data);
        return response()->json(['data' => $car], 201);
    }

    public function update(Request $request, Car $car): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|in:MPV,SUV,Sedan,Hatchback,Luxury',
            'price' => 'sometimes|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'seats' => 'sometimes|integer|min:1',
            'transmission' => 'sometimes|string|in:Manual,Automatic',
            'fuel' => 'nullable|string|max:50',
            'available' => 'nullable|boolean',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('cars', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $car->update($data);
        return response()->json(['data' => $car]);
    }

    public function destroy(Car $car): JsonResponse
    {
        $car->delete();
        return response()->json(null, 204);
    }
}
