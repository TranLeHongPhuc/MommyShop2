package com.mommyshop.controller.rest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mommyshop.entity.Account;
import com.mommyshop.entity.Order;
import com.mommyshop.repository.RatingImageRepository;
import com.mommyshop.service.*;
import com.mommyshop.utilities.Helper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import javax.servlet.ServletContext;
import javax.websocket.server.PathParam;
import java.io.File;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/accounts")
public class AccountRestController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private CartService cartService;

    @Autowired
    private AddressService addressService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderDetailService orderDetailService;

    @Autowired
    private RatingService ratingService;

    @Autowired
    private RatingImageRepository ratingImageRepository;

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private AuthorityService authorityService;

    @Autowired
    private RoleService roleService;

    @Autowired
    PasswordEncoder pe;

    @Autowired
    ServletContext app;

    @Autowired
    private UploadService uploadService;

    @Autowired
    private Helper helper;

    @GetMapping()
    public List<Account> getAll() {
        return accountService.getAll();
    }

    @GetMapping("/user")
    public List<Account> getUser() {
        return accountService.getUser();
    }

    @GetMapping("/email/{email}")
    public Integer findByEmail(@PathVariable("email") String email) {
        Account account = accountService.findByEmail(email);
        return account.getId();
    }

    @GetMapping("/account/email/{email}")
    public Account getAccountByEmail(@PathVariable("email") String email) {
        return accountService.findByEmail(email);
    }

    @GetMapping("/{id}")
    public Account getOne(@PathVariable("id") Integer id) {
        return accountService.getOne(id);
    }

    @PostMapping("/create")
    public Account create(@RequestBody Account account) {
        account.setPassword(pe.encode(account.getPassword()));

        return accountService.create(account);
    }

    @PutMapping("/update/{id}")
    public Account update(@PathVariable("id") Integer id, @RequestBody Account account) {
        return accountService.update(account);
    }

    // Delete
    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable("id") Integer id) {
        Account account = accountService.getOne(id);
        // xóa cart của account
        cartService.deleteAllByAccount(id);
        // xóa address của account
        addressService.deleteAllByAccountId(id);
        // xóa yeu thich của account
        favoriteService.deleteAllByAccountId(id);
        // xóa role của account
        authorityService.deleteAllByAccountId(id);
        List<Order> orders = orderService.findByAccount(id);
        for (int i = 0; i < orders.size(); i++) {
            // xóa rating và rating images
            ratingService.deleteByOrder(orders.get(i).getId());
            // xóa order và orderdetails của account
            orderDetailService.deleteAllByOrderId(orders.get(i).getId());
            orderService.deleteById(orders.get(i).getId());
        }
        uploadService.delete(account.getPhoto(), "images/accounts");
        accountService.delete(id);
    }

    @PostMapping("/upload/{folder}")
    public JsonNode upload(@PathVariable("folder") String folder, @PathParam("file") MultipartFile file) {
        File savedFile = uploadService.save(file, folder + "/accounts");
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode node = mapper.createObjectNode();
        node.put("name", savedFile.getName());
        node.put("size", savedFile.length());
        return node;
    }

    @DeleteMapping("/delete/{folder}/name/{name}")
    public void delete(@PathVariable("folder") String folder, @PathVariable("name") String name) {
        uploadService.delete(name, folder + "/accounts");
    }

    // change password
    @PutMapping("/change")
    public Account changePassword(@RequestBody Account account) {
        account.setPassword(pe.encode(account.getPassword()));
        return accountService.update(account);
    }

    // forget password
    @PutMapping("/forget")
    public Account updateverification(@RequestBody Account account) throws MessagingException {
        String randomCode = "";
        for (int i = 0; i < 6; i++) {
            String random = String.valueOf(helper.getRandomNumberUsingNextInt(0, 9));
            randomCode += random;
        }
        //String logo=app.getRealPath("/src/main/resources/static/assets/images/logomail.png");
        String subject = "Vui lòng kiểm tra Mã xác minh của BẠN để biết Quên mật khẩu";
        String to = account.getEmail();
        String text = "<p>Dear " + account.getFullname() + ",</p>";
       
        accountService.sendRandomCodeToEmail(subject, text, randomCode, account);
        account.setVerificationToken(randomCode);
        return accountService.update(account);
    }

}
