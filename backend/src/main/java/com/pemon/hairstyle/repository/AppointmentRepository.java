package com.pemon.hairstyle.repository;
import com.pemon.hairstyle.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findAllByCustomerId(Long id);
    List<Appointment> findAllByEmployeeId(Long id);
}
