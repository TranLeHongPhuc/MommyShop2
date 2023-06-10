package com.mommyshop.repository;

import com.mommyshop.entity.RatingImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface RatingImageRepository extends JpaRepository<RatingImage, Integer> {

    @Query("SELECT pi FROM RatingImage pi WHERE pi.rating.id = ?1")
    List<RatingImage> findByRating(Integer id);

    @Transactional
    @Modifying
    @Query("DELETE  FROM RatingImage c  WHERE c.rating.id=:id")
    void deleteByRatingId(@Param("id") Integer id);

    @Transactional
    @Modifying
    @Query("DELETE  FROM RatingImage o WHERE o.rating.id = :id")
    void deleteAllByRatingId(@Param("id") Integer id);


}
