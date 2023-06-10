package com.mommyshop.controller.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mommyshop.dto.ParentCategoryDTO;
import com.mommyshop.entity.Category;
import com.mommyshop.service.CategoryService;
import com.mommyshop.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.websocket.server.PathParam;
import java.io.File;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/categories")
public class CategoryRestController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private UploadService uploadService;

    @GetMapping()
    public List<Category> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/parent")
    public List<Category> getParents() {
        return categoryService.getListParentCategories();
    }

    @GetMapping("{id}")
    public Category getOne(@PathVariable("id") Integer id) {
        return categoryService.getById(id);
    }

    @PostMapping()
    public Category create(@RequestBody Category category) {
        return categoryService.create(category);
    }

    @PutMapping("{id}")
    public Category update(@PathVariable("id") Integer id, @RequestBody Category category) {
        return categoryService.update(category);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Integer id) {
        return categoryService.delete(id);
    }

    @PostMapping("/upload/{folder}")
    public JsonNode upload(@PathVariable("folder") String folder, @PathParam("file") MultipartFile file) {
        File savedFile = uploadService.save(file, folder + "/categories");
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode node = mapper.createObjectNode();
        node.put("name", savedFile.getName());
        node.put("size", savedFile.length());
        return node;
    }

    @GetMapping("/listParent")
    public List<Category> listParentCategory() {
        return categoryService.getListParentCategories();
    }

    @GetMapping("/listChild")
    public List<Category> listChildCategory() {
        return categoryService.getListChildCategories();
    }

    @GetMapping("/listChildByParent/{id}")
    public List<Category> listChildCategoryByParent(@PathVariable("id") String id) {
        return categoryService.getListChildCategoriesByParent(id);
    }

    @GetMapping("/listParentDto")
    public List<ParentCategoryDTO> listParentCategoryDto() {
        return categoryService.getListParentCategoryDTO();
    }
    
    @GetMapping("/listParentTop")
    public List<ParentCategoryDTO> listParentCategoryTop() {
        return categoryService.getListParentCategoryTop();
    }
}
