package com.pemon.hairstyle.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record BookAppointmentRequest(
        Long customerId,
        Long serviceId,
        Long employeeId,
        BigDecimal totalPrice,
        LocalDate appointmentDate,
        LocalTime appointmentTime
) {
}