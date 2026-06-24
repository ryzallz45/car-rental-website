package com.carrental.service;

import com.carrental.model.Booking;
import com.carrental.model.Car;
import com.carrental.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CarService carService;

    public BookingService(BookingRepository bookingRepository, CarService carService) {
        this.bookingRepository = bookingRepository;
        this.carService = carService;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public Booking createBooking(Booking booking) {
        Car car = carService.getCarById(booking.getCarId());

        long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate());
        if (days <= 0) {
            throw new RuntimeException("End date must be after start date");
        }

        booking.setCarName(car.getName());
        booking.setDays((int) days);
        booking.setTotalPrice((int) days * car.getPrice());
        booking.setStatus("confirmed");

        return bookingRepository.save(booking);
    }

    public Booking updateBookingStatus(Long id, String status) {
        Booking booking = getBookingById(id);
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        Booking booking = getBookingById(id);
        bookingRepository.delete(booking);
    }
}
