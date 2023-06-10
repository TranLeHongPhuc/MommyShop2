package com.mommyshop.repository;

import com.mommyshop.entity.Account;
import com.mommyshop.entity.Authority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;


public interface AuthorityRepository extends JpaRepository<Authority, Integer> {

    @Query("SELECT DISTINCT a FROM Authority a WHERE a.account IN ?1")
    List<Authority> authoritiesOf(List<Account> accounts);

    @Transactional
    @Modifying
    @Query("DELETE  FROM Authority r WHERE r.account.id = :id")
    void deleteAllByAccountId(@Param("id") Integer id);
}
