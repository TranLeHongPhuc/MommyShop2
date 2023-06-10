package com.mommyshop.service;

import com.mommyshop.entity.Account;
import com.mommyshop.entity.Authority;
import com.mommyshop.repository.AccountRepository;
import com.mommyshop.repository.AuthorityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class AuthorityService {
    @Autowired
    AuthorityRepository authorityRepo;
    @Autowired
    AccountRepository accountRepo;


    public List<Authority> findAuthoritiesOfAdministrators() {
        List<Account> accounts = accountRepo.getAdministrators();
        return authorityRepo.authoritiesOf(accounts);
    }


    public List<Authority> findAll() {

        return authorityRepo.findAll();
    }


    public Authority create(Authority auth) {

        return authorityRepo.save(auth);
    }


    public void delete(Integer id) {
        authorityRepo.deleteById(id);

    }

    public void deleteAllByAccountId(Integer id) {
        authorityRepo.deleteAllByAccountId(id);

    }
}
