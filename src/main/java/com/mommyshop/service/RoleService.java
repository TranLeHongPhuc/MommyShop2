package com.mommyshop.service;

import com.mommyshop.entity.Role;
import com.mommyshop.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public List<Role> getAll() {

        return roleRepository.findAll();
    }

    public Role getbyId(Integer id) {
        return roleRepository.findById(id).get();
    }

    public Role create(Role role) {
        return roleRepository.save(role);
    }

    public Role update(Role role) {
        return roleRepository.save(role);
    }

    public void delete(Integer id) {
        roleRepository.deleteById(id);

    }


}
