package com.mommyshop.service;

import com.mommyshop.entity.address.Address;
import com.mommyshop.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressService {

    private final AddressRepository addressRepository;

    public Address save(Address address) {
        return addressRepository.save(address);
    }

    public Address getById(Integer id) {
        return addressRepository.getById(id);
    }

    public List<Address> findAllByAccountId(Integer accountId) {
        return addressRepository.findAllByAccountId(accountId);
    }

    public void setDefaultAddress(Integer idDefaultAddress, Integer accountId) {
        if (idDefaultAddress > 0) {
            addressRepository.setDefaultAddress(idDefaultAddress);
        }
        addressRepository.setNonDefaultForOthers(idDefaultAddress, accountId);
    }

    public Address findById(Integer id) {
        return addressRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("address not found"));
    }

    public boolean delete(Integer addressId, Integer accountId) {
        if (getById(addressId).getIsDefault()) {
            return false;
        }
        addressRepository.deleteByIdAndAccountId(addressId, accountId);
        return true;
    }

    public Address create(Address address) {
        return addressRepository.save(address);
    }

    public void deleteAllByAccountId(Integer id) {
        addressRepository.deleteAllByAccountId(id);
    }
}
