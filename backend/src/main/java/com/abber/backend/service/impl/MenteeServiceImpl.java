package com.abber.backend.service.impl;

import com.abber.backend.dto.response.MenteeProfileResponse;
import com.abber.backend.dto.response.MentorProfileResponse;
import com.abber.backend.entity.MenteeProfile;
import com.abber.backend.entity.MentorProfile;
import com.abber.backend.entity.MentorshipEngagement;
import com.abber.backend.entity.User;
import com.abber.backend.enums.EngagementStatus;
import com.abber.backend.exception.ResourceNotFoundException;
import com.abber.backend.mapper.MentorMapper;
import com.abber.backend.repository.MenteeRepository;
import com.abber.backend.repository.MentorRepository;
import com.abber.backend.repository.MentorshipEngagementRepository;
import com.abber.backend.repository.UserRepository;
import com.abber.backend.service.interfaces.MenteeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenteeServiceImpl implements MenteeService {

    private final MenteeRepository menteeRepository;
    private final MentorRepository mentorRepository;
    private final MentorMapper mentorMapper;
    private final MentorshipEngagementRepository engagementRepository;
    private final UserRepository userRepository;

    @Override
    public MentorProfileResponse getAssignedMentor(Long menteeUserId) {

        requireUser(menteeUserId);

        return engagementRepository.findByMenteeIdAndStatus(
                        menteeUserId,
                        EngagementStatus.ACTIVE
                )
                .map(MentorshipEngagement::getMentor)
                .map(User::getId)
                .map(mentorRepository::findByUserId)
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(mentorMapper::toResponse)
                .orElse(null);
    }

    @Override
    public MenteeProfileResponse getMyProfile(Long menteeUserId) {

        User user = requireUser(menteeUserId);

        MenteeProfile profile = menteeRepository.findByUserId(menteeUserId)
                .orElse(null);

        return MenteeProfileResponse.builder()
                .menteeId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .startupStage(profile == null ? null : profile.getStartupStage())
                .interests(profile == null ? null : profile.getInterests())
                .build();
    }

    private User requireUser(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId
                ));
    }
}
