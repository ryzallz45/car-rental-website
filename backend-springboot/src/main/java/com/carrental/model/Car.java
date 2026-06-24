package com.carrental.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cars")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private int price;

    private String image;

    @Column(nullable = false)
    private int seats;

    @Column(nullable = false)
    private String transmission;

    @Column(nullable = false, columnDefinition = "VARCHAR(50) DEFAULT 'Bensin'")
    private String fuel = "Bensin";

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
    private boolean available = true;

    @Column(columnDefinition = "TEXT")
    private String description;
}
