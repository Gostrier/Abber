package com.abber.backend.service.interfaces;

import com.abber.backend.dto.request.CreateMentorRequest;
import com.abber.backend.dto.response.AdminStatsResponse;
import com.abber.backend.dto.response.AdminUserResponse;
import com.abber.backend.dto.response.ActivityLogResponse;
import com.abber.backend.dto.response.MentorProfileResponse;
import com.abber.backend.dto.response.UserProgressResponse;
import com.abber.backend.enums.RoleType;

import java.util.List;

public interface AdminService {

    AdminStatsResponse getStats();

    List<ActivityLogResponse> getActivityLogs();

    List<AdminUserResponse> getUsersWithProgress();

    UserProgressResponse getUserProgress(Long userId);

    void updateUserRole(Long userId, RoleType roleName, boolean grant);

    MentorProfileResponse createMentor(CreateMentorRequest request);

    List<MentorProfileResponse> getMentors();

    MentorProfileResponse getMentor(Long mentorUserId);

    List<AdminUserResponse> getMenteesForMentor(Long mentorUserId);

    void assignMentor(Long mentorUserId, Long menteeUserId);

    void unassignMentor(Long mentorUserId, Long menteeUserId);

}
