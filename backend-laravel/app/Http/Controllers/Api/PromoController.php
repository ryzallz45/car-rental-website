<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PromoController extends Controller
{
    public function index(): JsonResponse
    {
        $promos = Promo::orderBy('created_at', 'desc')->get();
        return response()->json(['data' => $promos]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50|unique:promos,code',
            'discount_type' => 'required|in:percentage,fixed',
            'discount_value' => 'required|integer|min:1',
            'min_rental_days' => 'nullable|integer|min:1',
            'max_discount' => 'nullable|integer|min:1',
            'valid_from' => 'required|date',
            'valid_until' => 'required|date|after_or_equal:valid_from',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $promo = Promo::create($data);

        return response()->json(['data' => $promo], 201);
    }

    public function update(Request $request, Promo $promo): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|string|max:50|unique:promos,code,' . $promo->id,
            'discount_type' => 'sometimes|in:percentage,fixed',
            'discount_value' => 'sometimes|integer|min:1',
            'min_rental_days' => 'nullable|integer|min:1',
            'max_discount' => 'nullable|integer|min:1',
            'valid_from' => 'sometimes|date',
            'valid_until' => 'sometimes|date|after_or_equal:valid_from',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $promo->update($validator->validated());

        return response()->json(['data' => $promo]);
    }

    public function destroy(Promo $promo): JsonResponse
    {
        $promo->delete();
        return response()->json(null, 204);
    }

    public function validate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|max:50',
            'subtotal' => 'required|integer|min:0',
            'days' => 'nullable|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $promo = Promo::where('code', $request->code)->first();

        if (!$promo || !$promo->isValid($request->days ?? 0)) {
            return response()->json(['valid' => false, 'message' => 'Kode promo tidak valid atau sudah kadaluarsa.'], 422);
        }

        $discount = $promo->calculateDiscount($request->subtotal, $request->days ?? 0);

        return response()->json([
            'valid' => true,
            'promo' => $promo,
            'discount' => $discount,
        ]);
    }
}
