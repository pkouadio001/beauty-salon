package com.pemon.hairstyle.service;

import com.pemon.hairstyle.model.Care;
import com.pemon.hairstyle.model.ServiceSummaryResponse;
import com.pemon.hairstyle.repository.CareRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


@Service
public class CareService {
    private final CareRepository careRepository;

    public CareService(CareRepository careRepository) {
        this.careRepository = careRepository;
    }

    public ServiceSummaryResponse findServiceById(Long id) {
        if (!careRepository.existsById(id)) {
            throw new IllegalArgumentException("Service not found");
        }
        return toServiceSummaryResponse(careRepository.findById(id).orElseThrow( () -> new IllegalArgumentException("Service not found")));
    }

    public List<Care> getAllServices() {
        return careRepository.findAll();
    }

    private ServiceSummaryResponse toServiceSummaryResponse(Care service) {
        return new ServiceSummaryResponse(service.getId(), service.getName(), new BigDecimal(service.getPrice()));
    }
}
