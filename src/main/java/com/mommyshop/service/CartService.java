package com.mommyshop.service;

import com.mommyshop.entity.CartItem;
import com.mommyshop.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    CartRepository repo;

    public List<CartItem> getTop6Carts() {
        return repo.findTop6Carts();
    }

    public List<CartItem> getAll() {
        return repo.findAll();
    }

    public CartItem getById(Integer id) {
        return repo.findById(id).get();
    }

    public List<CartItem> getByAccount(String email) {
        return repo.getByAccount(email);
    }

    public List<CartItem> getByProduct(Integer id) {
        return repo.getByProduct(id);
    }

    public CartItem getByproductAndAccount(Integer pid, String email) {
        return repo.getByProductAndAccount(pid, email);
    }

    public CartItem create(CartItem Cart) {
        return repo.save(Cart);
    }

    public CartItem update(CartItem Cart) {
        return repo.save(Cart);
    }

    public List<CartItem> updateAll(List<CartItem> cartItems) {
    	return repo.saveAll(cartItems);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }

    public void deleteByProductAndAccount(Integer pid, String email) {
        repo.deleteByProductAndAccount(pid, email);
    }


    public void deleteAllByAccount(Integer id) {
        repo.deleteByAccount(id);
    }

    public void deleteAll() {
        repo.deleteAll();
    }
}
