package com.mommyshop.repository;

import com.mommyshop.entity.OrderTrack;
import com.mommyshop.entity.enums.OrderStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderTrackRepository extends JpaRepository<OrderTrack, Integer> {

    @Query("SELECT ot FROM OrderTrack ot WHERE ot.order.id = ?1")
    List<OrderTrack> findByOrder(Integer id);
    
    @Modifying
    @Query("UPDATE OrderTrack o SET o.note = ?2 WHERE o.id = ?1")
    OrderTrack updateOrderStatusNote(Integer id, String note);
    
    @Query("SELECT ot FROM OrderTrack ot WHERE ot.order.id = ?1 and ot.orderStatus = ?2")
    OrderTrack findByOrderAndStatus(Integer id, OrderStatus status);
    
}
