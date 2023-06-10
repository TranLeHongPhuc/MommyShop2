package com.mommyshop.controller;

import com.mommyshop.entity.Account;
import com.mommyshop.entity.Order;
import com.mommyshop.entity.OrderDetail;
import com.mommyshop.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
public class OrderController {
    @Autowired
    OrderService orderService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    @RequestMapping("/order/checkout")
    public String checkout(Model model, HttpServletRequest req) {

        String email = req.getRemoteUser();
        if (email == null) {
            model.addAttribute("remoteCheckout", new Account(null, "", "", false, "", "", "", null, null, null, "", null));
        } else {

            model.addAttribute("remoteCheckout", accountService.findByEmail(email));
        }

        return "order/checkout";

    }

    @RequestMapping("/order/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {

        Order order = orderService.findById(id);
        model.addAttribute("order", order);

        List<OrderDetail> orderDetails = orderDetailService.getListOrderId(id);
        model.addAttribute("orderDetails", orderDetails);

        model.addAttribute("totalPrice", orderDetailService.totalPrice(id));

        return "order/detail";
    }

    @GetMapping("/your-orders")
    public String yourOrder(Model model, HttpServletRequest req) {
        String email = req.getRemoteUser();
        Account account = accountService.findByEmail(email);
        model.addAttribute("orders", orderService.findByAccount(account.getId()));
        return "order/list";
    }
}
