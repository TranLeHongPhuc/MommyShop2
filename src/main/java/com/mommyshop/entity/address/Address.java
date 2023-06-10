package com.mommyshop.entity.address;

import com.mommyshop.entity.Account;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "addresses")
public class Address extends AddressAbstract {

    @Column
    private Boolean isDefault;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

}
