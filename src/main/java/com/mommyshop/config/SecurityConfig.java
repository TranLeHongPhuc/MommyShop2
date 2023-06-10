package com.mommyshop.config;

import com.mommyshop.entity.Account;
import com.mommyshop.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    AccountService accountService;

    // Cung cấp nguồn dữ liệu đăng nhập
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(email -> {
            try {
                Account user = accountService.findByEmail(email);
                String password = user.getPassword();
                boolean active = user.isEnabled();
                String[] roles = user.getAuthorities().stream()
                    .map(er -> er.getRole().getId().toString())
                    .collect(Collectors.toList())
                    .toArray(new String[0]);
                return User.withUsername(email).password(password).roles(roles).disabled(!active).build();
            } catch (NoSuchElementException e) {
                throw new UsernameNotFoundException(email + "not found");
            }
        });
    }

    // Phân quyền sử dụng
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.csrf().disable().cors().disable();

        http.authorizeRequests()
            .antMatchers("/register")
            .permitAll();

        http.authorizeRequests()
            //.antMatchers("/order/detail/**").authenticated()
            .antMatchers("/rest/favorite/**").authenticated()
            .antMatchers("/assets/admin/**").hasAnyRole(String.valueOf(1), String.valueOf(2))
            .antMatchers("/rest/roles").hasAnyRole(String.valueOf(1), String.valueOf(2), String.valueOf(3))
            .antMatchers("/rest/authorities").hasRole(String.valueOf(1))

            .anyRequest().permitAll();

        http.formLogin()
            .loginPage("/login")
            .loginProcessingUrl("/login")
            .defaultSuccessUrl("/login/success", false)
            .failureUrl("/login/error");

        http.rememberMe()
            .tokenValiditySeconds(86400);

        http.exceptionHandling()
            .accessDeniedPage("/unauthoried");

        http.logout()
            .logoutUrl("/logoff")
            .logoutSuccessUrl("/logoff/success");

        // Oauth2
        http.oauth2Login()
            .loginPage("/login")
            .defaultSuccessUrl("/oauth2/login/success", true)
            .failureUrl("/login/error")
            .authorizationEndpoint()
            .baseUri("/oauth2/authorization");

    }

    // Cho phép truy xuất REST API từ bên ngoài (domain khác)
    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers(HttpMethod.OPTIONS, "/**");
    }


}
