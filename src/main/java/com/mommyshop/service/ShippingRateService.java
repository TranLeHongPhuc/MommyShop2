package com.mommyshop.service;

import com.mommyshop.entity.ShippingRate;
import com.mommyshop.repository.ShippingRateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShippingRateService {

    @Autowired
    private ShippingRateRepository repo;

    public List<ShippingRate> getAll() {
        return repo.findAll();
    }

}
