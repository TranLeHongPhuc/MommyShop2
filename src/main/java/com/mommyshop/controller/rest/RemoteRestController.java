package com.mommyshop.controller.rest;

import com.mommyshop.entity.Account;
import com.mommyshop.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/remote")
public class RemoteRestController {

    @Autowired
    private AccountService accountService;

    @GetMapping()
    public Account getAccount(HttpServletRequest req) {
        String email = req.getRemoteUser();
        return accountService.findByEmail(email);
    }

}
