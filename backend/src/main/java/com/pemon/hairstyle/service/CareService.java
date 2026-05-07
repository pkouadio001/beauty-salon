package com.pemon.hairstyle.service;

import com.pemon.hairstyle.model.Care;
import com.pemon.hairstyle.repository.CareRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
public class CareService {
    private final CareRepository careRepository;

    public CareService(CareRepository careRepository) {
        this.careRepository = careRepository;
    }

    public Optional<Care> getServiceById(Long id) {
        return Optional.of(careRepository.findById(id).orElseThrow( () -> new IllegalArgumentException("Service not found")));
    }

    public List<Care> getAllServices() {
        return careRepository.findAll();
    }
}
