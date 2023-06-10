package com.mommyshop.controller;

import com.mommyshop.entity.Brand;
import com.mommyshop.entity.Category;
import com.mommyshop.entity.Product;
import com.mommyshop.service.*;
import com.mommyshop.utilities.CheckFavorite;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class HomeController {

    @Autowired
    private BrandService brandService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private CheckFavorite checkFavorite;

    @RequestMapping({"/", "/home/index"})
    public String client(Model model, HttpServletRequest req, Authentication auth) {

        Integer countAllProducts = productService.getcountAllProducts();
        model.addAttribute("countAllProducts", countAllProducts);

        List<Product> sellingProducts = productService.getSellingProduct();

        List<Product> discountProducts = productService.getDiscountProduct();

        Product discountest = productService.getProductDiscountest();

        Integer quantityFeaturedest = productService.getCountProductFeaturedest();
        model.addAttribute("quantityFeaturedest", quantityFeaturedest);

        List<Product> newProducts = productService.getNewProduct();

        List<Brand> listBrands = brandService.getAll();
        model.addAttribute("listBrands", listBrands);

        String email = req.getRemoteUser();
        if (email != null) {
            Integer account = accountService.findByEmail(email).getId();
            model.addAttribute("remoteId", account);

            checkFavorite.getFavorite(sellingProducts, account);

            checkFavorite.getFavorite(newProducts, account);

            checkFavorite.getFavorite(discountProducts, account);

            checkFavorite.getFavoriteOne(discountest, account);
        }

        model.addAttribute("sellingProducts", sellingProducts);
        model.addAttribute("discountProducts", discountProducts);
        model.addAttribute("newProducts", newProducts);
        model.addAttribute("productDiscountest", discountest);

        List<Category> listParentCategories = categoryService.getListParentCategories();
        model.addAttribute("parentCategories", listParentCategories);

        return "index";
    }

    @RequestMapping({"/admin", "/admin/home/index"})
    public String admin() {
        return "redirect:/assets/admin/index.html";
    }

}
