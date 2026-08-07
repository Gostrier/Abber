package com.abber.backend.service.interfaces;

import com.abber.backend.dto.response.MenteeProfileResponse;
import com.abber.backend.dto.response.MentorProfileResponse;

public interface MenteeService {

    MentorProfileResponse getAssignedMentor(Long menteeUserId);

    MenteeProfileResponse getMyProfile(Long menteeUserId);
}
