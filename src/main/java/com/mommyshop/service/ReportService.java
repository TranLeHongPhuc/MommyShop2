package com.mommyshop.service;

import com.mommyshop.entity.Report;
import com.mommyshop.entity.ReportMonth;
import com.mommyshop.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {
    @Autowired
    OrderDetailRepository orderDetailRepository;

    public List<Report> getInventory(String date) {
        return orderDetailRepository.getInventory(date);
    }

    public List<Report> getInventoryByParentCategory(Integer id, String date) {
        return orderDetailRepository.getInventoryByParentCategory(id, date);
    }

    public List<Report> getInventoryByCategory(Integer id, String date) {
        return orderDetailRepository.getInventoryByCategory(id, date);
    }

    public List<Report> getInventoryByCustomer() {
        return orderDetailRepository.getInventoryByCustomer();
    }

    public List<ReportMonth> getInventoryBrandByMonth(String name) {
        return orderDetailRepository.getInventoryBrandByMonth(name);
    }

    public List<ReportMonth> getRevenue() {
        return orderDetailRepository.getRevenue();
    }
    
    public List<ReportMonth> getRevenueAll() {
        return orderDetailRepository.getRevenueAll();
    }
    
    public List<ReportMonth> getByMonth() {
        return orderDetailRepository.getByMonth();
    }

    public List<ReportMonth> getInventoryBrand() {
        return orderDetailRepository.getInventoryBrand();
    }

    public List<ReportMonth> getInventoryBrandByMonthAndByBrandName(String name, Integer month, Integer year) {
        return orderDetailRepository.getInventoryBrandByMonthAndByBrandName(name, month, year);
    }

    public List<ReportMonth> getInventoryProduct() {
        return orderDetailRepository.getInventoryProduct();
    }

    public List<ReportMonth> getInventoryProductByMonthAndByProductName(Integer id, Integer month, Integer year) {
        return orderDetailRepository.getInventoryProductByMonthAndByProductName(id, month, year);
    }
}
