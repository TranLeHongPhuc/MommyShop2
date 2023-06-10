package com.mommyshop.controller.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mommyshop.entity.Brand;
import com.mommyshop.service.BrandService;
import com.mommyshop.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.websocket.server.PathParam;
import java.io.File;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/brands")
public class BrandRestController {

    @Autowired
    private BrandService brandService;

    @Autowired
    private UploadService uploadService;

    @GetMapping()
    public List<Brand> getAll() {
        return brandService.getAll();
    }

    private String photo = null;

    @GetMapping("{id}")
    public Brand getOne(@PathVariable("id") Integer id) {
        return brandService.getById(id);
    }

    @PostMapping()
    public Brand create(@RequestBody Brand brand) {
        return brandService.create(brand);
    }
    
    @GetMapping("/top-brand")
    public List<Brand> topBrands(){
        return brandService.getTopBrands();
    }

    @PostMapping("/upload/{folder}")
    public JsonNode upload(@PathVariable("folder") String folder, @PathParam("file") MultipartFile file) {
        File savedFile = uploadService.save(file, folder + "/brands");
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode node = mapper.createObjectNode();
        node.put("name", savedFile.getName());
        node.put("size", savedFile.length());
        return node;
    }

    @PutMapping("{id}")
    public Brand update(@PathVariable("id") Integer id, @RequestBody Brand brand) {
        return brandService.update(brand);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Integer id) {
        photo = brandService.getById(id).getLogo();
        brandService.delete(id);
    }

    @DeleteMapping("/images")
    public void deleteImage() {
        uploadService.delete(photo, "images/brands/");
    }
}
