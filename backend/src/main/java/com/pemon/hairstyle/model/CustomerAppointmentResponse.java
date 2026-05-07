package com.pemon.hairstyle.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record CustomerAppointmentResponse(BigDecimal totalPrice, String service, LocalDate appointmentDate, LocalTime appointmentTime, Status status) {
}
