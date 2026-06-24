<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@rentalmobil.com',
            'password' => bcrypt('admin123'),
        ]);

        Car::create([
            'name' => 'Toyota Avanza',
            'category' => 'MPV',
            'price' => 350000,
            'image' => 'https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop',
            'seats' => 7,
            'transmission' => 'Manual',
            'fuel' => 'Bensin',
            'available' => true,
            'description' => 'Mobil keluarga MPV yang nyaman dan irit bahan bakar, cocok untuk perjalanan sehari-hari.',
        ]);

        Car::create([
            'name' => 'Honda Civic',
            'category' => 'Sedan',
            'price' => 500000,
            'image' => 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=250&fit=crop',
            'seats' => 5,
            'transmission' => 'Automatic',
            'fuel' => 'Bensin',
            'available' => true,
            'description' => 'Sedan sporty dengan desain stylish dan performa mesin yang responsif.',
        ]);

        Car::create([
            'name' => 'Daihatsu Xenia',
            'category' => 'MPV',
            'price' => 300000,
            'image' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=250&fit=crop',
            'seats' => 7,
            'transmission' => 'Manual',
            'fuel' => 'Bensin',
            'available' => true,
            'description' => 'MPV murah dan irit, pilihan tepat untuk transportasi keluarga.',
        ]);

        Car::create([
            'name' => 'Toyota Innova',
            'category' => 'MPV',
            'price' => 600000,
            'image' => 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=250&fit=crop',
            'seats' => 7,
            'transmission' => 'Manual',
            'fuel' => 'Bensin',
            'available' => true,
            'description' => 'MPV premium dengan kabin luas dan kenyamanan terbaik untuk perjalanan jauh.',
        ]);

        Car::create([
            'name' => 'Honda Brio',
            'category' => 'Hatchback',
            'price' => 250000,
            'image' => 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=250&fit=crop',
            'seats' => 5,
            'transmission' => 'Manual',
            'fuel' => 'Bensin',
            'available' => true,
            'description' => 'Mobil city car yang lincah dan irit, ideal untuk mobilitas di perkotaan.',
        ]);

        Car::create([
            'name' => 'Toyota Fortuner',
            'category' => 'SUV',
            'price' => 800000,
            'image' => 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=250&fit=crop',
            'seats' => 7,
            'transmission' => 'Automatic',
            'fuel' => 'Bensin',
            'available' => true,
            'description' => 'SUV tangguh dengan ground clearance tinggi, cocok untuk medan berat dan off-road.',
        ]);

        Car::create([
            'name' => 'Mitsubishi Pajero',
            'category' => 'SUV',
            'price' => 900000,
            'image' => 'https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?w=400&h=250&fit=crop',
            'seats' => 7,
            'transmission' => 'Automatic',
            'fuel' => 'Bensin',
            'available' => true,
            'description' => 'SUV mewah dengan performa off-road unggulan dan interior premium.',
        ]);

        Car::create([
            'name' => 'Suzuki Ertiga',
            'category' => 'MPV',
            'price' => 350000,
            'image' => 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop',
            'seats' => 7,
            'transmission' => 'Manual',
            'fuel' => 'Bensin',
            'available' => true,
            'description' => 'MPV kompak dengan kabin lega dan konsumsi bahan bakar yang efisien.',
        ]);

        Car::create([
            'name' => 'Toyota Camry',
            'category' => 'Sedan',
            'price' => 700000,
            'image' => 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop',
            'seats' => 5,
            'transmission' => 'Automatic',
            'fuel' => 'Bensin',
            'available' => true,
            'description' => 'Sedan eksekutif dengan kenyamanan maksimal dan fitur keselamatan lengkap.',
        ]);

        Car::create([
            'name' => 'Daihatsu Terios',
            'category' => 'SUV',
            'price' => 400000,
            'image' => 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
            'seats' => 5,
            'transmission' => 'Manual',
            'fuel' => 'Bensin',
            'available' => true,
            'description' => 'SUV kompak yang gesit di perkotaan dengan ground clearance yang memadai.',
        ]);

        Car::create([
            'name' => 'Honda CR-V',
            'category' => 'SUV',
            'price' => 650000,
            'image' => 'https://images.unsplash.com/photo-1568844293986-ca7db1c22b9a?w=400&h=250&fit=crop',
            'seats' => 5,
            'transmission' => 'Automatic',
            'fuel' => 'Bensin',
            'available' => true,
            'description' => 'SUV premium dengan desain elegan dan kenyamanan berkendara yang superior.',
        ]);

        Car::create([
            'name' => 'Toyota Alphard',
            'category' => 'Luxury',
            'price' => 1500000,
            'image' => 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=400&h=250&fit=crop',
            'seats' => 7,
            'transmission' => 'Automatic',
            'fuel' => 'Bensin',
            'available' => true,
            'description' => 'MPV mewah kelas atas dengan fasilitas bintang lima dan kenyamanan tiada tara.',
        ]);
    }
}
