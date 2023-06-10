package com.mommyshop.controller.rest;

import com.mommyshop.entity.Account;
import com.mommyshop.entity.Authority;
import com.mommyshop.entity.Role;
import com.mommyshop.service.AuthorityService;
import com.mommyshop.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@CrossOrigin("*")
@RestController
@RequestMapping("/rest/authorities")
public class AuthorityRestController {
    @Autowired
    private AuthorityService authorityService;

    @Autowired
    private RoleService roleService;

    @GetMapping
    public List<Authority> findAll(@RequestParam("admin") Optional<Boolean> admin) {
        if (admin.orElse(false)) {
            return authorityService.findAuthoritiesOfAdministrators();
        }
        return authorityService.findAll();
    }

    @PostMapping
    public Authority post(@RequestBody Authority auth) {
        return authorityService.create(auth);
    }

    @PostMapping("/role")
    public Authority createRoleGuest(@RequestBody Account account) {
        Role role = roleService.getbyId(3);
        Authority authority = new Authority();
        authority.setRole(role);
        authority.setAccount(account);
        return authorityService.create(authority);
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable("id") Integer id) {
        authorityService.delete(id);
    }
}
