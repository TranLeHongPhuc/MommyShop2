package com.mommyshop.service;

import com.mommyshop.entity.ProductImage;
import com.mommyshop.repository.ProductImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ProductImageService {

    @Autowired
    private ProductImageRepository repo;

    public List<ProductImage> getByProduct(Integer id) {
        return repo.findByProduct(id);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }

    public void deleteAllByProduct(Integer id) {
        repo.deleteByProduct(id);
    }

}
