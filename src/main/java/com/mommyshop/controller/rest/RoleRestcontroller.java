package com.mommyshop.controller.rest;

import com.mommyshop.entity.Role;
import com.mommyshop.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("rest/roles")
public class RoleRestcontroller {

    @Autowired
    RoleService roleService;

    @GetMapping()
    public List<Role> getAll() {
        return roleService.getAll();
    }

    @PostMapping("/create")
    public Role create(@RequestBody Role role) {
        return roleService.create(role);
    }

    @PutMapping("/{id}")
    public Role update(@PathVariable("id") Integer id, @RequestBody Role role) {
        return roleService.update(role);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable("id") Integer id) {
        roleService.delete(id);
    }


}
