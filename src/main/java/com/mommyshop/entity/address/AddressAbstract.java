package com.mommyshop.entity.address;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@MappedSuperclass
public abstract class AddressAbstract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Integer id;

    @Column(name = "address_line_1", nullable = false, length = 255)
    protected String addressLine1;

    @Column(length = 45)
    protected String provinceCity;

    @Column(length = 45)
    protected String district;

    @Column(length = 45)
    protected String wardVillage;

    @Transient
    public String getAddress() {
        return addressLine1 + ", "
            + wardVillage + ", "
            + district + ", "
            + provinceCity;
    }
}
