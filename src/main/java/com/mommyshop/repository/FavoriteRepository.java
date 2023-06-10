package com.mommyshop.repository;

import com.mommyshop.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

@Transactional
public interface FavoriteRepository extends JpaRepository<Favorite, Integer> {
    @Query("SELECT o FROM Favorite o WHERE o.account.id = ?1")
    List<Favorite> getListF_ByAccountId(Integer id);

    @Query("SELECT f FROM Favorite f WHERE f.account.id = ?1")
    List<Favorite> findByAccount(Integer id);

    @Query("SELECT COUNT(f) FROM Favorite f WHERE f.account.id = ?1")
    Integer countFavoriteByAccount(Integer accountId);

    @Query("SELECT f FROM Favorite f WHERE f.product.id = ?1 AND f.account.id = ?2")
    Favorite getByProductAndAccount(Integer pid, Integer aid);

    @Transactional
    @Modifying
    @Query("DELETE  FROM Favorite r WHERE r.account.id = :id")
    void deleteAllByAccountId(@Param("id") Integer id);

    @Modifying
    void deleteById(Integer id);

    @Modifying
    @Query
    void deleteByProductIdAndAccountId(Integer pid, Integer accountId);

    boolean existsByProductIdAndAccountId(Integer pid, Integer accountId);
}
