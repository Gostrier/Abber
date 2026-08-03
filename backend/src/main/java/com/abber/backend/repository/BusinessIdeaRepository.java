package com.abber.backend.repository;

import com.abber.backend.entity.BusinessIdea;
import com.abber.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BusinessIdeaRepository extends JpaRepository<BusinessIdea, Long> {

    List<BusinessIdea> findByMenteeAndIsArchivedFalseOrderByCreatedAtDesc(User mentee);

    Optional<BusinessIdea> findByIdAndMenteeAndIsArchivedFalse(Long id, User mentee);

    long countByMenteeAndIsArchivedFalse(User mentee);

}
