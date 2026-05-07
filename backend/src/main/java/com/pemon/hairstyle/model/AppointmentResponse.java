package com.pemon.hairstyle.model;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentResponse(
        @NotNull Long id,
        @NotNull LocalDate appointmentDate,
        @NotNull @FutureOrPresent LocalTime appointmentTime,
        @NotNull Long service,
        @NotNull Status status,
        @NotNull @Positive BigDecimal totalPrice,
        @NotNull Long customerId,
        @NotNull Long employeeId
) {
}
