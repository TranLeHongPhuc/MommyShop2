package com.mommyshop.utilities;

import com.mommyshop.entity.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CheckFavorite {

    public List<Product> getFavorite(List<Product> products, Integer accountId) {
        for (int i = 0; i < products.size(); i++) {
            if (products.get(i).getFavorites().size() > 0) {
                for (int j = 0; j < products.get(i).getFavorites().size(); j++) {
                    if (accountId == products.get(i).getFavorites().get(j).getAccount().getId()) {
                        products.get(i).setLiked(1);
                        //productService.update(sellingProducts.get(i));
                    } else if (accountId == null) {
                        products.get(i).setLiked(2);
                    }
                }
            }
        }
        return products;
    }

    public Product getFavoriteOne(Product product, Integer accountId) {
        for (int j = 0; j < product.getFavorites().size(); j++) {
            if (accountId == product.getFavorites().get(j).getAccount().getId()) {
                product.setLiked(1);
                //productService.update(sellingProducts.get(i));
            } else if (accountId == null) {
                product.setLiked(2);
            }
        }
        return product;
    }

}
