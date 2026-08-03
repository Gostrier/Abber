package com.abber.backend.repository;

import com.abber.backend.entity.BusinessRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoadmapRepository extends JpaRepository<BusinessRoadmap, Long> {

    Optional<BusinessRoadmap> findByBusinessIdeaId(Long businessIdeaId);

}
