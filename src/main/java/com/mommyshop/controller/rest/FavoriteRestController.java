package com.mommyshop.controller.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.mommyshop.entity.Account;
import com.mommyshop.entity.Favorite;
import com.mommyshop.service.AccountService;
import com.mommyshop.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/favorites")
@Transactional
public class FavoriteRestController {

    @Autowired
    FavoriteService favoriteService;

    @Autowired
    AccountService accountService;

    @GetMapping()
    public List<Favorite> getAll() {
        return favoriteService.getAll();
    }

    @GetMapping("{id}")
    public List<Favorite> getListF_ByAccountId(@PathVariable("id") Integer id) {
        return favoriteService.getListByAccountId(id);
    }

    @GetMapping("/pid/{pid}/aid/{aid}")
    public Favorite getFavorite(@PathVariable("pid") Integer pid, @PathVariable("aid") Integer aid) {
        return favoriteService.getByProductAndAccount(pid, aid);
    }

    @PostMapping()
    public Favorite create(@RequestBody JsonNode favorite) {
        return favoriteService.create(favorite);
    }

    @GetMapping("/pid/{pid}")
    public Boolean create(@PathVariable("pid") Integer productId, HttpServletRequest request) {
        Integer accountId = checkAuth(request).getId();
        try {
            if (favoriteService.isExisted(productId, accountId)) {
                return false;
            }
            favoriteService.create(productId, accountId);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    @DeleteMapping("{id}")
    public void deleteFav(@PathVariable("id") Integer id) {
        favoriteService.delete(id);
    }

    @DeleteMapping("/pid/{pid}")
    public Boolean delete(@PathVariable("pid") Integer productId, HttpServletRequest request) {
        Integer accountId = checkAuth(request).getId();
        try {
            favoriteService.delete(productId, accountId);
            return true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }
    }

    private Account checkAuth(HttpServletRequest request) {
        String email = request.getRemoteUser();
        if (email == null) {
            throw new AccessDeniedException("403 Not logged in");
        }
        Account account = accountService.findByEmail(email);
        if (account == null) {
            throw new AccessDeniedException("403 Account not found");
        }
        return account;
    }
}
