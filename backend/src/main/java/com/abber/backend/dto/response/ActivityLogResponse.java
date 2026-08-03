package com.abber.backend.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ActivityLogResponse(

        Long id,

        Long userId,

        String userEmail,

        String action,

        String detail,

        LocalDateTime timestamp

) {
}
