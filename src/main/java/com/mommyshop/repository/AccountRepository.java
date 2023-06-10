package com.mommyshop.repository;

import com.mommyshop.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Integer> {

    @Query("SELECT a FROM Account a WHERE a.email LIKE ?1")
    Account findByEmail(String email);

    @Query("SELECT DISTINCT ar.account FROM Authority ar WHERE ar.role.id IN ('1','2')")
    List<Account> getAdministrators();

    @Query("SELECT DISTINCT ar.account FROM Authority ar WHERE ar.role.id IN ('1','2','3')")
    List<Account> getUser();

}
