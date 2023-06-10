package com.mommyshop.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mommyshop.entity.address.Address;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("serial")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "accounts")
public class Account implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String fullname;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column
    private boolean enabled;

    @Column(nullable = false, length = 64)
    private String password;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 255)
    private String photo;

    @JsonIgnore
    @OneToMany(mappedBy = "account", fetch = FetchType.EAGER)
    private List<Authority> authorities;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<Order> orders = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<Favorite> favorites = new ArrayList<>();

    @Column(nullable = false, length = 20)
    private String verificationToken;

    @JsonIgnore
    @OneToMany(mappedBy = "account")
    private List<Address> addresses = new ArrayList<>();

    public Account(Integer accountId) {
        this.id = accountId;
    }
}
