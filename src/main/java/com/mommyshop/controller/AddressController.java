package com.mommyshop.controller;

import com.mommyshop.entity.Account;
import com.mommyshop.entity.address.Address;
import com.mommyshop.service.AccountService;
import com.mommyshop.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;
    private final AccountService accountService;

    @GetMapping("/profile/address")
    public String view(HttpServletRequest request, Model model) {
        String email = request.getRemoteUser();
        Account account = accountService.findByEmail(email);
        List<Address> addresses = addressService.findAllByAccountId(account.getId());

        model.addAttribute("addresses", addresses);
        return "user/address";
    }

}
