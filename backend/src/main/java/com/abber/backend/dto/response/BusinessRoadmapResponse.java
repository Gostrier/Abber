package com.abber.backend.dto.response;

import com.abber.backend.enums.ExecutionStage;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BusinessRoadmapResponse {

    private Long id;
    private Long businessIdeaId;
    private BigDecimal overallCompletionPercentage;
    private ExecutionStage currentPhase;
    private LocalDateTime startedAt;
    private LocalDate expectedCompletionDate;
    private LocalDateTime completedAt;
    private LocalDateTime lastActivityAt;
    private List<MilestoneResponse> milestones;

}
