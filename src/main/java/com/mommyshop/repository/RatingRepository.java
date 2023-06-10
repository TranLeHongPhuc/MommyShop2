package com.mommyshop.repository;

import com.mommyshop.entity.Order;
import com.mommyshop.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Integer> {
    List<Rating> findByStar(Integer star);

    @Transactional
    @Modifying
    @Query("DELETE  FROM Rating r WHERE r.order.id = :id")
    void deleteAllByOrderId(@Param("id") Integer id);

    List<Rating> findByOrder(Order order);

    @Query("SELECT r FROM Rating r WHERE r.order.id = ?1")
    List<Rating> getByOrder(Integer id);

}
