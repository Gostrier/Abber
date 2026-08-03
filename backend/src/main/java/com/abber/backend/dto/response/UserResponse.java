package com.abber.backend.dto.response;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Builder
public record UserResponse(

        Long id,

        UUID uuid,

        String firstName,

        String lastName,

        String email,

        Boolean isActive,

        Boolean emailVerified,

        String phoneNumber,

        String county,

        String town,

        String skills,

        Set<String> roles,

        LocalDateTime createdAt

) {}
