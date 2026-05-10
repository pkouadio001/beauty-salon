package com.pemon.hairstyle.model;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record ServiceSummaryResponse(
        @NotNull
        Long serviceId,
        @NotNull
        String serviceName,
        @NotNull
        BigDecimal servicePrice
) {
}
