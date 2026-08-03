package com.abber.backend.service.impl;

import com.abber.backend.dto.response.ActivityLogResponse;
import com.abber.backend.dto.response.AdminStatsResponse;
import com.abber.backend.dto.response.AdminUserResponse;
import com.abber.backend.dto.response.BusinessIdeaResponse;
import com.abber.backend.dto.response.BusinessRoadmapResponse;
import com.abber.backend.dto.response.MilestoneResponse;
import com.abber.backend.dto.response.UserProgressResponse;
import com.abber.backend.entity.ActivityLog;
import com.abber.backend.entity.BusinessIdea;
import com.abber.backend.entity.BusinessRoadmap;
import com.abber.backend.entity.MilestoneInstance;
import com.abber.backend.entity.Role;
import com.abber.backend.entity.User;
import com.abber.backend.enums.ExecutionStage;
import com.abber.backend.enums.MilestoneStatus;
import com.abber.backend.enums.RoleType;
import com.abber.backend.exception.ResourceNotFoundException;
import com.abber.backend.repository.BusinessIdeaRepository;
import com.abber.backend.repository.MilestoneInstanceRepository;
import com.abber.backend.repository.RoadmapRepository;
import com.abber.backend.repository.RoleRepository;
import com.abber.backend.repository.UserRepository;
import com.abber.backend.service.interfaces.ActivityLogService;
import com.abber.backend.service.interfaces.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final BusinessIdeaRepository businessIdeaRepository;
    private final RoadmapRepository roadmapRepository;
    private final MilestoneInstanceRepository milestoneRepository;
    private final RoleRepository roleRepository;
    private final ActivityLogService activityLogService;

    @Override
    public AdminStatsResponse getStats() {

        List<User> users = userRepository.findAll();

        long totalUsers = users.size();

        long totalMentors = countByRole(users, RoleType.ROLE_MENTOR);
        long totalMentees = countByRole(users, RoleType.ROLE_MENTEE);
        long totalAdmins = countByRole(users, RoleType.ROLE_ADMIN);

        List<BusinessIdea> ideas = businessIdeaRepository.findAll();

        long totalIdeas = ideas.size();

        long totalRoadmaps = roadmapRepository.count();
        long totalMilestones = milestoneRepository.count();
        long completedMilestones = milestoneRepository.countByStatus(MilestoneStatus.COMPLETED);

        LocalDate today = LocalDate.now();

        long registrationsToday = users.stream()
                .filter(u -> u.getCreatedAt() != null
                        && u.getCreatedAt().toLocalDate().equals(today))
                .count();

        long loginsToday = users.stream()
                .filter(u -> u.getLastLoginAt() != null
                        && u.getLastLoginAt().toLocalDate().equals(today))
                .count();

        List<BusinessRoadmap> roadmaps = roadmapRepository.findAll();

        BigDecimal averageProgress = roadmaps.isEmpty()
                ? BigDecimal.ZERO
                : roadmaps.stream()
                        .map(BusinessRoadmap::getOverallCompletionPercentage)
                        .filter(p -> p != null)
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                        .divide(BigDecimal.valueOf(roadmaps.size()), 2, RoundingMode.HALF_UP);

        Map<ExecutionStage, Long> stageCounts = ideas.stream()
                .collect(Collectors.groupingBy(
                        BusinessIdea::getExecutionStage,
                        () -> new EnumMap<>(ExecutionStage.class),
                        Collectors.counting()
                ));

        List<AdminStatsResponse.StageCount> ideasByStage = new ArrayList<>();

        for (ExecutionStage stage : ExecutionStage.values()) {
            ideasByStage.add(AdminStatsResponse.StageCount.builder()
                    .stage(stage.name())
                    .count(stageCounts.getOrDefault(stage, 0L))
                    .build());
        }

        List<AdminStatsResponse.DailyCount> registrationsLast7Days = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {

            LocalDate day = today.minusDays(i);

            long count = users.stream()
                    .filter(u -> u.getCreatedAt() != null
                            && u.getCreatedAt().toLocalDate().equals(day))
                    .count();

            registrationsLast7Days.add(AdminStatsResponse.DailyCount.builder()
                    .date(day.toString())
                    .count(count)
                    .build());
        }

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalMentors(totalMentors)
                .totalMentees(totalMentees)
                .totalAdmins(totalAdmins)
                .totalIdeas(totalIdeas)
                .totalRoadmaps(totalRoadmaps)
                .totalMilestones(totalMilestones)
                .completedMilestones(completedMilestones)
                .registrationsToday(registrationsToday)
                .loginsToday(loginsToday)
                .averageProgress(averageProgress)
                .ideasByStage(ideasByStage)
                .registrationsLast7Days(registrationsLast7Days)
                .build();
    }

    @Override
    public List<ActivityLogResponse> getActivityLogs() {

        return activityLogService.getRecentLogs(100)
                .stream()
                .map(this::toActivityLogResponse)
                .toList();
    }

    @Override
    public List<AdminUserResponse> getUsersWithProgress() {

        List<User> users = userRepository.findAll()
                .stream()
                .sorted(Comparator
                        .comparing(User::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();

        return users.stream()
                .map(this::toAdminUserResponse)
                .toList();
    }

    @Override
    public UserProgressResponse getUserProgress(Long userId) {

        User user = requireUser(userId);

        List<BusinessIdea> ideas = businessIdeaRepository
                .findByMenteeAndIsArchivedFalseOrderByCreatedAtDesc(user);

        List<UserProgressResponse.IdeaProgress> ideaProgress = ideas.stream()
                .map(this::toIdeaProgress)
                .toList();

        long totalMilestones = ideaProgress.stream()
                .flatMap(ip -> ip.roadmap() == null ? java.util.stream.Stream.empty()
                        : ip.roadmap().getMilestones().stream())
                .count();

        long completedMilestones = ideaProgress.stream()
                .flatMap(ip -> ip.roadmap() == null ? java.util.stream.Stream.empty()
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

    @Override
    @Transactional
    public void updateUserRole(Long userId, RoleType roleName, boolean grant) {

        if (roleName != RoleType.ROLE_MENTOR) {
            throw new IllegalArgumentException(
                    "Only the MENTOR privilege can be granted or revoked here."
            );
        }

        User user = requireUser(userId);

        Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Role '" + roleName + "' was not found."
                ));

        boolean hasRole = user.getRoleNames().contains(roleName.name());

        if (grant && !hasRole) {

            user.addRole(role);
            userRepository.save(user);

            activityLogService.record(
                    user.getEmail(),
                    "Mentor privilege granted",
                    "Granted the MENTOR role to " + user.getFirstName() + " " + user.getLastName()
            );

        } else if (!grant && hasRole) {

            user.removeRole(role);
            userRepository.save(user);

            activityLogService.record(
                    user.getEmail(),
                    "Mentor privilege revoked",
                    "Revoked the MENTOR role from " + user.getFirstName() + " " + user.getLastName()
            );
        }
    }

    private long countByRole(List<User> users, RoleType role) {

        return users.stream()
                .filter(u -> u.getRoleNames().contains(role.name()))
                .count();
    }

    private AdminUserResponse toAdminUserResponse(User user) {

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

    private UserProgressResponse.IdeaProgress toIdeaProgress(BusinessIdea idea) {

        BusinessRoadmap roadmap = roadmapRepository
                .findByBusinessIdeaId(idea.getId())
                .orElse(null);

        return UserProgressResponse.IdeaProgress.builder()
                .idea(toIdeaResponse(idea))
                .roadmap(roadmap == null ? null : toRoadmapResponse(roadmap))
                .build();
    }

    private ActivityLogResponse toActivityLogResponse(ActivityLog log) {

        return ActivityLogResponse.builder()
                .id(log.getId())
                .userId(log.getUserId())
                .userEmail(log.getUserEmail())
                .action(log.getAction())
                .detail(log.getDetail())
                .timestamp(log.getCreatedAt())
                .build();
    }

    private User requireUser(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId
                ));
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
