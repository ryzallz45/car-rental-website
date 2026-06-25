<?php

namespace Tests\Feature\Api;

use App\Models\Booking;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CalendarApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_get_calendar_bookings()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        Booking::factory()->create([
            'start_date' => Carbon::today()->startOfMonth()->addDays(5),
            'end_date' => Carbon::today()->startOfMonth()->addDays(7),
        ]);

        $response = $this->withToken($token)
            ->getJson('/api/calendar?year=' . now()->year . '&month=' . now()->month);

        $response->assertOk()
            ->assertJsonStructure(['data', 'year', 'month']);
    }

    public function test_cannot_get_calendar_without_auth()
    {
        $response = $this->getJson('/api/calendar');
        $response->assertUnauthorized();
    }
}
