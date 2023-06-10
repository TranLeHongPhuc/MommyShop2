package com.mommyshop.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mommyshop.entity.Favorite;
import com.mommyshop.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {
    @Autowired
    FavoriteRepository favoriteRepository;

    public List<Favorite> getListByAccountId(Integer id) {
        return favoriteRepository.getListF_ByAccountId(id);
    }

    public Favorite create(JsonNode favoriteData) {

        ObjectMapper mapper = new ObjectMapper();
        Favorite favorite = mapper.convertValue(favoriteData, Favorite.class);
        favoriteRepository.save(favorite);

        return favorite;

    }

    public List<Favorite> getListByAccount(Integer id) {
        return favoriteRepository.findByAccount(id);
    }

    public Integer countFavoriteByAccount(Integer accountId) {
        return favoriteRepository.countFavoriteByAccount(accountId);
    }

    public List<Favorite> getAll() {
        return favoriteRepository.findAll();
    }

    public Favorite getByProductAndAccount(Integer pid, Integer aid) {
        return favoriteRepository.getByProductAndAccount(pid, aid);
    }

    public void delete(Integer id) {
        favoriteRepository.deleteById(id);
    }

    public void deleteAllByAccountId(Integer id) {
        favoriteRepository.deleteAllByAccountId(id);
    }

    public Favorite create(Integer productId, Integer accountId) {
        Favorite favorite = new Favorite(productId, accountId);
        return favoriteRepository.save(favorite);
    }

    public void delete(Integer productId, Integer accountId) {
        favoriteRepository.deleteByProductIdAndAccountId(productId, accountId);
    }

    public boolean isExisted(Integer productId, Integer accountId) {
        return favoriteRepository.existsByProductIdAndAccountId(productId, accountId);
    }
}
