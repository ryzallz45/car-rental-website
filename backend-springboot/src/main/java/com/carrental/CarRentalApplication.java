package com.carrental;

import com.carrental.model.Car;
import com.carrental.repository.CarRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class CarRentalApplication {

    public static void main(String[] args) {
        SpringApplication.run(CarRentalApplication.class, args);
    }

    @Bean
    CommandLineRunner seedData(CarRepository carRepository) {
        return args -> {
            if (carRepository.count() == 0) {
                List<Car> cars = List.of(
                    createCar("Toyota Avanza", "MPV", 350000, "https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop", 7, "Manual", "Bensin", true, "MPV keluarga yang nyaman dan irit bahan bakar."),
                    createCar("Honda Civic", "Sedan", 500000, "https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop", 5, "Automatic", "Bensin", true, "Sedan sporty dengan performa tangguh."),
                    createCar("Daihatsu Xenia", "MPV", 300000, "https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop", 7, "Manual", "Bensin", true, "MPV irit untuk perjalanan keluarga."),
                    createCar("Toyota Innova", "MPV", 600000, "https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop", 7, "Manual", "Bensin", true, "MPV premium dengan kabin luas."),
                    createCar("Honda Brio", "Hatchback", 250000, "https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop", 5, "Manual", "Bensin", true, "Mobil hatchback lincah untuk kota."),
                    createCar("Toyota Fortuner", "SUV", 800000, "https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop", 7, "Automatic", "Bensin", true, "SUV tangguh untuk medan berat."),
                    createCar("Mitsubishi Pajero", "SUV", 900000, "https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop", 7, "Automatic", "Bensin", true, "SUV mewah dengan kemampuan off-road."),
                    createCar("Suzuki Ertiga", "MPV", 350000, "https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop", 7, "Manual", "Bensin", true, "MPV modern dengan desain stylish."),
                    createCar("Toyota Camry", "Sedan", 700000, "https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop", 5, "Automatic", "Bensin", true, "Sedan eksekutif dengan kenyamanan maksimal."),
                    createCar("Daihatsu Terios", "SUV", 400000, "https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop", 5, "Manual", "Bensin", true, "SUV kompak untuk petualangan."),
                    createCar("Honda CR-V", "SUV", 650000, "https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop", 5, "Automatic", "Bensin", true, "SUV premium dengan teknologi canggih."),
                    createCar("Toyota Alphard", "Luxury", 1500000, "https://images.unsplash.com/photo-1623869675781-51aa7ad5fec8?w=400&h=250&fit=crop", 7, "Automatic", "Bensin", true, "MPV mewah kelas atas."));
                carRepository.saveAll(cars);
            }
        };
    }

    private Car createCar(String name, String category, int price, String image, int seats, String transmission, String fuel, boolean available, String description) {
        Car car = new Car();
        car.setName(name);
        car.setCategory(category);
        car.setPrice(price);
        car.setImage(image);
        car.setSeats(seats);
        car.setTransmission(transmission);
        car.setFuel(fuel);
        car.setAvailable(available);
        car.setDescription(description);
        return car;
    }
}
