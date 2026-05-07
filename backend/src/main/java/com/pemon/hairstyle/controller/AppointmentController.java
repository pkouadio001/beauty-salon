package com.pemon.hairstyle.controller;

import com.pemon.hairstyle.model.*;
import com.pemon.hairstyle.service.AppointmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/appointments/")
    public List<AppointmentResponse> getAppointmentsById(@RequestParam Long id) {
        return appointmentService.getAppointmentsById(id);
    }

    @GetMapping("/appointments/{customerId}/customer")
    public List<CustomerAppointmentResponse> getCustomerAppointmentsById(@PathVariable Long customerId) {
        return appointmentService.getCustomerAppointmentsById(customerId);
    }

    @GetMapping("/appointments/{employeeId}/employee")
    public List<AppointmentResponse> getEmployeeAppointmentsById(@PathVariable Long employeeId) {
        return appointmentService.getAppointmentsByEmployeeId(employeeId);
    }

    @GetMapping("/appointments/all")
    public List<AppointmentResponse> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @PostMapping("/appointment/book")
    public Appointment bookAppointment(@RequestBody BookAppointmentRequest request) {
        return appointmentService.saveAppointment(request);
    }

    //change appointment provider
    @PatchMapping("/appointments/{appointmentId}/provider")
    public AppointmentResponse changeAppointmentProvider(@PathVariable Long appointmentId, @RequestBody ChangeAppointmentProvider request ) {

        return appointmentService.changeAppointmentProvider(appointmentId, request.employeeId());
    }

    @PatchMapping("/appointments/{appointmentId}/status")
    public AppointmentResponse changeAppointmentStatus(@PathVariable Long appointmentId, @RequestBody ChangeAppointmentStatus request ) {

        return appointmentService.changeAppointmentStatus(appointmentId, request.status() );
    }


}