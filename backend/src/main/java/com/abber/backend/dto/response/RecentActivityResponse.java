package com.abber.backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RecentActivityResponse {

    private String action;
    private String detail;
    private LocalDateTime timestamp;

}
