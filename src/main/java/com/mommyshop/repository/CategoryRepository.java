package com.mommyshop.repository;

import com.mommyshop.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Integer> {


    @Query(value = "SELECT * FROM categories LIMIT 6", nativeQuery = true)
    List<Category> findTop6Categories();

    @Query("SELECT c FROM Category c WHERE c.parentCategory = null")
    List<Category> getListParentCategories();

    @Query("SELECT c FROM Category c WHERE c.parentCategory != null")
    List<Category> getListChildCategories();

    @Modifying
    @Query(value = "SELECT * FROM categories  WHERE parent_id = :parentId", nativeQuery = true)
    @Transactional
    List<Category> getListChildCategoriesByParent(@Param("parentId") String parentId);

    @Query(value = "SELECT * FROM categories c \r\n"
            + "INNER JOIN categories temp\r\n"
            + "ON c.id = temp.parent_id\r\n"
            + "INNER JOIN products p\r\n"
            + "ON temp.id = p.category_id\r\n"
            + "INNER JOIN order_details od\r\n"
            + "ON p.id = od.product_id\r\n"
            + "GROUP BY c.id\r\n"
            + "ORDER BY SUM(od.quantity) DESC LIMIT 3", nativeQuery = true)
    List<Category> getTopListParentCategories();

    Category findFirstByName(String name);

    @Query("SELECT c FROM Category c WHERE (c.products.size > 0)")
    List<Category> getListChildCategoriesProductsExist();
}
