package com.mommyshop.service;

import com.mommyshop.entity.Brand;
import com.mommyshop.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BrandService {

    @Autowired
    BrandRepository repo;

    public List<Brand> getAll() {
        return repo.findAll();
    }

    public List<Brand> getAllBrandProductsExist() {
        return repo.getAllBrandProductsExist();
    }

    public Brand getById(Integer id) {
        return repo.findById(id).get();
    }

    public Brand create(Brand brand) {
        return repo.save(brand);
    }

    public Brand update(Brand brand) {
        return repo.save(brand);
    }

    public void delete(Integer id) {
        repo.deleteById(id);
    }

    public List<Brand> getTopBrands() {
        return repo.getTopBrands();
    }

}
