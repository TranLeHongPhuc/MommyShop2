package com.mommyshop.utilities;

import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class Helper {
    public int getRandomNumberUsingNextInt(int min, int max) {
        Random random = new Random();
        return random.nextInt(max - min) + min;
    }
}
