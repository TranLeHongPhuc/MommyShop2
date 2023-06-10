package com.mommyshop.controller.rest;

import com.mommyshop.entity.ProductImage;
import com.mommyshop.service.ProductImageService;
import com.mommyshop.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/product-images")
public class ProductImageRestController {
    @Autowired
    private UploadService uploadService;
    @Autowired
    private ProductImageService productImageService;

    @GetMapping("pid/{id}")
    public List<ProductImage> getByProduct(@PathVariable("id") Integer id) {
        return productImageService.getByProduct(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable("id") Integer id) {
        productImageService.delete(id);
    }

    @DeleteMapping("/delete/{folder}/name/{name}")
    public void delete(@PathVariable("folder") String folder, @PathVariable("name") String name) {
        uploadService.delete(name, folder + "/products");
    }
}
