package com.abber.backend.repository;

import com.abber.backend.entity.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MentorRepository extends JpaRepository<MentorProfile, Long> {

    Optional<MentorProfile> findByUserId(Long userId);

    Optional<MentorProfile> findByUserEmail(String email);

    List<MentorProfile> findByIsAvailableTrueOrderByCreatedAtDesc();

    List<MentorProfile> findByIsFeaturedTrueOrderByCreatedAtDesc();

    List<MentorProfile> findAllByOrderByCreatedAtDesc();

    long countByUserIdIn(Iterable<Long> userIds);
}
