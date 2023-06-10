package com.mommyshop.controller.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mommyshop.entity.Product;
import com.mommyshop.service.CartService;
import com.mommyshop.service.ProductImageService;
import com.mommyshop.service.ProductService;
import com.mommyshop.service.UploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.websocket.server.PathParam;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/products")
@RequiredArgsConstructor
public class ProductRestController {

    private final ProductService productService;

    @Autowired
    private CartService cartService;

    private final List<String> productPhoto = new ArrayList<>();

    private String mainImage = null;

    @Autowired
    private ProductImageService productImageService;

    @Autowired
    private UploadService uploadService;

    @GetMapping()
    public List<Product> getAll() {
        return productService.getAll();
    }

    @GetMapping("{id}")
    public Product getOne(@PathVariable("id") Integer id) {
        return productService.findById(id);
    }

    @GetMapping("/most-wanted")
    public Product productMostWanted() {
        return productService.getProductMostWanted();
    }

    @GetMapping("{id}/like/{like}")
    public Product getOneLike(@PathVariable("id") Integer id, @PathVariable("like") Integer like) {
        Product product = productService.findById(id);
        productService.update(product);
        return productService.findById(id);
    }

    @GetMapping("/pid/{id}")
    public Integer getIdProduct(@PathVariable("id") Integer id) {
        Product product = productService.findById(id);
        return product.getId();
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Integer id) {

        Product product = productService.findById(id);

        mainImage = product.getMainImage();
        if (product.getFavorites().size() == 0 && product.getOrderDetails().size() == 0
            && cartService.getByProduct(id).size() == 0) {
            System.out.println(product.getFavorites().size() + " || " + product.getOrderDetails().size() + " || " + cartService.getByProduct(id).size());
            for (int i = 0; i < product.getProductImages().size(); i++) {
                productPhoto.add(product.getProductImages().get(i).getName());
            }
            productImageService.deleteAllByProduct(id);

        }
        productService.deleteById(product);

    }

    @DeleteMapping("/images")
    public void deleteImage() {
        for (String photo : productPhoto) {
            uploadService.delete(photo, "images/products/");
        }

        uploadService.delete(mainImage, "images/products/");
    }

    @GetMapping("/id/{id}/inventory/{inventory}")
    public Product updateInventory(@PathVariable("id") Integer id, @PathVariable("inventory") Integer inventory) {
        Product product = productService.findById(id);
        product.setInventory(product.getInventory() - inventory);
        return productService.update(product);
    }

    @PostMapping()
    public Product create(@RequestBody JsonNode product) {
        return productService.create(product);
    }

    @PutMapping("{id}")
    public Product update(@PathVariable("id") Integer id, @RequestBody JsonNode product) {
        return productService.updateAll(product);
    }

    @PostMapping("/upload/{folder}")
    public JsonNode upload(@PathVariable("folder") String folder, @PathParam("file") MultipartFile file) {
        File savedFile = uploadService.save(file, folder + "/products");
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode node = mapper.createObjectNode();
        node.put("name", savedFile.getName());
        node.put("size", savedFile.length());
        return node;
    }

    @GetMapping("/reset-inventory")
    public void resetAllProductInventory() {
        productService.resetInventory();
    }
}
