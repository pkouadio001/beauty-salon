package com.pemon.hairstyle.controller;

import com.pemon.hairstyle.model.EmployeeSummaryResponse;
import com.pemon.hairstyle.service.EmployeeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1")
public class EmployeeController {
    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/employees")
    public List <EmployeeSummaryResponse> getAllEmployees() {
        return employeeService.getAllEmployee();
    }
    @GetMapping("/employees/{employeeId}")
    public EmployeeSummaryResponse getEmployeeById(@PathVariable Long employeeId) {
        return employeeService.getEmployeeById(employeeId);
    }


}
