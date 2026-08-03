package com.abber.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;

    private String message;

    private String refreshToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private Long userId;

    private String firstName;

    private String lastName;

    private String email;

    private List<String> roles;
}
