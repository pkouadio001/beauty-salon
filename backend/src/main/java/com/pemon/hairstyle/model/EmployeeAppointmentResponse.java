package com.pemon.hairstyle.model;

import java.math.BigDecimal;

public record EmployeeAppointmentResponse(BigDecimal totalPrice, String service, Status status) {
}
