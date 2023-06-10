package com.mommyshop.repository;

import com.mommyshop.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface CartRepository extends JpaRepository<CartItem, Integer> {

    @Query(value = "SELECT * FROM cart_items LIMIT 6", nativeQuery = true)
    List<CartItem> findTop6Carts();

    @Query("SELECT c FROM CartItem c WHERE  c.account.email=:email")
    List<CartItem> getByAccount(@Param("email") String email);

    @Query("SELECT c FROM CartItem c WHERE  c.product.id=:id")
    List<CartItem> getByProduct(@Param("id") Integer id);

    @Query("SELECT c FROM CartItem c WHERE c.product.id=:pid and c.account.email=:email")
    CartItem getByProductAndAccount(@Param("pid") Integer pid, @Param("email") String email);

    @Query("DELETE  FROM CartItem c WHERE c.product.id=:pid and c.account.email=:email")
    List<CartItem> deleteByProductAndAccount(@Param("pid") Integer pid, @Param("email") String email);

    @Transactional
    @Modifying
    @Query("DELETE  FROM CartItem c  WHERE c.account.id=:id")
    void deleteByAccount(@Param("id") Integer id);


}
