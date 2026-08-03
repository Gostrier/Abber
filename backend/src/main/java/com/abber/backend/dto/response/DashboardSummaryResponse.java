package com.abber.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardSummaryResponse {

    private long activeIdeasCount;
    private long completedMilestonesCount;
    private long totalMilestonesCount;
    private BigDecimal overallProgress;
    private String mentorName;
    private String mentorSpecialty;
    private BusinessIdeaResponse latestIdea;
    private BusinessRoadmapResponse latestRoadmap;
    private List<RecentActivityResponse> recentActivity;

}
