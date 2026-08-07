package com.abber.backend.mapper;

import com.abber.backend.dto.response.AdminUserResponse;
import com.abber.backend.dto.response.BusinessIdeaResponse;
import com.abber.backend.dto.response.BusinessRoadmapResponse;
import com.abber.backend.dto.response.MilestoneResponse;
import com.abber.backend.dto.response.UserProgressResponse;
import com.abber.backend.entity.BusinessIdea;
import com.abber.backend.entity.BusinessRoadmap;
import com.abber.backend.entity.MilestoneInstance;
import com.abber.backend.entity.User;
import com.abber.backend.enums.MilestoneStatus;
import com.abber.backend.repository.BusinessIdeaRepository;
import com.abber.backend.repository.MilestoneInstanceRepository;
import com.abber.backend.repository.RoadmapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
@RequiredArgsConstructor
public class UserStatsMapper {

    private final BusinessIdeaRepository businessIdeaRepository;
    private final RoadmapRepository roadmapRepository;
    private final MilestoneInstanceRepository milestoneRepository;

    public AdminUserResponse toAdminUserResponse(User user) {

        List<BusinessIdea> ideas = businessIdeaRepository
                .findByMenteeAndIsArchivedFalseOrderByCreatedAtDesc(user);

        long totalMilestones = 0;
        long completedMilestones = 0;

        if (!ideas.isEmpty()) {

            List<Long> ideaIds = ideas.stream()
                    .map(BusinessIdea::getId)
                    .toList();

            List<Long> roadmapIds = roadmapRepository
                    .findByBusinessIdeaIdIn(ideaIds)
                    .stream()
                    .map(BusinessRoadmap::getId)
                    .toList();

            if (!roadmapIds.isEmpty()) {

                totalMilestones = milestoneRepository.countByRoadmapIdIn(roadmapIds);
                completedMilestones = milestoneRepository
                        .countByRoadmapIdInAndStatus(roadmapIds, MilestoneStatus.COMPLETED);
            }
        }

        BigDecimal progress = totalMilestones == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(completedMilestones)
                        .multiply(BigDecimal.valueOf(100))
                        .divide(BigDecimal.valueOf(totalMilestones), 2, RoundingMode.HALF_UP);

        return AdminUserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .roles(user.getRoleNames())
                .isActive(user.getIsActive())
                .emailVerified(user.getEmailVerified())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .ideasCount(ideas.size())
                .totalMilestones(totalMilestones)
                .completedMilestones(completedMilestones)
                .progress(progress)
                .build();
    }

    public UserProgressResponse toUserProgressResponse(User user) {

        List<BusinessIdea> ideas = businessIdeaRepository
                .findByMenteeAndIsArchivedFalseOrderByCreatedAtDesc(user);

        List<UserProgressResponse.IdeaProgress> ideaProgress = ideas.stream()
                .map(this::toIdeaProgress)
                .toList();

        long totalMilestones = ideaProgress.stream()
                .flatMap(ip -> ip.roadmap() == null
                        ? java.util.stream.Stream.empty()
                        : ip.roadmap().getMilestones().stream())
                .count();

        long completedMilestones = ideaProgress.stream()
                .flatMap(ip -> ip.roadmap() == null
                        ? java.util.stream.Stream.empty()
                        : ip.roadmap().getMilestones().stream())
                .filter(m -> m.getStatus() == MilestoneStatus.COMPLETED)
                .count();

        BigDecimal overallProgress = totalMilestones == 0
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(completedMilestones)
                        .multiply(BigDecimal.valueOf(100))
                        .divide(BigDecimal.valueOf(totalMilestones), 2, RoundingMode.HALF_UP);

        return UserProgressResponse.builder()
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .roles(user.getRoleNames())
                .overallProgress(overallProgress)
                .ideas(ideaProgress)
                .build();
    }

    public UserProgressResponse.IdeaProgress toIdeaProgress(BusinessIdea idea) {

        BusinessRoadmap roadmap = roadmapRepository
                .findByBusinessIdeaId(idea.getId())
                .orElse(null);

        return UserProgressResponse.IdeaProgress.builder()
                .idea(toIdeaResponse(idea))
                .roadmap(roadmap == null ? null : toRoadmapResponse(roadmap))
                .build();
    }

    public BusinessIdeaResponse toIdeaResponse(BusinessIdea idea) {

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

    public BusinessRoadmapResponse toRoadmapResponse(BusinessRoadmap roadmap) {

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

    public MilestoneResponse toMilestoneResponse(MilestoneInstance milestone) {

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
