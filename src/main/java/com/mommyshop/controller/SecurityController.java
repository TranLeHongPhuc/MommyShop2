package com.mommyshop.controller;

import com.mommyshop.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SecurityController {
    @Autowired
    private AccountService accountService;

    @RequestMapping("/login")
    public String loginForm(Model model) {
        model.addAttribute("message", "Vui lòng đăng nhập");
        return "user/login";
    }

    @RequestMapping("/login/success")
    public String loginSuccess(Model model) {
        model.addAttribute("message", "Đăng nhập thành công");
        return "redirect:/";
    }

    @RequestMapping("/login/error")
    public String loginError(Model model) {
        model.addAttribute("message", "Sai thông tin đăng nhập");
        return "user/login";
    }

    @RequestMapping("/unauthoried")
    public String unauthoried(Model model) {
        model.addAttribute("message", "Không có quyền truy xuất");
        return "user/login";
    }

    @RequestMapping("/logoff/success")
    public String logoffSuccess(Model model) {
        model.addAttribute("message", "Bạn đã đăng xuất");
        return "user/login";
    }

    @RequestMapping("/oauth2/login/success")
    public String success(OAuth2AuthenticationToken oauth2) {
        accountService.loginFromOAuth2(oauth2);
        return "forward:/login/success";
    }
}
