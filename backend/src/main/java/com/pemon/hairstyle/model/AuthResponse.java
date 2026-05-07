package com.pemon.hairstyle.model;

import jakarta.validation.constraints.NotNull;

public record AuthResponse(
        @NotNull Long id,
        @NotNull String email,
        @NotNull String role,
        @NotNull String redirectTo) {

}