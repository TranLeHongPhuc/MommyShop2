package com.mommyshop.service;

import com.mommyshop.entity.Account;
import com.mommyshop.entity.Authority;
import com.mommyshop.entity.Role;
import com.mommyshop.mail.MailService;
import com.mommyshop.object.UserDTO;
import com.mommyshop.repository.AccountRepository;
import com.mommyshop.utilities.Helper;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountService {
    @Autowired
    AccountRepository repo;

    @Autowired
    RoleService roleService;

    @Autowired
    AuthorityService authorityService;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    MailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    MailerService mailer;

    @Autowired
    Helper helper;

    public Account findByEmail(String email) {
        return repo.findByEmail(email);
    }

    //	public boolean userExistss(String email) {
//		return findByEmail(email).i;
//	}
    public List<Account> getAll() {
        return repo.findAll();
    }

    public List<Account> getUser() {
        return repo.getUser();
    }

    public Account getOne(Integer id) {
        return repo.findById(id).get();
    }

    public Account create(Account accountData) {
        return repo.save(accountData);
    }

    public Account update(Account account) {
        return repo.save(account);
    }

    public void delete(Integer id) {
        repo.deleteById(id);

    }

    public void sendRandomCodeToEmail(String subject, String body, String randomCode, Account account)
        throws MessagingException {
        String to = account.getEmail();
        body += "<p> <br><br> </p>";
        body += "<p><br><br><br><br><br><br>Thank you <br> FTeam</p>";
        mailer.send(to, subject, "",randomCode, account.getFullname());
    }

    public void loginFromOAuth2(OAuth2AuthenticationToken oauth2) {
        String email = oauth2.getPrincipal().getAttribute("email");
        String password = Long.toHexString(System.currentTimeMillis());
        Account account = repo.findByEmail(email);
        UserDetails user = null;
        if (account == null) {
            account = new Account(null, oauth2.getPrincipal().getAttribute("name"), "", true, password, email, "", null,
                null, null, "gooogle", null);
            repo.save(account);
            user = User.withUsername(account.getEmail()).password(account.getPassword()).roles(String.valueOf(3))
                .build();
            Role role = roleService.getbyId(3);
            Authority authority = new Authority();
            authority.setRole(role);
            authority.setAccount(account);
            authorityService.create(authority);
        } else {
            String[] roles = account.getAuthorities().stream().map(er -> er.getRole().getId().toString())
                .collect(Collectors.toList()).toArray(new String[0]);
            user = User.withUsername(account.getEmail()).password(account.getPassword()).roles(roles).build();
        }

        Authentication auth = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);

    }

    //	tạo register từ account
    public Account register(UserDTO userDTO) {
        // Mã hóa password
        String password = passwordEncoder.encode(userDTO.getPassword());
        userDTO.setPassword(password);
        String randomCode = "";

        for (int i = 0; i < 6; i++) {
            String random = String.valueOf(helper.getRandomNumberUsingNextInt(0, 9));
            randomCode += random;
        }

        Account account = new Account();
        // vô hiệu hóa người dùng mới trước khi kích hoạt
        account.setEnabled(false);
        account.setVerificationToken(randomCode);
        // ánh xạ userDTO đến Account
        modelMapper.map(userDTO, account);

        Optional<Account> saved = Optional.of(create(account));
        //Thêm và lưu mã thông báo xác minh nếu account dùng được lưu
        try {
            String subject = "Vui lòng kiểm tra Mã xác thực của BẠN  Mommyshop đã nhận được yêu cầu sử dụng địa chỉ email này để đăng ký Tài khoản ";
            String to = userDTO.getEmail();
            String text = "<p>Xin Chào " + userDTO.getFullname() + ",</p>";
           
            text = "<p>Dear " + account.getFullname() + ",</p>";
            text += "<!DOCTYPE html>\r\n"
                + "<html lang=\"en\">\r\n"
                + "<head>\r\n"
                + "    <meta charset=\"UTF-8\">\r\n"
                + "    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\r\n"
                + "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\r\n"
                + "    <title>Document</title>\r\n"
                + "    <style>\r\n"
                + "        .mail-table{\r\n"
                + "            margin: auto;\r\n"
                + "            width: 700px;\r\n"
                + "            height: 70px;\r\n"
                + "            background-color: rgb(241, 101, 36);\r\n"
                + "        }\r\n"
                + "        .mail-table .header{\r\n"
                + "            width: 100%;\r\n"
                + "            height: 100%;\r\n"
                + "            text-align: center;\r\n"
                + "        }\r\n"
                + "        .mail-table .header img{\r\n"
                + "            height: 100%;\r\n"
                + "        }\r\n"
                + "        .mail-table .content{\r\n"
                + "            margin-top: 5px;\r\n"
                + "        }\r\n"
                + "        .mail-table .content table{\r\n"
                + "            background-color: rgb(26, 137, 180);\r\n"
                + "            width: 100%;\r\n"
                + "        }\r\n"
                + "        .mail-table .content table thead th{\r\n"
                + "            font-weight: 700;\r\n"
                + "            font-size: larger;\r\n"
                + "            text-transform: uppercase;\r\n"
                + "            padding: 10px;\r\n"
                + "            color: white;\r\n"
                + "        }\r\n"
                + "        .mail-table .content table tbody{\r\n"
                + "            background-color: rgb(123, 190, 217);\r\n"
                + "        }\r\n"
                + "        .mail-table .content table tbody tr td:first-child {\r\n"
                + "            text-align: center;\r\n"
                + "        }\r\n"
                + "        .mail-table .content table tbody tr td{\r\n"
                + "            padding: 10px;\r\n"
                + "            font-size: large;\r\n"
                + "            font-weight: 600;\r\n"
                + "        }\r\n"
                + "    </style>\r\n"
                + "</head>\r\n"
                + "<body>\r\n"
                + "    <div class=\"container\">\r\n"
                + "        <div class=\"mail-table\">\r\n"
                + "            <div class=\"header\">\r\n"
                + "                <h3>Mommyshop đã nhận được yêu cầu sử dụng địa chỉ email này để đăng ký Tài khoản </h3>\r\n"
                + "            </div>\r\n"
                + "            <div class=\"content\">\r\n"
                + "                <table style=\"width: 100%;\">\r\n"
                + "                    <thead>\r\n"
                + "                        <tr>\r\n"
                + "                            <th>Email</th>\r\n"
                + "                            <th>Mã xác nhận</th>\r\n"
                + "                        </tr>\r\n"
                + "                    </thead>\r\n"
                + "                    <tbody>\r\n"
                + "                        <tr>\r\n"
                + "                            <td>" + to + "</td>\r\n"
                + "                            <td>" + randomCode + "</td>\r\n"
                + "                        </tr>\r\n"
                + "                    </tbody>\r\n"
                + "                </table>\r\n"
                + "            </div>\r\n"
                + "        </div>\r\n"
                + "    </div>\r\n"
                + "</body>\r\n"
                + "</html>";
           
          sendRandomCodeToEmail(subject, text, randomCode, account);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return saved.get();
    }
}
