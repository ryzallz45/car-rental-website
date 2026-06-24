<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'password123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['data' => ['user', 'token']]);
    }

    public function test_cannot_login_with_invalid_password()
    {
        $user = User::factory()->create([
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertUnauthorized()
            ->assertJson(['message' => 'Email atau password salah.']);
    }

    public function test_cannot_login_with_invalid_email()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'password123',
        ]);

        $response->assertUnauthorized()
            ->assertJson(['message' => 'Email atau password salah.']);
    }

    public function test_validation_errors_on_login()
    {
        $response = $this->postJson('/api/login', []);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('api-token')->plainTextToken;

        $response = $this->withToken($token)
            ->postJson('/api/logout');

        $response->assertOk()
            ->assertJson(['message' => 'Logout berhasil.']);
    }

    public function test_can_get_authenticated_user()
    {
        $user = User::factory()->create();
        $token = $user->createToken('api-token')->plainTextToken;

        $response = $this->withToken($token)
            ->getJson('/api/user');

        $response->assertOk()
            ->assertJsonPath('data.email', $user->email);
    }

    public function test_cannot_access_user_endpoint_without_auth()
    {
        $response = $this->getJson('/api/user');
        $response->assertUnauthorized();
    }

    public function test_cannot_access_logout_without_auth()
    {
        $response = $this->postJson('/api/logout');
        $response->assertUnauthorized();
    }
}
