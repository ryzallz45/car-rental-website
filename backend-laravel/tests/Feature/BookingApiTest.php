<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookingApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_booking()
    {
        $car = Car::factory()->create(['price' => 100000]);

        $payload = [
            'car_id' => $car->id,
            'customer_name' => 'John Doe',
            'phone' => '08123456789',
            'email' => 'john@example.com',
            'address' => 'Jl. Merdeka No.1',
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-03',
        ];

        $response = $this->postJson('/api/bookings', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.customer_name', 'John Doe')
            ->assertJsonPath('data.days', 3)
            ->assertJsonPath('data.total_price', 300000);
    }

    public function test_validation_errors_on_booking()
    {
        $response = $this->postJson('/api/bookings', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['car_id', 'customer_name', 'phone', 'email', 'address', 'start_date', 'end_date']);
    }

    public function test_end_date_must_be_after_start_date()
    {
        $car = Car::factory()->create();

        $response = $this->postJson('/api/bookings', [
            'car_id' => $car->id,
            'customer_name' => 'John Doe',
            'phone' => '08123456789',
            'email' => 'john@example.com',
            'address' => 'Jl. Merdeka No.1',
            'start_date' => '2026-07-05',
            'end_date' => '2026-07-03',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['end_date']);
    }

    public function test_can_list_bookings_as_admin()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        Booking::factory()->count(3)->create();

        $response = $this->withToken($token)
            ->getJson('/api/bookings');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_cannot_list_bookings_without_auth()
    {
        $response = $this->getJson('/api/bookings');
        $response->assertUnauthorized();
    }

    public function test_can_view_booking_as_admin()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $booking = Booking::factory()->create();

        $response = $this->withToken($token)
            ->getJson("/api/bookings/{$booking->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $booking->id);
    }

    public function test_can_update_booking_status()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $booking = Booking::factory()->create(['status' => 'pending']);

        $response = $this->withToken($token)
            ->putJson("/api/bookings/{$booking->id}/status", ['status' => 'confirmed']);

        $response->assertOk()
            ->assertJsonPath('data.status', 'confirmed');
    }

    public function test_can_delete_booking_as_admin()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $booking = Booking::factory()->create();

        $response = $this->withToken($token)
            ->deleteJson("/api/bookings/{$booking->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('bookings', ['id' => $booking->id]);
    }

    public function test_can_get_my_bookings_as_authenticated_user()
    {
        $user = User::factory()->create(['email' => 'customer@test.com']);
        $token = $user->createToken('test')->plainTextToken;

        Booking::factory()->create(['email' => 'customer@test.com']);
        Booking::factory()->create(['email' => 'other@test.com']);

        $response = $this->withToken($token)
            ->getJson('/api/my-bookings');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_cannot_get_my_bookings_without_auth()
    {
        $response = $this->getJson('/api/my-bookings');
        $response->assertUnauthorized();
    }

    public function test_cannot_create_booking_with_non_existent_car()
    {
        $response = $this->postJson('/api/bookings', [
            'car_id' => 9999,
            'customer_name' => 'John Doe',
            'phone' => '08123456789',
            'email' => 'john@example.com',
            'address' => 'Jl. Merdeka No.1',
            'start_date' => '2026-07-01',
            'end_date' => '2026-07-03',
        ]);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['car_id']);
    }
}
