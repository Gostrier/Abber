package com.abber.backend.dto.response;

import com.abber.backend.enums.MilestoneStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class MilestoneResponse {

    private Long id;
    private Integer sequenceOrder;
    private String taskTitle;
    private String taskDescription;
    private MilestoneStatus status;
    private String mentorNotes;
    private LocalDate dueDate;
    private LocalDateTime completedAt;

}
