package com.pemon.hairstyle.controller;

import com.pemon.hairstyle.model.*;
import com.pemon.hairstyle.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/appointments/{appointmentId}")
    public List<AppointmentResponse> getAppointmentsById(@PathVariable Long appointmentId) {
        return appointmentService.getAppointmentsById(appointmentId);
    }

    @GetMapping("/customers/{customerId}/appointments")
    public List<CustomerAppointmentResponse> getCustomerAppointmentsById(@PathVariable Long customerId) {
        return appointmentService.getCustomerAppointmentsById(customerId);
    }

    @GetMapping("/employees/{employeeId}/appointments")
    public List<AppointmentResponse> getEmployeeAppointmentsById(@PathVariable Long employeeId) {
        return appointmentService.getAppointmentsByEmployeeId(employeeId);
    }

    @GetMapping("/appointments")
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @PostMapping("/appointments")
    public AppointmentResponse bookAppointment(@RequestBody BookAppointmentRequest request) {
        return appointmentService.saveAppointment(request);
    }

    //change appointment provider
    @PatchMapping("/appointments/{appointmentId}/employee")
    public AppointmentResponse changeAppointmentProvider(@PathVariable Long appointmentId, @RequestBody ChangeAppointmentProvider request ) {

        return appointmentService.changeAppointmentProvider(appointmentId, request.employeeId() );
    }

    @DeleteMapping("/appointments/{appointmentId}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long appointmentId) {
        appointmentService.deleteAppointmentRequest(appointmentId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/appointments/{appointmentId}/status")
    public AppointmentResponse changeAppointmentStatus(@PathVariable Long appointmentId, @RequestBody ChangeAppointmentStatus request ) {

        return appointmentService.changeAppointmentStatus(appointmentId, request.status() );
    }


}