package com.mommyshop.repository;

import com.mommyshop.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.Nullable;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

    @Query(value = "SELECT * FROM products ORDER BY create_date DESC LIMIT 16", nativeQuery = true)
    List<Product> getNewProduct();

    @Query(value = "SELECT *, count(od.product_id) FROM products p INNER JOIN order_details od "
        + "ON p.id = od.product_id "
        + "GROUP BY od.product_id "
        + "ORDER BY count(od.product_id) DESC "
        + "LIMIT 16", nativeQuery = true)
    List<Product> getSellingProduct();


    @Query(value = "SELECT * FROM products ORDER BY discount DESC LIMIT 1", nativeQuery = true)
    Product getProductDiscountest();

    @Query(value = "SELECT count(od.product_id) FROM products p INNER JOIN order_details od "
        + "ON p.id = od.product_id "
        + "GROUP BY od.product_id "
        + "ORDER BY p.discount DESC "
        + "LIMIT 1", nativeQuery = true)
    Integer getCountProductFeaturedest();

    @Query("SELECT p FROM Product p WHERE p.name LIKE %?1%")
    List<Product> getListByKeyword(String keyword);

    @Query("SELECT COUNT(p.id) FROM Product p")
    Integer getcountAllProducts();

    @Query(value = "SELECT * FROM products ORDER BY discount DESC LIMIT 6 OFFSET 1", nativeQuery = true)
    List<Product> getDiscountProduct();

    @Query("SELECT p FROM Product p WHERE p.category.id = ?1")
    List<Product> getListById(Integer id);

    @Query(value = "SELECT * FROM `products` WHERE `in_stock`=true AND MATCH(`name`, short_desc, long_desc) AGAINST (?1 IN BOOLEAN MODE)",
        nativeQuery = true)
    Page<Product> search(String keyword, Pageable pageable);

    @Query(value = "SELECT * FROM products p "
        + "INNER JOIN order_details od "
        + "ON p.id = od.product_id "
        + "GROUP BY od.product_id "
        + "ORDER BY SUM(quantity) DESC "
        + "LIMIT 1", nativeQuery = true)
    Product getProductMostWanted();

    @Query(value = "SELECT * FROM `products` WHERE `in_stock`=true AND `discount`>0"
        + " AND `create_date` BETWEEN NOW() - INTERVAL 15 DAY AND NOW()"
        + " AND MATCH(`name`, short_desc, long_desc) AGAINST (?1 IN BOOLEAN MODE)",
        nativeQuery = true)
    Page<Product> findDiscountAndNew(String keyword, Pageable pageable);

    @Query(value = "SELECT * FROM `products` WHERE `in_stock`=true AND (`discount`>0"
        + " OR `create_date` BETWEEN NOW() - INTERVAL 15 DAY AND NOW())",
        nativeQuery = true)
    Page<Product> findAllDiscountAndNew(@Nullable Specification<Product> specification, Pageable pageable);

    Product findFirstByCategoryId(Integer categoryId);
}
