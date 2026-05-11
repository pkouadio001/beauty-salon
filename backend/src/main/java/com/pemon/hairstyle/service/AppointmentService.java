package com.pemon.hairstyle.service;

import com.pemon.hairstyle.model.*;
import com.pemon.hairstyle.repository.AppointmentRepository;
import com.pemon.hairstyle.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import com.pemon.hairstyle.repository.CareRepository;
import com.pemon.hairstyle.repository.CustomerRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final CareRepository careRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, EmployeeRepository employeeRepository, CustomerRepository customerRepository, CareRepository careRepository) {
        this.appointmentRepository = appointmentRepository;
        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
        this.careRepository = careRepository;
    }

    public List<AppointmentResponse> getAppointmentsById(Long id) {
        return appointmentRepository.findAllByCustomerId(id)
                .stream()
                .map(this::toAppointmentResponse)
                .toList();
    }

    public List<AppointmentResponse> getAppointmentsByEmployeeId(Long id) {
        return appointmentRepository.findAllByEmployeeId(id)
                .stream()
                .map(this::toAppointmentResponse)
                .toList();
    }

    public List<CustomerAppointmentResponse> getCustomerAppointmentsById(Long id) {
        return appointmentRepository.findAllByCustomerId(id)
                .stream()
                .map(this::toCustomerAppointmentResponse)
                .toList();
    }

    public AppointmentResponse saveAppointment(BookAppointmentRequest request) {
        Customer customer = customerRepository.findById(request.customerId())
                .orElseThrow(() -> new IllegalArgumentException("Customer not found: " + request.customerId()));
        Employee employee = employeeRepository.findAll().getFirst();
        Care care = careRepository.findById(request.serviceId())
                .orElseThrow(() -> new IllegalArgumentException("Service not found: " + request.serviceId()));

        Appointment appointment = new Appointment();
        appointment.setCustomer(customer);
        appointment.setService(care);
        appointment.setEmployee(employee);
        appointment.setTotalPrice(new BigDecimal(care.getPrice()));
        appointment.setAppointmentDate(request.appointmentDate());
        appointment.setAppointmentTime(request.appointmentTime());
        appointment.setStatus(Status.PENDING);
        appointmentRepository.save(appointment);
        return new AppointmentResponse(appointment.getId(),appointment.getAppointmentDate(), appointment.getAppointmentTime(), appointment.getService().getId(), appointment.getStatus(), appointment.getTotalPrice(), appointment.getCustomer().getId(), appointment.getEmployee().getId());
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::toAppointmentResponse)
                .toList();
    }

    private AppointmentResponse toAppointmentResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getService().getId(),
                appointment.getStatus(),
                appointment.getTotalPrice(),
                appointment.getCustomer().getId(),
                appointment.getEmployee().getId()

        );
    }

    public void deleteAppointmentRequest(Long appointmentId) {
        if (!appointmentRepository.existsById(appointmentId)) {
            throw new IllegalArgumentException("Appointment not found");
        }
        appointmentRepository.deleteById(appointmentId);
    }

    public CustomerAppointmentResponse toCustomerAppointmentResponse(Appointment appointment) {
        return new CustomerAppointmentResponse(
                appointment.getTotalPrice(),
                appointment.getService().getName(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentTime(),
                appointment.getStatus()
        );
    }

    public AppointmentResponse changeAppointmentProvider(Long appointmentId, Long employeeId) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow(()-> new IllegalArgumentException("Appointment not found" + appointmentId));

        if (appointment.getStatus() == Status.COMPLETED) {
            throw new IllegalArgumentException("Appointment is already completed. Cannot change provider.");
        }
        var employee = employeeRepository.findById(employeeId).orElseThrow(()-> new IllegalArgumentException("Employee not found" + employeeId));

        appointment.setEmployee(employee);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return toAppointmentResponse(updatedAppointment);
    }

    public AppointmentResponse changeAppointmentStatus(Long appointmentId, Status status) {
        Appointment appointment = appointmentRepository.findById(appointmentId).orElseThrow(()-> new IllegalArgumentException("Appointment not found" + appointmentId));

        if (appointment.getStatus() == Status.COMPLETED) {
            throw new IllegalArgumentException("Appointment is already completed. Cannot change status.");
        }
        appointment.setStatus(status);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return toAppointmentResponse(updatedAppointment);
    }
}