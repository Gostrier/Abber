package com.abber.backend.service.interfaces;

import com.abber.backend.dto.response.AdminUserResponse;
import com.abber.backend.dto.response.MentorProfileResponse;
import com.abber.backend.dto.response.MilestoneResponse;
import com.abber.backend.dto.response.UserProgressResponse;

import java.util.List;

public interface MentorService {

    MentorProfileResponse getMyProfile(Long mentorUserId);

    List<AdminUserResponse> getMyMentees(Long mentorUserId);

    UserProgressResponse getMenteeProgress(Long mentorUserId, Long menteeUserId);

    MilestoneResponse addMilestoneNotes(Long milestoneId, Long mentorUserId, String notes);

    List<MentorProfileResponse> getPublicMentors();
}
