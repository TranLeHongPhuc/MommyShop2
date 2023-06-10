package com.mommyshop.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mommyshop.entity.Order;
import com.mommyshop.entity.OrderDetail;
import com.mommyshop.entity.enums.OrderStatus;
import com.mommyshop.repository.OrderDetailRepository;
import com.mommyshop.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
public class OrderService {
    @Autowired
    OrderRepository orderRepository;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    public Order create(JsonNode orderData) {
        ObjectMapper mapper = new ObjectMapper();
        Order order = mapper.convertValue(orderData, Order.class);
//		System.out.println(order.getOrderStatus() instanceof OrderStatus);
        orderRepository.save(order);
        TypeReference<List<OrderDetail>> type = new TypeReference<List<OrderDetail>>() {
        };
        List<OrderDetail> orderDetail = mapper.convertValue(orderData.get("orderDetails"), type)
            .stream().peek(d -> d.setOrder(order)).collect(Collectors.toList());
        orderDetailRepository.saveAll(orderDetail);
        return order;
    }

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public Order findById(Integer id) {
        return orderRepository.findById(id).get();
    }

    public List<Order> findByAccount(Integer id) {
        return orderRepository.findByAccount(id);
    }

    public void updateOrderStatus(Integer id, OrderStatus orderStatus) {
        orderRepository.updateOrderStatus(id, orderStatus);
    }

    public Order update(Order order) {
        return orderRepository.save(order);
    }

    public void deleteById(Integer id) {
        orderRepository.deleteById(id);
    }

}
