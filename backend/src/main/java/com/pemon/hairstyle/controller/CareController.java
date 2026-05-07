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
@RequestMapping("/api/v1/cares")
public class CareController {

    private final CareRepository careRepository;

    public CareController(CareRepository careRepository) {
        this.careRepository = careRepository;
    }

    @GetMapping
    public List<Care> getAllServices() {
        return careRepository.findAll();
    }

    @GetMapping("/{id}")
    public Care getServiceById(@Valid @PathVariable Long id) {
        return careRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Service not found"));
    }

}