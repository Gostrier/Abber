package com.abber.backend.service.impl;

import com.abber.backend.dto.response.AdminUserResponse;
import com.abber.backend.dto.response.MentorProfileResponse;
import com.abber.backend.dto.response.MilestoneResponse;
import com.abber.backend.dto.response.UserProgressResponse;
import com.abber.backend.entity.MentorProfile;
import com.abber.backend.entity.MentorshipEngagement;
import com.abber.backend.entity.MilestoneInstance;
import com.abber.backend.entity.User;
import com.abber.backend.enums.EngagementStatus;
import com.abber.backend.exception.ResourceNotFoundException;
import com.abber.backend.mapper.MentorMapper;
import com.abber.backend.mapper.UserStatsMapper;
import com.abber.backend.repository.MentorRepository;
import com.abber.backend.repository.MentorshipEngagementRepository;
import com.abber.backend.repository.MilestoneInstanceRepository;
import com.abber.backend.repository.UserRepository;
import com.abber.backend.service.interfaces.ActivityLogService;
import com.abber.backend.service.interfaces.MentorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MentorServiceImpl implements MentorService {

    private final MentorRepository mentorRepository;
    private final MentorMapper mentorMapper;
    private final UserStatsMapper userStatsMapper;
    private final MentorshipEngagementRepository engagementRepository;
    private final MilestoneInstanceRepository milestoneRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    @Override
    public MentorProfileResponse getMyProfile(Long mentorUserId) {

        MentorProfile profile = requireProfile(mentorUserId);

        return mentorMapper.toResponse(profile);
    }

    @Override
    public List<AdminUserResponse> getMyMentees(Long mentorUserId) {

        requireUser(mentorUserId);

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
    public UserProgressResponse getMenteeProgress(Long mentorUserId, Long menteeUserId) {

        requireUser(mentorUserId);

        ensureAssigned(mentorUserId, menteeUserId);

        User mentee = requireUser(menteeUserId);

        return userStatsMapper.toUserProgressResponse(mentee);
    }

    @Override
    @Transactional
    public MilestoneResponse addMilestoneNotes(Long milestoneId, Long mentorUserId, String notes) {

        requireUser(mentorUserId);

        MilestoneInstance milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Milestone not found with id: " + milestoneId
                ));

        User mentee = milestone.getRoadmap().getBusinessIdea().getMentee();

        ensureAssigned(mentorUserId, mentee.getId());

        milestone.setMentorNotes(notes);
        milestoneRepository.save(milestone);

        activityLogService.record(
                mentorRepository.findByUserId(mentorUserId)
                        .map(p -> p.getUser().getEmail())
                        .orElse(null),
                "Mentor note added",
                "Added guidance on milestone \"" + milestone.getTaskTitle() + "\" for "
                        + mentee.getFirstName() + " " + mentee.getLastName()
        );

        return userStatsMapper.toMilestoneResponse(milestone);
    }

    @Override
    public List<MentorProfileResponse> getPublicMentors() {

        List<MentorProfile> profiles = mentorRepository.findByIsAvailableTrueOrderByCreatedAtDesc();

        if (profiles.isEmpty()) {
            profiles = mentorRepository.findByIsFeaturedTrueOrderByCreatedAtDesc();
        }

        return profiles.stream()
                .map(mentorMapper::toResponse)
                .toList();
    }

    private void ensureAssigned(Long mentorUserId, Long menteeUserId) {

        boolean assigned = engagementRepository
                .existsByMentorIdAndMenteeId(mentorUserId, menteeUserId);

        if (!assigned) {
            throw new ResourceNotFoundException(
                    "No active mentorship between this mentor and the requested user."
            );
        }
    }

    private MentorProfile requireProfile(Long mentorUserId) {

        return mentorRepository.findByUserId(mentorUserId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Mentor profile not found for user id: " + mentorUserId
                ));
    }

    private User requireUser(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId
                ));
    }
}
