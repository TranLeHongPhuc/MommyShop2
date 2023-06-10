package com.mommyshop.controller.rest;

import com.mommyshop.entity.OrderDetail;
import com.mommyshop.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/order-details")
public class OrderDetailRestController {

    @Autowired
    OrderDetailService orderDetailService;

    @GetMapping()
    public List<OrderDetail> getAll() {
        return orderDetailService.getAll();
    }

    @GetMapping("{id}")
    public List<OrderDetail> getListOrderId(@PathVariable("id") Integer id) {
        return orderDetailService.getListOrderId(id);
    }
}
