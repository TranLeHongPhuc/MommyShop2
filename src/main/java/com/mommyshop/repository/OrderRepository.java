package com.mommyshop.repository;

import com.mommyshop.entity.Order;
import com.mommyshop.entity.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface OrderRepository extends JpaRepository<Order, Integer> {

    @Query("SELECT o FROM Order o WHERE o.account.id = ?1")
    List<Order> findByAccount(Integer id);

    Page<Order> findAll(Pageable pageable);

    @Modifying
    @Query("UPDATE Order o SET o.orderStatus = ?2 WHERE o.id = ?1")
    void updateOrderStatus(Integer id, OrderStatus orderStatus);

}
