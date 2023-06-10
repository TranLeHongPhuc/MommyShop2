package com.mommyshop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldNameConstants;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@FieldNameConstants
@Table(name = "products")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Product implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "short_desc", length = 3000, columnDefinition = "TEXT")
    @Type(type = "text")
    private String shortDesc;

    @Column(name = "long_desc", length = 65535, columnDefinition = "TEXT")
    @Type(type = "text")
    private String longDesc;

    @Temporal(TemporalType.DATE)
    @Column(name = "create_date")
    private Date createDate = new Date();
    
    @Column(name = "in_stock")
    private Boolean inStock;

    @Column
    private float price;

    @Column
    private float discount;

    @Column(nullable = false)
    private Integer inventory;

    @Column(name = "main_image", length = 255)
    private String mainImage;

    @Column
    private Integer liked;

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<ProductImage> productImages = new ArrayList<>();

    @ManyToOne()
    @JoinColumn(name = "brand_id")
    private Brand brand;

    @ManyToOne()
    @JoinColumn(name = "category_id")
    private Category category;

    @OneToMany(mappedBy = "product")
    private List<ProductDetail> details = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<Rating> ratings = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<OrderDetail> orderDetails = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private List<Favorite> favorites = new ArrayList<>();

    public Product(Integer productId) {
        this.id = productId;
    }

    @Transient
    @JsonProperty
    public Float getRealPrice() {
        return this.price - (this.price * this.discount / 100);
    }

    @Transient
    @JsonProperty
    public Double getAvgRating() {
        int sum = 0;
        if (ratings.size() > 0) {
            for (Rating rating : ratings) {
                sum += rating.getStar();
            }
            double avg = (double) sum / ratings.size();
            return avg;
        } else {
            return (double) 0;
        }
    }

    @Transient
    @JsonProperty
    public Integer getSaled() {
        int sum = 0;
        if (orderDetails.size() > 0) {
            for (OrderDetail detail : orderDetails) {
                sum += detail.getQuantity();
            }
            return sum;
        } else {
            return 0;
        }
    }

}
