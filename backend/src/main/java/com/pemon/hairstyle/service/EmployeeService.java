package com.pemon.hairstyle.service;

import com.pemon.hairstyle.model.Employee;
import com.pemon.hairstyle.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
    public List<Employee> getEmployeeRepository() {
        return employeeRepository.findAll();
    }

}