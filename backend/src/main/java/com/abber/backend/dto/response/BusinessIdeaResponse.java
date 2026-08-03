package com.abber.backend.dto.response;

import com.abber.backend.enums.ExecutionStage;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class BusinessIdeaResponse {

    private Long id;
    private String title;
    private String elevatorPitch;
    private String detailedDescription;
    private String targetMarket;
    private String uniqueValueProposition;
    private ExecutionStage executionStage;
    private BigDecimal estimatedStartupCost;
    private BigDecimal projectedMonthlyRevenue;
    private BigDecimal projectedMonthlyExpenses;
    private Boolean isPublicShowcase;
    private Boolean isArchived;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
