package com.mommyshop.service;

import com.mommyshop.entity.OrderDetail;
import com.mommyshop.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailService {

    @Autowired
    OrderDetailRepository orderDetailRepository;

    public List<OrderDetail> getListOrderId(Integer id) {
        return orderDetailRepository.getListOrderId(id);
    }

    public List<OrderDetail> getAll() {
        return orderDetailRepository.findAll();
    }

    public Float totalPrice(Integer id) {
        return orderDetailRepository.totalPrice(id);
    }

    public void deleteAllByOrderId(Integer id) {
        orderDetailRepository.deleteAllByOrderId(id);
    }
}
