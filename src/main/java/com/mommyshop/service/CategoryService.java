package com.mommyshop.service;

import com.mommyshop.dto.ParentCategoryDTO;
import com.mommyshop.entity.Category;
import com.mommyshop.repository.CategoryRepository;
import com.mommyshop.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    CategoryRepository repo;

    @Autowired
    private ProductRepository productRepository;

    public List<Category> getTop6Categories() {
        return repo.findTop6Categories();
    }

    public List<Category> getAll() {
        return repo.findAll();
    }

    public Category findCategoryByName(String name) {
        return repo.findFirstByName(name);
    }

    public Category getById(Integer id) {
        return repo.findById(id).get();
    }

    public Category create(Category category) {
        if (findCategoryByName(category.getName()) != null) {
            return null;
        }
        return repo.save(category);
    }

    public Category update(Category category) {
        return repo.save(category);
    }

    public String delete(Integer id) {
        if (productRepository.findFirstByCategoryId(id) != null) {
            return "Existed integrated Products";
        }
        Category byId = getById(id);
        if (getById(id) == null) {
            return "Not found";
        } else if (byId.getCategories().size() > 0) {
            return "Existed child Categories";
        }
        repo.deleteById(id);
        return "OK";
    }

    public List<Category> getListParentCategories() {
        return repo.getListParentCategories();
    }

    public List<ParentCategoryDTO> getListParentCategoryDTO() {
        List<ParentCategoryDTO> parentCategoryDTOs = new ArrayList<>();
        List<Category> listParentCategories = repo.getListParentCategories();
        for (Category category : listParentCategories) {
            parentCategoryDTOs.add(new ParentCategoryDTO(category));
        }

        return parentCategoryDTOs;
    }

    public List<Category> getListChildCategories() {
        return repo.getListChildCategories();
    }

    public List<Category> getListChildCategoriesProductsExist() {
        return repo.getListChildCategoriesProductsExist();
    }

    public List<Category> getListChildCategoriesByParent(String parentId) {
        return repo.getListChildCategoriesByParent(parentId);
    }

    public List<ParentCategoryDTO> getListParentCategoryTop() {
        List<ParentCategoryDTO> parentCategoryDTOs = new ArrayList<>();
        List<Category> listParentCategories = repo.getTopListParentCategories();
        for (Category category : listParentCategories) {
            parentCategoryDTOs.add(new ParentCategoryDTO(category));
        }

        return parentCategoryDTOs;
    }
}
