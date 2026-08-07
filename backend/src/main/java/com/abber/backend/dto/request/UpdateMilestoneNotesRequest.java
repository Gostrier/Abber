package com.abber.backend.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateMilestoneNotesRequest {

    @Size(max = 2000)
    private String notes;
}
