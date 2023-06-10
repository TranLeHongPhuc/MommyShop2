package com.mommyshop.repository;

import com.mommyshop.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BrandRepository extends JpaRepository<Brand, Integer> {

    @Query(value = "SELECT * FROM brands b\r\n"
            + "INNER JOIN products p\r\n"
            + "ON b.id = p.brand_id\r\n"
            + "INNER JOIN order_details od\r\n"
            + "ON p.id = od.product_id\r\n"
            + "GROUP BY b.id\r\n"
            + "ORDER BY SUM(od.quantity) DESC LIMIT 12", nativeQuery = true)
    List<Brand> getTopBrands();

    @Query("SELECT b FROM Brand b WHERE (b.products.size > 0)")
    List<Brand> getAllBrandProductsExist();
}
