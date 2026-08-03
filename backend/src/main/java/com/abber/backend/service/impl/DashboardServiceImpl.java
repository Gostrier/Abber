package com.abber.backend.service.impl;

import com.abber.backend.dto.response.BusinessIdeaResponse;
import com.abber.backend.dto.response.BusinessRoadmapResponse;
import com.abber.backend.dto.response.DashboardSummaryResponse;
import com.abber.backend.dto.response.MilestoneResponse;
import com.abber.backend.dto.response.RecentActivityResponse;
import com.abber.backend.entity.BusinessIdea;
import com.abber.backend.entity.BusinessRoadmap;
import com.abber.backend.entity.MilestoneInstance;
import com.abber.backend.entity.User;
import com.abber.backend.enums.MilestoneStatus;
import com.abber.backend.exception.ResourceNotFoundException;
import com.abber.backend.repository.BusinessIdeaRepository;
import com.abber.backend.repository.MilestoneInstanceRepository;
import com.abber.backend.repository.RoadmapRepository;
import com.abber.backend.repository.UserRepository;
import com.abber.backend.service.interfaces.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final BusinessIdeaRepository businessIdeaRepository;
    private final RoadmapRepository roadmapRepository;
    private final MilestoneInstanceRepository milestoneRepository;
    private final UserRepository userRepository;

    @Override
    public DashboardSummaryResponse getSummary(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId
                ));

        List<BusinessIdea> ideas = businessIdeaRepository
                .findByMenteeAndIsArchivedFalseOrderByCreatedAtDesc(user);

        long totalMilestones = 0;
        long completedMilestones = 0;

        List<RecentActivityResponse> activities = new ArrayList<>();

        BusinessRoadmap latestRoadmap = null;

        if (!ideas.isEmpty()) {
            latestRoadmap = roadmapRepository
                    .findByBusinessIdeaId(ideas.get(0).getId())
                    .orElse(null);
        }

        for (BusinessIdea idea : ideas) {

            activities.add(RecentActivityResponse.builder()
                    .action("New idea submitted")
                    .detail(idea.getTitle())
                    .timestamp(idea.getCreatedAt())
                    .build());

            BusinessRoadmap roadmap = roadmapRepository
                    .findByBusinessIdeaId(idea.getId())
                    .orElse(null);

            if (roadmap != null) {

                List<MilestoneInstance> milestones = milestoneRepository
                        .findByRoadmapIdOrderBySequenceOrderAsc(roadmap.getId());

                for (MilestoneInstance milestone : milestones) {

                    totalMilestones++;

                    if (milestone.getStatus() == MilestoneStatus.COMPLETED) {

                        completedMilestones++;

                        if (milestone.getCompletedAt() != null) {

                            activities.add(RecentActivityResponse.builder()
                                    .action("Milestone completed")
                                    .detail(milestone.getTaskTitle())
                                    .timestamp(milestone.getCompletedAt())
                                    .build());
                        }
                    }
                }
            }
        }

        BigDecimal overallProgress = totalMilestones == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(completedMilestones)
                        .multiply(BigDecimal.valueOf(100))
                        .divide(BigDecimal.valueOf(totalMilestones), 2, RoundingMode.HALF_UP);

        activities.sort(Comparator
                .comparing(RecentActivityResponse::getTimestamp)
                .reversed());

        return DashboardSummaryResponse.builder()
                .activeIdeasCount(ideas.size())
                .completedMilestonesCount(completedMilestones)
                .totalMilestonesCount(totalMilestones)
                .overallProgress(overallProgress)
                .latestIdea(ideas.isEmpty() ? null : toIdeaResponse(ideas.get(0)))
                .latestRoadmap(latestRoadmap == null ? null : toRoadmapResponse(latestRoadmap))
                .recentActivity(activities.stream().limit(8).toList())
                .build();
    }

    private BusinessIdeaResponse toIdeaResponse(BusinessIdea idea) {

        return BusinessIdeaResponse.builder()
                .id(idea.getId())
                .title(idea.getTitle())
                .elevatorPitch(idea.getElevatorPitch())
                .detailedDescription(idea.getDetailedDescription())
                .targetMarket(idea.getTargetMarket())
                .uniqueValueProposition(idea.getUniqueValueProposition())
                .executionStage(idea.getExecutionStage())
                .estimatedStartupCost(idea.getEstimatedStartupCost())
                .projectedMonthlyRevenue(idea.getProjectedMonthlyRevenue())
                .projectedMonthlyExpenses(idea.getProjectedMonthlyExpenses())
                .isPublicShowcase(idea.getIsPublicShowcase())
                .isArchived(idea.getIsArchived())
                .createdAt(idea.getCreatedAt())
                .updatedAt(idea.getUpdatedAt())
                .build();
    }

    private BusinessRoadmapResponse toRoadmapResponse(BusinessRoadmap roadmap) {

        return BusinessRoadmapResponse.builder()
                .id(roadmap.getId())
                .businessIdeaId(roadmap.getBusinessIdea().getId())
                .overallCompletionPercentage(roadmap.getOverallCompletionPercentage())
                .currentPhase(roadmap.getCurrentPhase())
                .startedAt(roadmap.getStartedAt())
                .expectedCompletionDate(roadmap.getExpectedCompletionDate())
                .completedAt(roadmap.getCompletedAt())
                .lastActivityAt(roadmap.getLastActivityAt())
                .milestones(roadmap.getMilestones()
                        .stream()
                        .map(this::toMilestoneResponse)
                        .toList())
                .build();
    }

    private MilestoneResponse toMilestoneResponse(MilestoneInstance milestone) {

        return MilestoneResponse.builder()
                .id(milestone.getId())
                .sequenceOrder(milestone.getSequenceOrder())
                .taskTitle(milestone.getTaskTitle())
                .taskDescription(milestone.getTaskDescription())
                .status(milestone.getStatus())
                .mentorNotes(milestone.getMentorNotes())
                .dueDate(milestone.getDueDate())
                .completedAt(milestone.getCompletedAt())
                .build();
    }

}
