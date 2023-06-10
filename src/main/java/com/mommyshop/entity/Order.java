package com.mommyshop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mommyshop.entity.address.AddressAbstract;
import com.mommyshop.entity.enums.OrderPaymentStatus;
import com.mommyshop.entity.enums.OrderStatus;
import com.mommyshop.entity.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orders")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Order extends AddressAbstract {
    @Column
    private Date createDate;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    private OrderPaymentStatus orderPaymentStatus;
    
    @Column(length = 255)
    private String note;

    @Column(name = "email_anonymous", nullable = true, length = 255)
    private String emailAnonymous;

    @Column(name = "fullname_anonymous", nullable = true, length = 255)
    private String fullnameAnonymous;

    @Column(name = "phone_number_anonymous", nullable = true, length = 20)
    private String phoneNumberAnonymous;

    @Transient
    public String getAddress() {
        return this.addressLine1 + " - " + this.wardVillage + " - " + this.district + " - " + provinceCity;
    }

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @JsonIgnore
    @OneToMany(mappedBy = "order")
    private List<Rating> ratings;

    @JsonIgnore
    @OneToMany(mappedBy = "order")
    private List<OrderTrack> orderTracks;

    @JsonIgnore
    @OneToMany(mappedBy = "order")
    List<OrderDetail> orderDetails;
}
