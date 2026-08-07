package com.abber.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignMentorRequest {

    @NotNull(message = "Mentor id is required.")
    private Long mentorId;

    @NotNull(message = "Mentee id is required.")
    private Long menteeId;
}
