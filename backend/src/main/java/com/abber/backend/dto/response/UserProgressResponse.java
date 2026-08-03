package com.abber.backend.dto.response;

import lombok.Builder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Builder
public record UserProgressResponse(

        Long userId,

        String firstName,

        String lastName,

        String email,

        Set<String> roles,

        BigDecimal overallProgress,

        List<IdeaProgress> ideas

) {

    @Builder
    public record IdeaProgress(
            BusinessIdeaResponse idea,
            BusinessRoadmapResponse roadmap
    ) {
    }

}
