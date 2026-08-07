package com.abber.backend.repository;

import com.abber.backend.entity.MentorshipEngagement;
import com.abber.backend.enums.EngagementStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MentorshipEngagementRepository extends JpaRepository<MentorshipEngagement, Long> {

    List<MentorshipEngagement> findByMentorId(Long mentorId);

    List<MentorshipEngagement> findByMenteeId(Long menteeId);

    Optional<MentorshipEngagement> findByMentorIdAndMenteeId(Long mentorId, Long menteeId);

    Optional<MentorshipEngagement> findByMenteeIdAndStatus(Long menteeId, EngagementStatus status);

    boolean existsByMentorIdAndMenteeId(Long mentorId, Long menteeId);

    long countByMentorId(Long mentorId);

    long countByMentorIdAndStatus(Long mentorId, EngagementStatus status);

    long countByMenteeId(Long menteeId);
}
