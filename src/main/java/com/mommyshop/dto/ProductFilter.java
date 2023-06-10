package com.mommyshop.dto;

import com.mommyshop.entity.Brand;
import com.mommyshop.entity.Category;
import com.mommyshop.entity.Product;
import com.mommyshop.service.ProductService;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Builder
public class ProductFilter {

    private String keyword;
    private Integer[] categoryIds;
    private Integer[] brandIds;
    private Float maxPrice;
    private Float minPrice;
    private Integer sortType;
    private String priceOrder;
    private int pageNum;

    public Pageable getPageable() {
        Sort sort = this.sort();
        if (sort != null) {
            return PageRequest.of(pageNum - 1, ProductService.PRODUCT_PER_PAGE, sort);
        }
        return PageRequest.of(pageNum - 1, ProductService.PRODUCT_PER_PAGE);
    }

    private Sort sort() {
        Sort sort = null;

        if (sortType != null) {
            switch (sortType) {
                case 1: {
                    sort = Sort.by(Sort.Direction.DESC, Product.Fields.createDate);
                    break;
                }
                case 3: {
                    sort = Sort.by(Sort.Direction.DESC, Product.Fields.favorites);
                    break;
                }
                case 4: {
                    sort = Sort.by(Sort.Direction.ASC, Product.Fields.price)
                        .and(Sort.by(Sort.Direction.ASC, Product.Fields.discount));
                    break;
                }
                case 5: {
                    sort = Sort.by(Sort.Direction.DESC, Product.Fields.price)
                        .and(Sort.by(Sort.Direction.DESC, Product.Fields.discount));
                    break;
                }
                default: {
                    sort = Sort.by(Sort.Direction.ASC, Product.Fields.price)
                        .and(Sort.by(Sort.Direction.ASC, Product.Fields.discount));
                    break;
                }
            }
        }

        return sort;
    }

    public Specification<Product> getSpecification() {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null) {
                predicates.add(cb.or(
                    cb.like(cb.lower(root.get(Product.Fields.name)), "%" + keyword + "%"),
                    cb.like(cb.lower(root.get(Product.Fields.shortDesc)), "%" + keyword + "%"),
                    cb.like(cb.lower(root.get(Product.Fields.longDesc)), "%" + keyword + "%")));
            }
            if (minPrice != null && minPrice > 0) {
                predicates.add(cb.ge(root.get(Product.Fields.price), minPrice));
            }
            if (maxPrice != null && maxPrice > 0) {
                predicates.add(cb.le(root.get(Product.Fields.price), maxPrice));
            }
            if (categoryIds != null && categoryIds.length > 0) {
                Join<Category, Product> category = root.join(Product.Fields.category, JoinType.INNER);
                predicates.add(cb.isTrue(category.get("id").in(categoryIds)));
            }
            if (brandIds != null && brandIds.length > 0) {
                Join<Brand, Product> brand = root.join(Product.Fields.brand, JoinType.INNER);
                predicates.add(cb.isTrue(brand.get("id").in(brandIds)));
            }

            return cb.and(predicates.toArray(new Predicate[predicates.size()]));
        };
    }
}
