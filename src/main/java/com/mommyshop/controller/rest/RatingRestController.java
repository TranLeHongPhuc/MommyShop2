package com.mommyshop.controller.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mommyshop.entity.Rating;
import com.mommyshop.service.RatingService;
import com.mommyshop.service.UploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.websocket.server.PathParam;
import java.io.File;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/ratings")
public class RatingRestController {

    @Autowired
    private RatingService ratingService;

    @Autowired
    private UploadService uploadService;

    @GetMapping()
    public List<Rating> getAll() {
        return ratingService.getAll();
    }

    @GetMapping("/star/{star}")
    public List<Rating> findByStar(@PathVariable("star") Integer star) {
        return ratingService.findByStar(star);
    }

    @GetMapping("/by-order/{id}")
    public List<Rating> getByOrder(@PathVariable("id") Integer id) {
        return ratingService.getByOrder(id);
    }

    @GetMapping("/{id}")
    public Rating getOne(@PathVariable("id") Integer id) {
        return ratingService.getOne(id);
    }

    @PostMapping()
    public Rating create(@RequestBody JsonNode rating) {
        return ratingService.create(rating);
    }

    @PutMapping("/update/{id}")
    public Rating update(@PathVariable("id") Integer id, @RequestBody Rating account) {
        return ratingService.update(account);
    }

    // Delete
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable("id") Integer id) {
        ratingService.delete(id);
    }

    @PostMapping("/upload/{folder}")
    public JsonNode upload(@PathVariable("folder") String folder, @PathParam("file") MultipartFile file) {
        File savedFile = uploadService.save(file, folder + "/ratings");
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode node = mapper.createObjectNode();
        node.put("name", savedFile.getName());
        node.put("size", savedFile.length());
        return node;
    }

    @DeleteMapping("/delete/{folder}/name/{name}")
    public void delete(@PathVariable("folder") String folder, @PathVariable("name") String name) {
        uploadService.delete(name, folder + "/ratings");
    }

}
