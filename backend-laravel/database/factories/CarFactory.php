<?php

namespace Database\Factories;

use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;

class CarFactory extends Factory
{
    protected $model = Car::class;

    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Toyota Avanza', 'Honda Brio', 'Mitsubishi Xpander', 'Daihatsu Terios', 'Toyota Fortuner', 'Honda Civic']),
            'category' => fake()->randomElement(['MPV', 'SUV', 'Sedan', 'Hatchback']),
            'price' => fake()->numberBetween(200000, 1500000),
            'image' => fake()->imageUrl(),
            'seats' => fake()->randomElement([4, 6, 7]),
            'transmission' => fake()->randomElement(['Manual', 'Automatic']),
            'fuel' => fake()->randomElement(['Bensin', 'Solar']),
            'available' => true,
            'description' => fake()->sentence(),
        ];
    }
}
