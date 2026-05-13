package com.pemon.hairstyle.service;

import com.pemon.hairstyle.model.CustomerSummaryResponse;
import com.pemon.hairstyle.model.RegisterCustomerRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.pemon.hairstyle.model.Customer;
import com.pemon.hairstyle.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    private final PasswordEncoder passwordEncoder;

    public CustomerService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public CustomerSummaryResponse registerCustomer(RegisterCustomerRequest request) {

        Customer customer = new Customer();
        customer.setFirstName(request.firstName());
        customer.setLastName(request.lastName());
        customer.setEmail(request.email());
        customer.setPhoneNumber(request.phoneNumber());
        customer.setDateOfBirth(request.dateOfBirth());

        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email is already registered");
        }

        String encodedPassword = passwordEncoder.encode(request.password());
        customer.setPassword(encodedPassword);

        customerRepository.save(customer);
        return new CustomerSummaryResponse(customer.getId(), customer.getFirstName(), customer.getLastName(), customer.getEmail(), customer.getPhoneNumber());
    }

    public List<CustomerSummaryResponse> getAllCustomers() {
        return customerRepository.findAll().stream().map(this::getCustomerSummary).toList();
    }
    public CustomerSummaryResponse getCustomerById(Long id) {
        return getCustomerSummary(customerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Customer not found")));
    }
    private CustomerSummaryResponse getCustomerSummary(Customer customer) {
        return new CustomerSummaryResponse(customer.getId(), customer.getFirstName(), customer.getLastName(), customer.getEmail(), customer.getPhoneNumber());
    }

}