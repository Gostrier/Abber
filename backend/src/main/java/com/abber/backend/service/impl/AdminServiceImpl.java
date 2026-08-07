package com.abber.backend.service.impl;

import com.abber.backend.dto.request.CreateMentorRequest;
import com.abber.backend.dto.response.ActivityLogResponse;
import com.abber.backend.dto.response.AdminStatsResponse;
import com.abber.backend.dto.response.AdminUserResponse;
import com.abber.backend.dto.response.MentorProfileResponse;
import com.abber.backend.dto.response.UserProgressResponse;
import com.abber.backend.entity.ActivityLog;
import com.abber.backend.entity.BusinessIdea;
import com.abber.backend.entity.BusinessRoadmap;
import com.abber.backend.entity.MentorProfile;
import com.abber.backend.entity.MentorshipEngagement;
import com.abber.backend.entity.Role;
import com.abber.backend.entity.User;
import com.abber.backend.enums.EngagementStatus;
import com.abber.backend.enums.ExecutionStage;
import com.abber.backend.enums.MilestoneStatus;
import com.abber.backend.enums.RoleType;
import com.abber.backend.exception.ResourceNotFoundException;
import com.abber.backend.mapper.MentorMapper;
import com.abber.backend.mapper.UserStatsMapper;
import com.abber.backend.repository.BusinessIdeaRepository;
import com.abber.backend.repository.MentorRepository;
import com.abber.backend.repository.MentorshipEngagementRepository;
import com.abber.backend.repository.MilestoneInstanceRepository;
import com.abber.backend.repository.RoadmapRepository;
import com.abber.backend.repository.RoleRepository;
import com.abber.backend.repository.UserRepository;
import com.abber.backend.service.interfaces.ActivityLogService;
import com.abber.backend.service.interfaces.AdminService;
import com.abber.backend.service.interfaces.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
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
    private final PasswordEncoder passwordEncoder;
    private final UserStatsMapper userStatsMapper;
    private final MentorRepository mentorRepository;
    private final MentorMapper mentorMapper;
    private final MentorshipEngagementRepository engagementRepository;
    private final EmailService emailService;

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
                .map(userStatsMapper::toAdminUserResponse)
                .toList();
    }

    @Override
    public UserProgressResponse getUserProgress(Long userId) {

        User user = requireUser(userId);

        return userStatsMapper.toUserProgressResponse(user);
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

            if (mentorRepository.findByUserId(userId).isEmpty()) {
                mentorRepository.save(MentorProfile.builder()
                        .user(user)
                        .specialty("Startup Mentor")
                        .isAvailable(true)
                        .isFeatured(false)
                        .build());
            }

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

    @Override
    @Transactional
    public MentorProfileResponse createMentor(CreateMentorRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException(
                    "A user with email " + email + " is already registered."
            );
        }

        Role mentorRole = roleRepository.findByRoleName(RoleType.ROLE_MENTOR)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Role 'ROLE_MENTOR' was not found."
                ));

        User mentor = User.builder()
                .uuid(UUID.randomUUID())
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .isActive(true)
                .emailVerified(true)
                .county(request.getCounty())
                .town(request.getTown())
                .build();

        mentor.addRole(mentorRole);

        userRepository.save(mentor);

        String location = request.getLocation();

        if (location == null || location.isBlank()) {
            StringBuilder sb = new StringBuilder();
            if (request.getCounty() != null && !request.getCounty().isBlank()) {
                sb.append(request.getCounty());
            }
            if (request.getTown() != null && !request.getTown().isBlank()) {
                if (sb.length() > 0) {
                    sb.append(", ");
                }
                sb.append(request.getTown());
            }
            location = sb.toString();
        }

        MentorProfile profile = mentorRepository.save(MentorProfile.builder()
                .user(mentor)
                .specialty(request.getSpecialty() == null
                        ? "Startup Mentor"
                        : request.getSpecialty().trim())
                .bio(request.getBio())
                .yearsOfExperience(request.getYearsOfExperience())
                .company(request.getCompany())
                .location(location)
                .isAvailable(true)
                .isFeatured(Boolean.TRUE.equals(request.getIsFeatured()))
                .build());

        activityLogService.record(
                email,
                "Mentor added",
                "Added " + mentor.getFirstName() + " " + mentor.getLastName()
                        + " as a mentor (" + profile.getSpecialty() + ")."
        );

        emailService.sendMentorInvitation(
                email,
                "Abber Admin",
                "https://abber.netlify.app/login"
        );

        return mentorMapper.toResponse(profile);
    }

    @Override
    public List<MentorProfileResponse> getMentors() {

        return mentorRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(mentorMapper::toResponse)
                .toList();
    }

    @Override
    public MentorProfileResponse getMentor(Long mentorUserId) {

        MentorProfile profile = requireMentorProfile(mentorUserId);

        return mentorMapper.toResponse(profile);
    }

    @Override
    public List<AdminUserResponse> getMenteesForMentor(Long mentorUserId) {

        requireMentorProfile(mentorUserId);

        return engagementRepository.findByMentorId(mentorUserId)
                .stream()
                .filter(e -> e.getStatus() == EngagementStatus.ACTIVE)
                .map(MentorshipEngagement::getMentee)
                .map(userStatsMapper::toAdminUserResponse)
                .sorted(Comparator.comparing(AdminUserResponse::createdAt,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .toList();
    }

    @Override
    @Transactional
    public void assignMentor(Long mentorUserId, Long menteeUserId) {

        User mentor = requireUser(mentorUserId);

        User mentee = requireUser(menteeUserId);

        if (mentorUserId.equals(menteeUserId)) {
            throw new IllegalArgumentException(
                    "A mentor cannot be assigned to themselves."
            );
        }

        if (!mentor.getRoleNames().contains(RoleType.ROLE_MENTOR.name())) {
            throw new IllegalArgumentException(
                    "The selected user is not a mentor."
            );
        }

        if (mentee.getRoleNames().contains(RoleType.ROLE_ADMIN.name())) {
            throw new IllegalArgumentException(
                    "Administrators cannot be assigned as mentees."
            );
        }

        engagementRepository.findByMentorIdAndMenteeId(mentorUserId, menteeUserId)
                .ifPresentOrElse(
                        engagement -> {
                            engagement.setStatus(EngagementStatus.ACTIVE);
                            engagementRepository.save(engagement);
                        },
                        () -> engagementRepository.save(MentorshipEngagement.builder()
                                .mentor(mentor)
                                .mentee(mentee)
                                .status(EngagementStatus.ACTIVE)
                                .build())
                );

        activityLogService.record(
                mentor.getEmail(),
                "Mentor assigned",
                "Assigned " + mentor.getFirstName() + " " + mentor.getLastName()
                        + " as the mentor of " + mentee.getFirstName() + " " + mentee.getLastName()
        );
    }

    @Override
    @Transactional
    public void unassignMentor(Long mentorUserId, Long menteeUserId) {

        MentorProfile profile = requireMentorProfile(mentorUserId);

        MentorshipEngagement engagement = engagementRepository
                .findByMentorIdAndMenteeId(mentorUserId, menteeUserId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No mentorship assignment found between the given mentor and mentee."
                ));

        engagement.setStatus(EngagementStatus.COMPLETED);
        engagementRepository.save(engagement);

        User mentor = profile.getUser();
        User mentee = engagement.getMentee();

        activityLogService.record(
                mentor.getEmail(),
                "Mentor assignment removed",
                "Removed " + mentee.getFirstName() + " " + mentee.getLastName()
                        + " from " + mentor.getFirstName() + " " + mentor.getLastName() + "'s mentees."
        );
    }

    private long countByRole(List<User> users, RoleType role) {

        return users.stream()
                .filter(u -> u.getRoleNames().contains(role.name()))
                .count();
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

    private MentorProfile requireMentorProfile(Long mentorUserId) {

        return mentorRepository.findByUserId(mentorUserId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Mentor profile not found for user id: " + mentorUserId
                ));
    }
}
