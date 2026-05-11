package com.pemon.hairstyle.model;

import jakarta.validation.constraints.NotNull;

public record CustomerSummaryResponse(
        @NotNull Long id,
        @NotNull String firstName,
        @NotNull String lastName,
        @NotNull String email,
        @NotNull String phoneNumber
){
}
