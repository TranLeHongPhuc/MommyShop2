package com.mommyshop.controller.rest;


import com.mommyshop.entity.OrderTrack;
import com.mommyshop.entity.enums.OrderStatus;
import com.mommyshop.service.OrderTrackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/order-tracks")
public class OrderTrackRestController {

    @Autowired
    private OrderTrackService orderTrackService;

    @GetMapping
    public List<OrderTrack> getAll() {
        return orderTrackService.findAll();
    }

    @GetMapping("{id}")
    public List<OrderTrack> getAllByOrder(@PathVariable("id") Integer id) {
        return orderTrackService.findAllByOrder(id);
    }
    
    @GetMapping("{id}/status/{status}")
    public OrderTrack getByOrderAndOrderStatus(@PathVariable("id") Integer id,@PathVariable("status")OrderStatus status) {
        return orderTrackService.findByOrderAndOrderStatus(id, status);
    }
    
    @PostMapping
    public OrderTrack create(@RequestBody OrderTrack orderTrack) {
        return orderTrackService.create(orderTrack);
    }
    
    @PutMapping("{id}")
    public OrderTrack update(@RequestBody OrderTrack orderTrack, @PathVariable("id") Integer id) {
    	return orderTrackService.updateOrderStatusNote(orderTrack);
    }

}
