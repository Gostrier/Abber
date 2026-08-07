package com.abber.backend.mapper;

import com.abber.backend.dto.response.MentorProfileResponse;
import com.abber.backend.entity.MentorProfile;
import com.abber.backend.entity.User;
import com.abber.backend.enums.EngagementStatus;
import com.abber.backend.repository.BusinessIdeaRepository;
import com.abber.backend.repository.MentorshipEngagementRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MentorMapper {

    private final MentorshipEngagementRepository engagementRepository;
    private final BusinessIdeaRepository businessIdeaRepository;

    public MentorProfileResponse toResponse(MentorProfile profile) {

        User mentor = profile.getUser();

        long menteeCount = engagementRepository.countByMentorId(mentor.getId());

        long ideasMentored = engagementRepository.findByMentorId(mentor.getId())
                .stream()
                .filter(e -> e.getStatus() == EngagementStatus.ACTIVE)
                .map(e -> e.getMentee())
                .mapToLong(mentee -> businessIdeaRepository
                        .countByMenteeAndIsArchivedFalse(mentee))
                .sum();

        String location = profile.getLocation();

        if (location == null || location.isBlank()) {
            StringBuilder sb = new StringBuilder();
            if (mentor.getCounty() != null && !mentor.getCounty().isBlank()) {
                sb.append(mentor.getCounty());
            }
            if (mentor.getTown() != null && !mentor.getTown().isBlank()) {
                if (sb.length() > 0) {
                    sb.append(", ");
                }
                sb.append(mentor.getTown());
            }
            location = sb.toString();
        }

        return MentorProfileResponse.builder()
                .mentorId(mentor.getId())
                .firstName(mentor.getFirstName())
                .lastName(mentor.getLastName())
                .email(mentor.getEmail())
                .specialty(profile.getSpecialty())
                .bio(profile.getBio())
                .yearsOfExperience(profile.getYearsOfExperience())
                .company(profile.getCompany())
                .location(location)
                .isAvailable(profile.getIsAvailable())
                .isFeatured(profile.getIsFeatured())
                .menteeCount(menteeCount)
                .ideasMentored(ideasMentored)
                .build();
    }
}
