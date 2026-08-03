package com.abber.backend.controller;

import com.abber.backend.dto.request.ChangePasswordRequest;
import com.abber.backend.dto.request.ForgotPasswordRequest;
import com.abber.backend.dto.request.LoginRequest;
import com.abber.backend.dto.request.LogoutRequest;
import com.abber.backend.dto.request.RefreshTokenRequest;
import com.abber.backend.dto.request.RegisterRequest;
import com.abber.backend.dto.request.ResendVerificationRequest;
import com.abber.backend.dto.request.ResetPasswordRequest;
import com.abber.backend.dto.response.AuthResponse;
import com.abber.backend.security.CurrentUserService;
import com.abber.backend.service.interfaces.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final CurrentUserService currentUserService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        AuthResponse response = authenticationService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping({"/verify", "/verify-email"})
    public ResponseEntity<String> verifyEmail(
            @RequestParam String token
    ) {

        authenticationService.verifyEmail(token);

        return ResponseEntity.ok(
                "Email verified successfully."
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {

        AuthResponse response = authenticationService.login(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @Valid @RequestBody RefreshTokenRequest request
    ) {

        AuthResponse response = authenticationService.refreshToken(request.getRefreshToken());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @Valid @RequestBody LogoutRequest request
    ) {

        authenticationService.logout(request.getRefreshToken());

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request
    ) {

        authenticationService.forgotPassword(request);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {

        authenticationService.resetPassword(request);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request
    ) {

        authenticationService.changePassword(
                currentUserService.getUserId(),
                request
        );

        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(
            @Valid @RequestBody ResendVerificationRequest request
    ) {

        authenticationService.resendVerificationToken(request.getEmail());

        return ResponseEntity.ok("Verification email resent.");
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {

        return ResponseEntity.ok("Authentication service is running.");
    }
}
