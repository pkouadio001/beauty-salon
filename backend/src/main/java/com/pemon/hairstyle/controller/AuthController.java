package com.pemon.hairstyle.controller;

import com.pemon.hairstyle.configuration.CustomerUserDetails;
import com.pemon.hairstyle.configuration.EmployeeUserDetails;
import com.pemon.hairstyle.model.*;
import com.pemon.hairstyle.service.CustomerService;
import com.pemon.hairstyle.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final CustomerService customerService;
    private final EmployeeService employeeService;
    private final AuthenticationManager authenticationManager;

    public AuthController(
            CustomerService customerService,
            EmployeeService employeeService,
            AuthenticationManager authenticationManager
    ) {
        this.customerService = customerService;
        this.authenticationManager = authenticationManager;
        this.employeeService = employeeService;

    }

    @PostMapping("/register/customer")
    public ResponseEntity<CustomerSummaryResponse> registerCustomer(@Valid @RequestBody RegisterCustomerRequest request) {
        CustomerSummaryResponse savedCustomer = customerService.registerCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCustomer);
    }

    @PostMapping("/register/employee")
    public ResponseEntity<EmployeeSummaryResponse> registerEmployee(@Valid @RequestBody RegisterEmployeeRequest request) {
        EmployeeSummaryResponse savedEmployee = employeeService.registerEmployee(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEmployee);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomerUserDetails customerUserDetails) {
            AuthResponse response = new AuthResponse(
                    customerUserDetails.getId(),
                    customerUserDetails.getEmail(),
                    "CUSTOMER",
                    "/customer/dashboard"
            );

            return ResponseEntity.ok(response);
        }

        if (principal instanceof EmployeeUserDetails employeeUserDetails) {
            String role = employeeUserDetails.getRole();

            String redirectTo = switch (role) {
                case "ADMIN" -> "/admin/dashboard";
                case "EMPLOYEE" -> "/employee/dashboard";
                default -> "/login";
            };

            AuthResponse response = new AuthResponse(
                    employeeUserDetails.getId(),
                    employeeUserDetails.getEmail(),
                    role,
                    redirectTo
            );

            return ResponseEntity.ok(response);
        }

        throw new IllegalArgumentException("Invalid email or password");
    }
}