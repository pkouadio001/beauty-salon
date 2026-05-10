package com.pemon.hairstyle.model;

import jakarta.validation.constraints.NotBlank;

public record RegisterEmployeeRequest(
        @NotBlank(message = "First name is required")
        String firstName,
        @NotBlank(message = "Last name is required")
        String lastName,
        @NotBlank(message = "Email is required")
        String email,
        @NotBlank(message = "Phone number is required")
        String phoneNumber,
        @NotBlank(message = "Password is required")
        String password,
        @NotBlank(message = "Specialization is required")
        String specialization,
        @NotBlank(message = "Date of birth is required")
        String dateOfBirth
) {
}
