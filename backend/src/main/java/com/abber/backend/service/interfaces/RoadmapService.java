package com.abber.backend.service.interfaces;

import com.abber.backend.dto.request.CreateMilestoneRequest;
import com.abber.backend.dto.request.UpdateMilestoneStatusRequest;
import com.abber.backend.dto.response.BusinessRoadmapResponse;
import com.abber.backend.dto.response.MilestoneResponse;

import java.util.List;

public interface RoadmapService {

    BusinessRoadmapResponse getRoadmapForIdea(Long ideaId, Long userId);

    BusinessRoadmapResponse createRoadmapForIdea(Long ideaId, Long userId);

    List<MilestoneResponse> getMilestones(Long roadmapId, Long userId);

    MilestoneResponse addMilestone(Long roadmapId, Long userId, CreateMilestoneRequest request);

    MilestoneResponse updateMilestoneStatus(Long milestoneId, Long userId, UpdateMilestoneStatusRequest request);

}
