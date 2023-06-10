package com.mommyshop.controller;

import com.mommyshop.dto.ProductFilter;
import com.mommyshop.entity.Account;
import com.mommyshop.entity.Brand;
import com.mommyshop.entity.Category;
import com.mommyshop.entity.Product;
import com.mommyshop.service.*;
import com.mommyshop.utilities.CheckFavorite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private BrandService brandService;

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private AccountService accountService;

    @Autowired
    private CheckFavorite checkFavorite;

    @GetMapping("/product/detail/{id}")
    public String detail(Model model, @PathVariable("id") Integer id, HttpServletRequest req) {
        Product product = productService.findById(id);

        String email = req.getRemoteUser();
        Account account;
        if (email != null) {
            account = accountService.findByEmail(email);
            checkFavorite.getFavoriteOne(product, account.getId());
        }

        model.addAttribute("item", product);
        return "product/detail";
    }

    @GetMapping("/products")
    public String searchFirstPage() {
        return "redirect:/products/search/1";
    }

    @GetMapping("/products/search/{pageNum}")
    public String searchByPage(
        Model model,
        @RequestParam(name = "keyword", required = false) String keyword,
        @RequestParam(name = "categoryIds", required = false) Integer[] categoryIds,
        @RequestParam(name = "brandIds", required = false) Integer[] brandIds,
        @RequestParam(name = "maxPrice", required = false) Float maxPrice,
        @RequestParam(name = "minPrice", required = false) Float minPrice,
        @RequestParam(name = "sortType", required = false) Integer sortType,
        @RequestParam(name = "priceOrder", required = false) String priceOrder,
        @PathVariable("pageNum") int pageNum,
        HttpServletRequest req
    ) {
        if (minPrice != null && maxPrice != null) {
            if (minPrice.isNaN() || maxPrice.isNaN()) {
                minPrice = 0f;
                maxPrice = 10000000f;
            }
            if (minPrice > maxPrice) {
                Float temp = minPrice;
                minPrice = maxPrice;
                maxPrice = temp;
            }
        }

        Page<Product> pageProducts = productService.search(
            ProductFilter.builder()
                .keyword(keyword)
                .categoryIds(categoryIds)
                .brandIds(brandIds)
                .minPrice(minPrice)
                .maxPrice(maxPrice)
                .sortType(sortType)
                .priceOrder(priceOrder)
                .pageNum(pageNum)
                .build()
        );
        List<Product> products = pageProducts.getContent();

        long startCount = (long) ProductService.PRODUCT_PER_PAGE * (pageNum - 1) + 1;
        long endCount = startCount + ProductService.PRODUCT_PER_PAGE - 1;
        if (endCount > pageProducts.getTotalElements()) {
            endCount = pageProducts.getTotalElements();
        }

        Account account = accountService.findByEmail(req.getRemoteUser());

        if (account != null) {
            checkFavorite.getFavorite(products, account.getId());
        }

        model.addAttribute("currentPage", pageNum);
        model.addAttribute("startCount", startCount);
        model.addAttribute("endCount", endCount);
        model.addAttribute("totalPages", pageProducts.getTotalPages());
        model.addAttribute("totalItems", pageProducts.getTotalElements());
        model.addAttribute("moduleURL", "/products/search/");
        model.addAttribute("requestParams", this.getRequestParams(
            model, keyword, categoryIds, brandIds, maxPrice, minPrice, sortType, priceOrder
        ));

        List<Category> categories = categoryService.getListChildCategoriesProductsExist();
        List<Brand> brands = brandService.getAllBrandProductsExist();
        model.addAttribute("brands", brands);

        model.addAttribute("products", products);
        model.addAttribute("categories", categories);

        return "product/list";
    }

    private String getRequestParams(
        Model model, String keyword, Integer[] categoryIds, Integer[] brandIds,
        Float maxPrice, Float minPrice, Integer sortType, String priceOrder
    ) {
        String requestParams = "";
        boolean hasQuestionMark = false;
        if (keyword != null) {
            hasQuestionMark = true;
            requestParams += "?keyword=" + keyword;
            model.addAttribute("keyword", keyword);
        }

        if (categoryIds != null) {
            if (!hasQuestionMark) {
                requestParams += "?";
                hasQuestionMark = true;
            } else
                requestParams += "&";

            int count = 0;
            for (Integer categoryId : categoryIds) {
                if (count > 0) {
                    requestParams += "&categoryIds=" + categoryId;
                } else {
                    requestParams += "categoryIds=" + categoryId;
                }
                count++;
            }
            model.addAttribute("categoryIds", categoryIds);
        }

        if (brandIds != null) {
            if (!hasQuestionMark) {
                requestParams += "?";
                hasQuestionMark = true;
            } else
                requestParams += "&";

            int count = 0;
            for (Integer brandId : brandIds) {
                if (count > 0) {
                    requestParams += "&brandIds=" + brandId;
                } else {
                    requestParams += "brandIds=" + brandId;
                }
                count++;
            }
            model.addAttribute("brandIds", brandIds);
        }

        if (maxPrice != null && maxPrice > 0) {
            if (!hasQuestionMark) {
                requestParams += "?";
                hasQuestionMark = true;
            } else
                requestParams += "&";
            requestParams += "maxPrice=" + maxPrice;
            model.addAttribute("maxPrice", maxPrice);
        }

        if (minPrice != null && minPrice > 0) {
            if (!hasQuestionMark) {
                requestParams += "?";
                hasQuestionMark = true;
            } else
                requestParams += "&";
            requestParams += "minPrice=" + minPrice;
            model.addAttribute("minPrice", minPrice);
        }

        if (sortType != null) {
            if (!hasQuestionMark) {
                requestParams += "?";
                hasQuestionMark = true;
            } else
                requestParams += "&";
            requestParams += "sortType=" + sortType;
            model.addAttribute("sortType", sortType);
        }

        if (priceOrder != null) {
            if (!hasQuestionMark) {
                requestParams += "?";
                hasQuestionMark = true;
            } else
                requestParams += "&";
            requestParams += "priceOrder=" + priceOrder;
            model.addAttribute("priceOrder", priceOrder);
        }

        return requestParams;
    }

}
