package com.mommyshop.service;

import com.mommyshop.entity.OrderTrack;
import com.mommyshop.entity.enums.OrderStatus;
import com.mommyshop.repository.OrderTrackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderTrackService {

    @Autowired
    private OrderTrackRepository repo;

    public List<OrderTrack> findAll() {
        return repo.findAll();
    }
    
    public OrderTrack findByOrderAndOrderStatus(Integer id,OrderStatus status) {
    	return repo.findByOrderAndStatus(id, status);
    }
    
    public OrderTrack create(OrderTrack orderTrack) {
        return repo.save(orderTrack);
    }
    
    public OrderTrack updateOrderStatusNote(OrderTrack orderTrack) {
        return repo.save(orderTrack);
    }
    
    public List<OrderTrack> findAllByOrder(Integer id) {
        return repo.findByOrder(id);
    }
    
    
}
