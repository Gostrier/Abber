package com.abber.backend.dto.request;

import com.abber.backend.enums.ExecutionStage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateBusinessIdeaRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title must be at most 255 characters")
    private String title;

    @NotBlank(message = "Elevator pitch is required")
    private String elevatorPitch;

    private String detailedDescription;

    private String targetMarket;

    private String uniqueValueProposition;

    @NotNull(message = "Execution stage is required")
    private ExecutionStage executionStage;

    private BigDecimal estimatedStartupCost;

    private BigDecimal projectedMonthlyRevenue;

    private BigDecimal projectedMonthlyExpenses;

    private Boolean isPublicShowcase;

}
