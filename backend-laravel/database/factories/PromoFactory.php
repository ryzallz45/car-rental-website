<?php

namespace Database\Factories;

use App\Models\Promo;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Promo>
 */
class PromoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->lexify('??????')),
            'discount_type' => fake()->randomElement(['percentage', 'fixed']),
            'discount_value' => fake()->numberBetween(10, 50),
            'min_rental_days' => null,
            'max_discount' => null,
            'valid_from' => now()->subDay(),
            'valid_until' => now()->addMonth(),
            'usage_limit' => null,
            'used_count' => 0,
            'is_active' => true,
        ];
    }
}
