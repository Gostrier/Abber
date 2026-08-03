package com.abber.backend.dto.response;

import lombok.Builder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Builder
public record AdminUserResponse(

        Long id,

        String firstName,

        String lastName,

        String email,

        Set<String> roles,

        Boolean isActive,

        Boolean emailVerified,

        LocalDateTime lastLoginAt,

        LocalDateTime createdAt,

        long ideasCount,

        long totalMilestones,

        long completedMilestones,

        BigDecimal progress

) {
}
