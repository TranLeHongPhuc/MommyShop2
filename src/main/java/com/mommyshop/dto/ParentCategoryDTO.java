package com.mommyshop.dto;

import com.mommyshop.entity.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ParentCategoryDTO implements Serializable {
    private Integer id;
    private String name;
    private String icon;
    private List<Category> categories;

    public ParentCategoryDTO(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.icon = category.getIcon();
        this.categories = category.getCategories();
    }
}
