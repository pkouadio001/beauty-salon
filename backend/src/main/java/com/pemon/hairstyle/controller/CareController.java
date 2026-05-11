package com.pemon.hairstyle.controller;

import com.pemon.hairstyle.model.Care;
import com.pemon.hairstyle.model.ServiceSummaryResponse;
import com.pemon.hairstyle.repository.CareRepository;
import com.pemon.hairstyle.service.CareService;
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
    private final CareService careService;

    public CareController(CareRepository careRepository, CareService careService) {
        this.careRepository = careRepository;
        this.careService = careService;
    }

    @GetMapping("/services")
    public List<Care> getAllServices() {
        return careRepository.findAll();
    }

    @GetMapping("/services/{serviceId}")
    public ServiceSummaryResponse getServiceById(@Valid @PathVariable Long serviceId) {
        return careService.findServiceById(serviceId);
    }

}