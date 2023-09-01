package com.mommyshop.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mommyshop.entity.Account;
import com.mommyshop.entity.Rating;
import com.mommyshop.entity.RatingImage;
import com.mommyshop.mail.MailService;
import com.mommyshop.repository.RatingImageRepository;
import com.mommyshop.repository.RatingRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingService {
    @Autowired
    RatingRepository repo;

    @Autowired
    RatingImageRepository ratingImageRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    MailService emailService;

    @Autowired
    MailerService mailer;

    @Autowired
    OrderService orderService;

    @Autowired
    UploadService uploadService;

    public List<Rating> findByStar(Integer star) {
        return repo.findByStar(star);
    }

    public List<Rating> getAll() {
        return repo.findAll();
    }

    public Rating getOne(Integer id) {
        return repo.findById(id).get();
    }

    public Rating create(JsonNode ratingData) {
        ObjectMapper mapper = new ObjectMapper();
        Rating rating = mapper.convertValue(ratingData, Rating.class);
        repo.save(rating);

        TypeReference<List<RatingImage>> type = new TypeReference<List<RatingImage>>() {
        };
        List<RatingImage> ratingImage = mapper.convertValue(ratingData.get("ratingImages"), type).stream()
            .peek(d -> d.setRating(rating)).collect(Collectors.toList());
        System.out.println(ratingImage.size() + "hehe");
        ratingImageRepository.saveAll(ratingImage);

        return rating;
    }

    public Rating update(Rating rating) {
        return repo.save(rating);
    }

    public void delete(Integer id) {
        repo.deleteById(id);

    }

    public void deleteByOrder(Integer id) {
        List<Rating> ratings = repo.findByOrder(orderService.findById(id));
        for (int i = 0; i < ratings.size(); i++) {
            for (int j = 0; j < ratings.get(i).getRatingImages().size(); j++) {
                uploadService.delete(ratings.get(i).getRatingImages().get(j).getName(), "images/ratings");
            }
            ratingImageRepository.deleteAllByRatingId(ratings.get(i).getId());
        }
        repo.deleteAllByOrderId(id);
    }

   

    public List<Rating> getByOrder(Integer id) {
        return repo.getByOrder(id);
    }

}
