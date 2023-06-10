package com.mommyshop.controller.rest;

import com.mommyshop.entity.ShippingRate;
import com.mommyshop.service.ShippingRateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/shipping-rates")
public class ShippingRateRestController {

    @Autowired
    private ShippingRateService shippingRateService;

    @GetMapping
    public List<ShippingRate> getAll() {
        return shippingRateService.getAll();
    }

}
