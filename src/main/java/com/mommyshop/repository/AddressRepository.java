package com.mommyshop.repository;

import com.mommyshop.entity.address.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    @Modifying
    @Query("UPDATE Address a SET a.isDefault=true WHERE a.id=?1")
    void setDefaultAddress(Integer id);

    @Modifying
    @Query("UPDATE Address a SET a.isDefault=false WHERE a.id != ?1 AND a.account.id = ?2")
    void setNonDefaultForOthers(Integer defaultAddressId, Integer AccountId);

    @Query("SELECT a FROM Address a WHERE a.account.id=?1")
    List<Address> findAllByAccountId(Integer accountId);

    @Modifying
    @Query
    void deleteByIdAndAccountId(Integer addressId, Integer accountId);

    @Transactional
    @Modifying
    @Query("DELETE  FROM Address o WHERE o.account.id = ?1")
    void deleteAllByAccountId(Integer id);
}
