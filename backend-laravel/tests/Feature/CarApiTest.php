<?php

namespace Tests\Feature;

use App\Models\Car;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CarApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_cars()
    {
        Car::factory()->count(5)->create();

        $response = $this->getJson('/api/cars');

        $response->assertOk()
            ->assertJsonCount(5, 'data');
    }

    public function test_can_show_car()
    {
        $car = Car::factory()->create();

        $response = $this->getJson("/api/cars/{$car->id}");

        $response->assertOk()
            ->assertJsonPath('data.id', $car->id);
    }

    public function test_returns_404_for_missing_car()
    {
        $response = $this->getJson('/api/cars/9999');

        $response->assertNotFound();
    }

    public function test_can_create_car_as_admin()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $payload = [
            'name' => 'Toyota Avanza',
            'category' => 'MPV',
            'price' => 350000,
            'seats' => 7,
            'transmission' => 'Manual',
        ];

        $response = $this->withToken($token)
            ->postJson('/api/cars', $payload);

        $response->assertCreated()
            ->assertJsonPath('data.name', 'Toyota Avanza');
    }

    public function test_cannot_create_car_without_auth()
    {
        $payload = [
            'name' => 'Toyota Avanza',
            'category' => 'MPV',
            'price' => 350000,
            'seats' => 7,
            'transmission' => 'Manual',
        ];

        $response = $this->postJson('/api/cars', $payload);

        $response->assertUnauthorized();
    }

    public function test_validation_errors_on_create()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/cars', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'category', 'price', 'seats', 'transmission']);
    }

    public function test_can_update_car()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $car = Car::factory()->create();

        $response = $this->withToken($token)
            ->putJson("/api/cars/{$car->id}", ['name' => 'Updated Name']);

        $response->assertOk()
            ->assertJsonPath('data.name', 'Updated Name');
    }

    public function test_can_delete_car()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $car = Car::factory()->create();

        $response = $this->withToken($token)
            ->deleteJson("/api/cars/{$car->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('cars', ['id' => $car->id]);
    }

    public function test_cannot_delete_car_without_auth()
    {
        $car = Car::factory()->create();

        $response = $this->deleteJson("/api/cars/{$car->id}");

        $response->assertUnauthorized();
    }
}
