package com.abber.backend.dto.response;

import lombok.Builder;

@Builder
public record MenteeProfileResponse(

        Long menteeId,

        String firstName,

        String lastName,

        String email,

        String startupStage,

        String interests

) {
}
