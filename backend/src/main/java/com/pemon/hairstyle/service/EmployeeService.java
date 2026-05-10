package com.pemon.hairstyle.service;

import com.pemon.hairstyle.model.Employee;
import com.pemon.hairstyle.model.EmployeeSummaryResponse;
import com.pemon.hairstyle.model.RegisterEmployeeRequest;
import com.pemon.hairstyle.repository.EmployeeRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<EmployeeSummaryResponse> getAllEmployee() {
        return employeeRepository.findAll().stream().map(this::toEmployeeResponse).toList();
    }

    public EmployeeSummaryResponse getEmployeeById(Long id) {
        return employeeRepository.findById(id).map(this::toEmployeeResponse).orElseThrow(() -> new IllegalArgumentException("Employee not found"));
    }

  /*  public EmployeeResponse getEmployeeByEmail(String email) {
        return employeeRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Employee not found"));
    }*/

    public EmployeeSummaryResponse registerEmployee(RegisterEmployeeRequest request) {

        Employee employee = new Employee();
        employee.setEmail(request.email());
        employee.setFirstName(request.firstName());
        employee.setLastName(request.lastName());
        employee.setPassword(passwordEncoder.encode(request.password()));
        employee.setSpecialization(request.specialization());
        employee.setPhoneNumber(request.phoneNumber());
        employee.setDateOfBirth(request.dateOfBirth());

        Employee savedEmployee = employeeRepository.save(employee);
        return new EmployeeSummaryResponse(savedEmployee.getId(), savedEmployee.getFirstName(), savedEmployee.getLastName(), savedEmployee.getEmail(), savedEmployee.getPhoneNumber());
    }

    private EmployeeSummaryResponse toEmployeeResponse(Employee employee) {

        return new EmployeeSummaryResponse(employee.getId(), employee.getFirstName(), employee.getLastName(), employee.getEmail(), employee.getPhoneNumber());

    }



}