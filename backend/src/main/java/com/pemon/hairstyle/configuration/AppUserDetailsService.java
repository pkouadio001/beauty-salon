package com.pemon.hairstyle.configuration;

import com.pemon.hairstyle.model.Customer;
import com.pemon.hairstyle.model.Employee;
import com.pemon.hairstyle.repository.CustomerRepository;
import com.pemon.hairstyle.repository.EmployeeRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AppUserDetailsService implements UserDetailsService {

    private final CustomerRepository customerRepository;
    private final EmployeeRepository employeeRepository;

    public AppUserDetailsService(
            CustomerRepository customerRepository,
            EmployeeRepository employeeRepository
    ) {
        this.customerRepository = customerRepository;
        this.employeeRepository = employeeRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByEmail(email).orElse(null);

        if (customer != null) {
            return new CustomerUserDetails(customer);
        }

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Invalid email or password"));

        return new EmployeeUserDetails(employee);
    }
}