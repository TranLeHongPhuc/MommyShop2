package com.mommyshop.controller.rest;

import com.mommyshop.entity.Order;
import com.mommyshop.entity.Report;
import com.mommyshop.entity.ReportMonth;
import com.mommyshop.service.OrderService;
import com.mommyshop.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/reports")
public class ReportRestController {
    @Autowired
    OrderService orderService;
    @Autowired
    ReportService reportService;

    @GetMapping()
    public List<Order> getAll() {
        return orderService.getAll();
    }

    @GetMapping("{id}")
    public Order getOne(@PathVariable("id") Integer id) {
        return orderService.findById(id);
    }

    @GetMapping("/revenue/{date}")
    public List<Report> get(@PathVariable("date") String date) {
        if (date.equals("Full")) {
            return reportService.getInventory("");
        } else if (date.equals("1")) {
            return reportService.getInventory("01");
        } else {
            return reportService.getInventory(date);
        }

    }

    @GetMapping("/revenue/parentid/{id}/{date}")
    public List<Report> getByParent(@PathVariable("id") Integer id, @PathVariable("date") String date) {
        if (date.equals("Full")) {
            return reportService.getInventoryByParentCategory(id, "");
        } else if (date.equals("1")) {
            return reportService.getInventoryByParentCategory(id, "01");
        } else {
            return reportService.getInventoryByParentCategory(id, date);
        }

    }

    @GetMapping("/revenue/categoryid/{id}/{date}")
    public List<Report> getByCategory(@PathVariable("id") Integer id, @PathVariable("date") String date) {
        if (date.equals("Full")) {
            return reportService.getInventoryByCategory(id, "");
        } else if (date.equals("1")) {
            return reportService.getInventoryByCategory(id, "01");
        } else {
            return reportService.getInventoryByCategory(id, date);
        }

    }

    @GetMapping("/revenue/customer")
    public List<Report> getInventoryByCustomer() {
        return reportService.getInventoryByCustomer();

    }

    @GetMapping("/revenue/sum")
    public List<ReportMonth> getRevenue() {
        return reportService.getRevenue();
    }
    @GetMapping("/revenue/sum/all")
    public List<ReportMonth> getRevenueall() {
        return reportService.getRevenueAll();
    }

    @GetMapping("/revenue/brand/{name}")
    public List<ReportMonth> getByBrandMonth(@PathVariable("name") String name) {
        return reportService.getInventoryBrandByMonth(name);
    }


    @GetMapping("/revenue/month")
    public List<ReportMonth> getByMonth() {
        return reportService.getByMonth();
    }

    @GetMapping("/revenue/brand")
    public List<ReportMonth> getByBrand() {
        return reportService.getInventoryBrand();
    }

    @GetMapping("/revenue/brand/{name}/month/{month}/year/{year}")
    public List<ReportMonth> getInventoryBrandByMonthAndByBrandName(@PathVariable("name") String name, @PathVariable("month") Integer month, @PathVariable("year") Integer year) {
        return reportService.getInventoryBrandByMonthAndByBrandName(name, month, year);
    }

    @GetMapping("/revenue/product")
    public List<ReportMonth> getByProduct() {
        return reportService.getInventoryProduct();
    }

    @GetMapping("/revenue/product/{id}/month/{month}/year/{year}")
    public List<ReportMonth> getInventoryProductByMonthAndByProductName(@PathVariable("id") Integer id, @PathVariable("month") Integer month, @PathVariable("year") Integer year) {
        return reportService.getInventoryProductByMonthAndByProductName(id, month, year);
    }
}
