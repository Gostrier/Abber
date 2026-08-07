package com.abber.backend.repository;

import com.abber.backend.entity.MenteeProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MenteeRepository extends JpaRepository<MenteeProfile, Long> {

    Optional<MenteeProfile> findByUserId(Long userId);
}
