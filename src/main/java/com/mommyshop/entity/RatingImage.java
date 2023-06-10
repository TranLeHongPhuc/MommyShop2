package com.mommyshop.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity
@Table(name = "rating_images")
@NoArgsConstructor
@AllArgsConstructor
public class RatingImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @ManyToOne()
    @JoinColumn(name = "rating_id")
    private Rating rating;
}