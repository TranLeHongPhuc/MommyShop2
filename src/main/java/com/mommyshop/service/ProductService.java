package com.mommyshop.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mommyshop.dto.ProductFilter;
import com.mommyshop.entity.Product;
import com.mommyshop.entity.ProductImage;
import com.mommyshop.repository.ProductImageRepository;
import com.mommyshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    @Autowired
    ProductImageRepository productImageRepository;

    public static final Integer PRODUCT_PER_PAGE = 12;

    @Autowired
    ProductRepository productRepository;

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public Product findById(Integer id) {
        return productRepository.findById(id).get();
    }

    public Product create(JsonNode productData) {
        ObjectMapper mapper = new ObjectMapper();
        Product product = mapper.convertValue(productData, Product.class);
        productRepository.save(product);
        TypeReference<List<ProductImage>> type = new TypeReference<List<ProductImage>>() {
        };
        List<ProductImage> productImages = mapper.convertValue(productData.get("productImages"), type).stream()
            .peek(d -> d.setProduct(product)).collect(Collectors.toList());
        //System.out.println(productImages.get(0).getProduct().getName()+"hehe");
        productImageRepository.saveAll(productImages);
        return product;
    }

    public Product updateAll(JsonNode productData) {
        ObjectMapper mapper = new ObjectMapper();
        Product product = mapper.convertValue(productData, Product.class);
        productRepository.save(product);
        TypeReference<List<ProductImage>> type = new TypeReference<List<ProductImage>>() {
        };
        List<ProductImage> productImages = mapper.convertValue(productData.get("productImages"), type).stream()
            .peek(d -> d.setProduct(product)).collect(Collectors.toList());
        productImageRepository.saveAll(productImages);
        return product;
    }

    public Product update(Product product) {
        return productRepository.save(product);
    }

    public List<Product> getListByKeyWord(String keyword) {
        return productRepository.getListByKeyword(keyword);
    }

    public List<Product> getNewProduct() {
        return productRepository.getNewProduct();
    }

    public List<Product> getSellingProduct() {
        return productRepository.getSellingProduct();
    }

    public Product getProductDiscountest() {
        return productRepository.getProductDiscountest();
    }

    public Integer getCountProductFeaturedest() {
        return productRepository.getCountProductFeaturedest();
    }

    public Integer getcountAllProducts() {
        return productRepository.getcountAllProducts();
    }

    public List<Product> getDiscountProduct() {
        return productRepository.getDiscountProduct();
    }

    public Page<Product> search(ProductFilter productFilter) {
        Pageable pageable = productFilter.getPageable();
        Specification<Product> specification = productFilter.getSpecification();

        return productRepository.findAll(specification, pageable);
    }

    public void resetInventory() {
        List<Product> all = getAll();
        for (Product product : all) {
            product.setInventory(99);
        }
        productRepository.saveAll(all);
    }

    public Product getProductMostWanted() {
        return productRepository.getProductMostWanted();
    }

    public void deleteById(Product product) {
        productRepository.delete(product);
    }

    public Page<Product> searchDiscountAndNew(ProductFilter productFilter) {
        Pageable pageable = productFilter.getPageable();
        Specification<Product> specification = productFilter.getSpecification();

        return productRepository.findAllDiscountAndNew(specification, pageable);
    }
}
