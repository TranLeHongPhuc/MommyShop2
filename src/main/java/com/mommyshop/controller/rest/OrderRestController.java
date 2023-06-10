package com.mommyshop.controller.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.mommyshop.entity.Order;
import com.mommyshop.entity.enums.OrderStatus;
import com.mommyshop.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/orders")
public class OrderRestController {
    @Autowired
    OrderService orderService;

    @GetMapping()
    public List<Order> getAll() {
        return orderService.getAll();
    }

    @GetMapping("{id}")
    public Order getOne(@PathVariable("id") Integer id) {
        return orderService.findById(id);
    }

    @PostMapping("/purchase")
    public Order create(@RequestBody JsonNode orderData) {
        return orderService.create(orderData);
    }

    @PutMapping("{id}")
    public Order update(@RequestBody Order order, @PathVariable("id") Integer id) {
        return orderService.update(order);
    }

    @PutMapping("/update/status/{id}/{status}")
    public void updateOrderStatus(@PathVariable("id") Integer id, @PathVariable("status") OrderStatus orderStatus) {
        orderService.updateOrderStatus(id, orderStatus);
    }
}
