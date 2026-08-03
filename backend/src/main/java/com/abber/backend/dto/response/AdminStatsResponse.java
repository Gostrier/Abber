package com.abber.backend.dto.response;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;

@Builder
public record AdminStatsResponse(

        long totalUsers,

        long totalMentors,

        long totalMentees,

        long totalAdmins,

        long totalIdeas,

        long totalRoadmaps,

        long totalMilestones,

        long completedMilestones,

        long registrationsToday,

        long loginsToday,

        BigDecimal averageProgress,

        List<StageCount> ideasByStage,

        List<DailyCount> registrationsLast7Days

) {

    @Builder
    public record StageCount(String stage, long count) {
    }

    @Builder
    public record DailyCount(String date, long count) {
    }

}
