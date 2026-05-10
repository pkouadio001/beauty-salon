package com.pemon.hairstyle.controller;

import com.pemon.hairstyle.model.Care;
import com.pemon.hairstyle.repository.CareRepository;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CareController {

    private final CareRepository careRepository;

    public CareController(CareRepository careRepository) {
        this.careRepository = careRepository;
    }

    @GetMapping("/services")
    public List<Care> getAllServices() {
        return careRepository.findAll();
    }

    @GetMapping("/services/{serviceId}")
    public Care getServiceById(@Valid @PathVariable Long serviceId) {
        return careRepository.findById(serviceId).orElseThrow(() -> new IllegalArgumentException("Service not found"));
    }

}