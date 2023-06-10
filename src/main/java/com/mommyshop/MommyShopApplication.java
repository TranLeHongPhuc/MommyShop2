package com.mommyshop;

import org.modelmapper.ModelMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class MommyShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(MommyShopApplication.class, args);
    }

    // Cơ chế mã hóa mật khẩu
    @Bean
    public BCryptPasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
