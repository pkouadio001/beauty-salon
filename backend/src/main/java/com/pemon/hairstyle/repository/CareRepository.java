package com.pemon.hairstyle.repository;

import com.pemon.hairstyle.model.Care;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CareRepository extends JpaRepository<Care, Long> {
}