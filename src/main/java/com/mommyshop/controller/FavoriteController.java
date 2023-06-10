package com.mommyshop.controller;

import com.mommyshop.entity.Favorite;
import com.mommyshop.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
public class FavoriteController {

    @Autowired
    FavoriteService favoriteService;


    @GetMapping("your-favorite/{id}")
    public String listFavoriteByAccount(@PathVariable("id") Integer id, Model model) {

        List<Favorite> listByAccount = favoriteService.getListByAccount(id);
        model.addAttribute("listByAccount", listByAccount);

        return "layout/_favorite";
    }
}
