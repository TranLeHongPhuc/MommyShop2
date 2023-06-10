package com.mommyshop.controller.rest;

import com.mommyshop.entity.Account;
import com.mommyshop.entity.CartItem;
import com.mommyshop.service.AccountService;
import com.mommyshop.service.CartService;
import com.mommyshop.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/carts")
public class CartRestController {

    @Autowired
    private CartService cartService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private UploadService uploadService;

    @GetMapping()
    public List<CartItem> getAll() {
        return cartService.getAll();
    }

    @GetMapping("{id}")
    public CartItem getOne(@PathVariable("id") Integer id) {
        return cartService.getById(id);
    }

    @GetMapping("/account/{email}")
    public List<CartItem> getListCartsByAccount(@PathVariable("email") String email) {
        return cartService.getByAccount(email);
    }


    @GetMapping("/product/{pid}/account/{email}")
    public CartItem getOneByProductAnhAccount(@PathVariable("pid") Integer pid, @PathVariable("email") String email) {
        return cartService.getByproductAndAccount(pid, email);
    }

    @PostMapping()
    public CartItem create(@RequestBody CartItem Cart) {
        return cartService.create(Cart);
    }

    @PutMapping()
    public CartItem update(@RequestBody CartItem cart) {
        return cartService.update(cart);
    }

    @PutMapping("/updateall")
    public List<CartItem> updateAll(@RequestBody List<CartItem> carts) {
    	return cartService.updateAll(carts);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Integer id) {
        cartService.delete(id);
    }

    @DeleteMapping("/product/{pid}/account/{email}")
    public void deleteByProductAndAccount(@PathVariable("pid") Integer pid, @PathVariable("email") String email) {
        cartService.deleteByProductAndAccount(pid, email);
    }

    @DeleteMapping("/account/{email}")
    public void deleteAllByAccount(@PathVariable("email") String email) {
        Account account = accountService.findByEmail(email);
        //System.out.println(account.getId());
        cartService.deleteAllByAccount(account.getId());
    }

    @DeleteMapping()
    public void deleteAll() {
        cartService.deleteAll();
    }
}
