package com.mommyshop.repository;

import com.mommyshop.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {

    @Query("SELECT pi FROM ProductImage pi WHERE pi.product.id = ?1")
    List<ProductImage> findByProduct(Integer id);

    @Transactional
    @Modifying
    @Query("DELETE  FROM ProductImage c  WHERE c.product.id=:id")
    void deleteByProduct(@Param("id") Integer id);


}
