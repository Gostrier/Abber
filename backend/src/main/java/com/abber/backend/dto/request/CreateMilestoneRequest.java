package com.abber.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateMilestoneRequest {

    @NotNull(message = "Sequence order is required")
    private Integer sequenceOrder;

    @NotBlank(message = "Task title is required")
    private String taskTitle;

    private String taskDescription;

    private LocalDate dueDate;

}
