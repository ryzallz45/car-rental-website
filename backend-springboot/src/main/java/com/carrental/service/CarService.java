package com.carrental.service;

import com.carrental.model.Car;
import com.carrental.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {

    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public List<Car> getAllCars(String category, String transmission, String sort) {
        List<Car> cars;

        if (category != null && !category.isEmpty()) {
            cars = carRepository.findByCategory(category);
        } else if (transmission != null && !transmission.isEmpty()) {
            cars = carRepository.findAll().stream()
                    .filter(car -> car.getTransmission().equalsIgnoreCase(transmission))
                    .collect(Collectors.toList());
        } else {
            cars = carRepository.findAll();
        }

        if (sort != null) {
            switch (sort) {
                case "price-asc":
                    cars.sort(Comparator.comparingInt(Car::getPrice));
                    break;
                case "price-desc":
                    cars.sort(Comparator.comparingInt(Car::getPrice).reversed());
                    break;
                case "name":
                    cars.sort(Comparator.comparing(Car::getName));
                    break;
            }
        }

        return cars;
    }

    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found with id: " + id));
    }

    public Car createCar(Car car) {
        return carRepository.save(car);
    }

    public Car updateCar(Long id, Car carDetails) {
        Car car = getCarById(id);
        car.setName(carDetails.getName());
        car.setCategory(carDetails.getCategory());
        car.setPrice(carDetails.getPrice());
        car.setImage(carDetails.getImage());
        car.setSeats(carDetails.getSeats());
        car.setTransmission(carDetails.getTransmission());
        car.setFuel(carDetails.getFuel());
        car.setAvailable(carDetails.isAvailable());
        car.setDescription(carDetails.getDescription());
        return carRepository.save(car);
    }

    public void deleteCar(Long id) {
        Car car = getCarById(id);
        carRepository.delete(car);
    }
}
