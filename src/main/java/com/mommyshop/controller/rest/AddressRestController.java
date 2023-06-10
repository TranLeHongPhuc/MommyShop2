package com.mommyshop.controller.rest;

import com.mommyshop.entity.Account;
import com.mommyshop.entity.address.Address;
import com.mommyshop.service.AccountService;
import com.mommyshop.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/profile/address")
@RequiredArgsConstructor
public class AddressRestController {

    private final AddressService addressService;
    private final AccountService accountService;

    @GetMapping("/by-account/{id}")
    public List<Address> getAllByAccount(@PathVariable("id") Integer id) {
        return addressService.findAllByAccountId(id);
    }

    @PostMapping("/add")
    public Address addAddress(@RequestBody Address address, HttpServletRequest request) {
        try {
            Account account = checkAuth(request);
            address.setAccount(account);
            if (!(account.getAddresses().size() > 0)) {
                address.setIsDefault(true);
            }
            return addressService.create(address);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/set-default/{addressId}")
    public void setDefaultAddress(@PathVariable("addressId") Integer idDefaultAddress, HttpServletRequest request) {
        Integer accountId = checkAuth(request).getId();
        try {
            addressService.setDefaultAddress(idDefaultAddress, accountId);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    @DeleteMapping("/delete/{addressId}")
    public Boolean deleteAddress(@PathVariable("addressId") Integer addressId, HttpServletRequest request) {
        Integer accountId = checkAuth(request).getId();
        try {
            return addressService.delete(addressId, accountId);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    private Account checkAuth(HttpServletRequest request) {
        String email = request.getRemoteUser();
        if (email == null) {
            throw new AccessDeniedException("Not logged in");
        }
        Account account = accountService.findByEmail(email);
        if (account == null) {
            throw new AccessDeniedException("Account not found");
        }
        return account;
    }
}