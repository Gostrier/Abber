package com.abber.backend.dto.request;

import com.abber.backend.enums.MilestoneStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateMilestoneStatusRequest {

    @NotNull(message = "Status is required")
    private MilestoneStatus status;

}
