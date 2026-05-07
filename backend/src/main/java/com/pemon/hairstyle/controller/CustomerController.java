package com.pemon.hairstyle.controller;

import com.pemon.hairstyle.model.Customer;
import com.pemon.hairstyle.service.CustomerService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CustomerController {
    private final CustomerService customerService;
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }
    @RequestMapping("/customers")
    public List<Customer> getCustomers() {
        return customerService.getAllCustomers();
    }
    @RequestMapping("/customer")
    public Customer getCustomerById(@RequestParam Long id) {
        return customerService.getCustomerById(id);
    }
}
