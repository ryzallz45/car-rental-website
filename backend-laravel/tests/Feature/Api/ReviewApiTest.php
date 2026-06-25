<?php

namespace Tests\Feature\Api;

use App\Models\Car;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_reviews_for_a_car()
    {
        $car = Car::factory()->create();
        Review::factory()->count(3)->create(['car_id' => $car->id]);

        $response = $this->getJson("/api/cars/{$car->id}/reviews");

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_review()
    {
        $car = Car::factory()->create();

        $response = $this->postJson('/api/reviews', [
            'car_id' => $car->id,
            'customer_name' => 'John Doe',
            'rating' => 5,
            'comment' => 'Mobil bagus dan nyaman!',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.customer_name', 'John Doe')
            ->assertJsonPath('data.rating', 5);
    }

    public function test_validation_errors_on_create()
    {
        $response = $this->postJson('/api/reviews', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['car_id', 'customer_name', 'rating']);
    }

    public function test_can_delete_review_as_admin()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $review = Review::factory()->create();

        $response = $this->withToken($token)
            ->deleteJson("/api/reviews/{$review->id}");

        $response->assertNoContent();
        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
    }

    public function test_cannot_delete_review_without_auth()
    {
        $review = Review::factory()->create();

        $response = $this->deleteJson("/api/reviews/{$review->id}");

        $response->assertUnauthorized();
    }
}
