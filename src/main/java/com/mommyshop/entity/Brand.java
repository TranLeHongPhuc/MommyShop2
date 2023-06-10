package com.mommyshop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "brands")
public class Brand implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 255, nullable = false)
    private String logo;

    @Column(length = 45, nullable = false)
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "brand")
    private List<Product> products;

//    @Transient
//    public String getlogoPath() {
//        return "/images/brands/" + this.logo;
//    }

}
