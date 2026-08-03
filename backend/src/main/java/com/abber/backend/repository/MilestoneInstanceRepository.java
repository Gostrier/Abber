package com.abber.backend.repository;

import com.abber.backend.entity.MilestoneInstance;
import com.abber.backend.enums.MilestoneStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MilestoneInstanceRepository extends JpaRepository<MilestoneInstance, Long> {

    List<MilestoneInstance> findByRoadmapIdOrderBySequenceOrderAsc(Long roadmapId);

    long countByRoadmapId(Long roadmapId);

    long countByRoadmapIdAndStatus(Long roadmapId, MilestoneStatus status);

}
