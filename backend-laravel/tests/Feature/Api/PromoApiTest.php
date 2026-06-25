<?php

namespace Tests\Feature\Api;

use App\Models\Car;
use App\Models\Promo;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PromoApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_validate_valid_promo()
    {
        $car = Car::factory()->create(['price' => 100000]);
        $promo = Promo::factory()->create([
            'code' => 'PROMO50',
            'discount_type' => 'percentage',
            'discount_value' => 50,
            'max_discount' => 100000,
            'valid_from' => Carbon::today()->subDay(),
            'valid_until' => Carbon::today()->addMonth(),
            'is_active' => true,
        ]);

        $response = $this->postJson('/api/promos/validate', [
            'code' => 'PROMO50',
            'subtotal' => 500000,
            'days' => 5,
        ]);

        $response->assertOk()
            ->assertJson(['valid' => true])
            ->assertJsonPath('discount', 100000);
    }

    public function test_rejects_invalid_promo()
    {
        $response = $this->postJson('/api/promos/validate', [
            'code' => 'INVALID',
            'subtotal' => 500000,
        ]);

        $response->assertStatus(422);
    }

    public function test_admin_can_create_promo()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/promos', [
                'code' => 'DISKON20',
                'discount_type' => 'percentage',
                'discount_value' => 20,
                'valid_from' => Carbon::today()->toDateString(),
                'valid_until' => Carbon::today()->addMonth()->toDateString(),
            ]);

        $response->assertCreated()
            ->assertJsonPath('data.code', 'DISKON20');
    }

    public function test_admin_can_delete_promo()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $promo = Promo::factory()->create();

        $response = $this->withToken($token)
            ->deleteJson("/api/promos/{$promo->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('promos', ['id' => $promo->id]);
    }
}
