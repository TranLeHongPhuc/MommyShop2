package com.mommyshop.controller;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.mommyshop.entity.Account;
import com.mommyshop.entity.Authority;
import com.mommyshop.entity.Role;
import com.mommyshop.object.UserDTO;
import com.mommyshop.service.AccountService;
import com.mommyshop.service.AuthorityService;
import com.mommyshop.service.RoleService;

@Controller
@RequestMapping("")
public class AccountController {

	@Autowired
	private AccountService accountService;
	@Autowired
	private AuthorityService authorityService;
	@Autowired
	private RoleService roleService;
	private String checkcode = null;
	private String emailCheck;
	private UserDTO user;

	@GetMapping("/change-password")
	public String changePasswordForm() {
		return "user/change_password";
	}

	@GetMapping("/forgot-password")
	public String forgotPasswordForm() {
		return "user/forgot_password";
	}

	@GetMapping("/forgot-password/verify")
	public String forgotPasswordVerify() {
		return "user/forgot_password_verify";
	}

	@GetMapping("/profile")
	public String profile(HttpServletRequest req, Model model) {

		return "user/profile";
	}

	@GetMapping("/register")
	public String register(@ModelAttribute UserDTO userDTO, Model model) {
		model.addAttribute("UserDTO", userDTO);

		// model.addAttribute("checkcode", checkcode);

		return "user/register";
	}

	// kiểm tra người dung
	@PostMapping("/register")
	public String save(@Valid UserDTO userDTO, BindingResult bindingResult, RedirectAttributes re, Model model) {
		Account checkmail = accountService.findByEmail(userDTO.getEmail());

		// check mail đã sử dụng
		if (checkmail != null) {
			bindingResult.addError(new FieldError("userDTO", "email", "Địa chỉ Email này đã có người sử dụng!"));

		}

		// Kiểm tra người dùng có nhập trùng pass không
		if (userDTO.getPassword() != null && userDTO.getRpassword() != null) {
			if (!userDTO.getPassword().equals(userDTO.getRpassword())) {
				bindingResult.addError(new FieldError("userDTO", "rpassword", "Mật khẩu phải nhập trùng nhau!"));
			}
		}

		if (bindingResult.hasErrors()) {

			checkcode = null;
			return "user/register";
		} else {
			checkcode = "nike";
			//re.addFlashAttribute("message", "thành công! một email xác minh đã được gửi đến địa chỉ email của bạn");
			model.addAttribute("message", "thành công! một email xác minh đã được gửi đến địa chỉ email của bạn");
			userDTO.setPhoto("default.png");
			accountService.register(userDTO);
			emailCheck = userDTO.getEmail();
			user = userDTO;
		}
		model.addAttribute("userDTO", user);
		model.addAttribute("checkcode", checkcode);
		userDTO.getFullname();
		return "user/register";

	}

	@RequestMapping("/register/code")
	public String checkCode(RedirectAttributes re, Model model) throws InterruptedException {
		// System.out.println(mycode + " it's my code");
		Account account = accountService.findByEmail(emailCheck);
		// System.out.println("Mã đúng");
		account.setEnabled(true);
		accountService.create(account);
		Role role = roleService.getbyId(3);
		Authority authority = new Authority();
		authority.setRole(role);
		authority.setAccount(account);
		authorityService.create(authority);
		re.addFlashAttribute("message", "Mã xác nhận đúng ! Bạn đã đăng ký thành công");
		checkcode = null;

		return "redirect:/register";

	}

}
