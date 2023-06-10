package com.mommyshop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "ratings")
@NoArgsConstructor
@AllArgsConstructor
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column
    private Integer star;

    @Temporal(TemporalType.DATE)
    @Column(name = "rating_date")
    private Date ratingDate = new Date();

    @Column(length = 50, columnDefinition = "TEXT")
    @Type(type = "text")
    private String features;

    @Column(length = 255, columnDefinition = "TEXT")
    @Type(type = "text")
    private String review;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @JsonIgnore
    @OneToMany(mappedBy = "rating")
    private List<RatingImage> ratingImages = new ArrayList<>();
}
