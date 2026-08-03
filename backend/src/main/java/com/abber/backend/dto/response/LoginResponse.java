package com.abber.backend.dto.response;

import lombok.Builder;

import java.util.Set;
import java.util.UUID;

@Builder
public record LoginResponse(

        UUID uuid,

        String email,

        String accessToken,

        String tokenType,

        Set<String> roles

) {
}