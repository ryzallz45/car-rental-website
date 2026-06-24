<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Car;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        $start = fake()->dateTimeBetween('-1 month', '+1 month');
        $end = Carbon::parse($start)->addDays(fake()->numberBetween(1, 7));
        $car = Car::inRandomOrder()->first() ?? Car::factory()->create();
        $days = Carbon::parse($start)->diffInDays($end) + 1;

        return [
            'car_id' => $car->id,
            'customer_name' => fake()->name(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->email(),
            'address' => fake()->address(),
            'start_date' => $start,
            'end_date' => $end,
            'days' => $days,
            'total_price' => $days * $car->price,
            'status' => fake()->randomElement(['confirmed', 'pending', 'completed', 'cancelled']),
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
