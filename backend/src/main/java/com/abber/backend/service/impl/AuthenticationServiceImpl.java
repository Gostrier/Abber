package com.abber.backend.service.impl;

import com.abber.backend.dto.request.ChangePasswordRequest;
import com.abber.backend.dto.request.ForgotPasswordRequest;
import com.abber.backend.dto.request.LoginRequest;
import com.abber.backend.dto.request.RegisterRequest;
import com.abber.backend.dto.request.ResetPasswordRequest;
import com.abber.backend.dto.response.AuthResponse;
import com.abber.backend.entity.Role;
import com.abber.backend.entity.User;
import com.abber.backend.entity.VerificationToken;
import com.abber.backend.enums.RoleType;
import com.abber.backend.exception.ResourceNotFoundException;
import com.abber.backend.repository.RoleRepository;
import com.abber.backend.repository.UserRepository;
import com.abber.backend.repository.VerificationTokenRepository;
import com.abber.backend.security.jwt.JwtService;
import com.abber.backend.service.interfaces.ActivityLogService;
import com.abber.backend.service.interfaces.AuthenticationService;
import com.abber.backend.service.interfaces.EmailService;
import com.abber.backend.util.TokenHashingUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class AuthenticationServiceImpl implements AuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final VerificationTokenServiceImpl verificationTokenService;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;
    private final ActivityLogService activityLogService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        if (request.getConfirmPassword() != null &&
                !request.getConfirmPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        Role menteeRole = roleRepository.findByRoleName(RoleType.ROLE_MENTEE)
                .orElseThrow(() ->
                        new IllegalStateException("Default role ROLE_MENTEE not found."));

        User user = User.builder()
                .uuid(UUID.randomUUID())
                .firstName(request.getFirstName().trim())
                .lastName(request.getLastName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .isActive(true)
                .emailVerified(true)
                .phoneNumber(request.getPhoneNumber())
                .county(request.getCounty())
                .town(request.getTown())
                .skills(request.getSkills() != null ? String.join(",", request.getSkills()) : null)
                .build();

        user.addRole(menteeRole);

        User savedUser = userRepository.save(user);

        activityLogService.record(
                savedUser.getEmail(),
                "User registered",
                savedUser.getFirstName() + " " + savedUser.getLastName() + " created an account."
        );

        String accessToken = jwtService.generateAccessToken(savedUser.getEmail());
        String refreshToken = jwtService.generateRefreshToken(savedUser.getEmail());

        persistRefreshToken(savedUser, refreshToken);

        return buildAuthResponse(
                savedUser,
                accessToken,
                refreshToken,
                "Registration successful. Welcome to Abber!"
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() ->
                        new BadCredentialsException("Invalid email or password."));

        if (user.getLockedUntil() != null &&
                user.getLockedUntil().isBefore(LocalDateTime.now())) {
            user.unlockAccount();
            userRepository.save(user);
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException ex) {
            user.recordFailedLogin();
            userRepository.save(user);
            throw ex;
        } catch (LockedException ex) {
            throw ex;
        } catch (DisabledException ex) {
            throw new IllegalStateException(
                    "Your account has been deactivated. Contact support."
            );
        }

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            throw new IllegalStateException(
                    "Your account has been deactivated. Contact support."
            );
        }

        user.recordSuccessfulLogin();

        activityLogService.record(
                user.getEmail(),
                "User logged in",
                user.getFirstName() + " " + user.getLastName() + " signed in."
        );

        String accessToken = jwtService.generateAccessToken(user.getEmail());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        persistRefreshToken(user, refreshToken);

        return buildAuthResponse(
                user,
                accessToken,
                refreshToken,
                "Login successful."
        );
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {

        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token is required.");
        }

        String hash = TokenHashingUtil.sha256(refreshToken);

        User user = userRepository.findByRefreshTokenHash(hash)
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid refresh token."));

        if (user.getRefreshTokenExpiry() == null ||
                user.getRefreshTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Refresh token has expired.");
        }

        if (jwtService.isTokenExpired(refreshToken)) {
            throw new IllegalArgumentException("Refresh token has expired.");
        }

        String newAccessToken = jwtService.generateAccessToken(user.getEmail());
        String newRefreshToken = jwtService.generateRefreshToken(user.getEmail());

        persistRefreshToken(user, newRefreshToken);

        return buildAuthResponse(
                user,
                newAccessToken,
                newRefreshToken,
                "Tokens refreshed."
        );
    }

    @Override
    public void logout(String refreshToken) {

        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }

        userRepository.findByRefreshTokenHash(TokenHashingUtil.sha256(refreshToken))
                .ifPresent(user -> {
                    user.setRefreshTokenHash(null);
                    user.setRefreshTokenExpiry(null);
                    userRepository.save(user);
                });
    }

    @Override
    public void verifyEmail(String token) {

        VerificationToken verificationToken =
                verificationTokenService.validateToken(token);

        User user = verificationToken.getUser();

        user.setEmailVerified(true);
        user.setIsActive(true);

        userRepository.save(user);

        verificationTokenService.deleteToken(verificationToken);

        emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());
    }

    @Override
    public void resendVerificationToken(String email) {

        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {

            if (Boolean.TRUE.equals(user.getEmailVerified())) {
                return;
            }

            verificationTokenRepository.findByUser(user)
                    .ifPresent(verificationTokenRepository::delete);

            verificationTokenService.createVerificationToken(user);
        });
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {

        String rawToken = UUID.randomUUID().toString();

        userRepository.findByEmailIgnoreCase(request.getEmail())
                .ifPresent(user -> {
                    user.setPasswordResetToken(TokenHashingUtil.sha256(rawToken));
                    user.setPasswordResetExpiry(LocalDateTime.now().plusHours(24));
                    userRepository.save(user);

                    String resetLink =
                            frontendUrl + "/reset-password?token=" + rawToken;

                    log.info("Password reset link for {}: {}", user.getEmail(), resetLink);

                    emailService.sendPasswordResetEmail(
                            user.getEmail(),
                            user.getFirstName(),
                            resetLink
                    );
                });
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {

        if (request.getConfirmPassword() != null &&
                !request.getConfirmPassword().equals(request.getNewPassword())) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        String hash = TokenHashingUtil.sha256(request.getToken());

        User user = userRepository.findByPasswordResetToken(hash)
                .orElseThrow(() ->
                        new IllegalArgumentException("Invalid or expired reset token."));

        if (user.getPasswordResetExpiry() == null ||
                user.getPasswordResetExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiry(null);
        user.setRefreshTokenHash(null);
        user.setRefreshTokenExpiry(null);

        userRepository.save(user);
    }

    @Override
    public void changePassword(Long userId, ChangePasswordRequest request) {

        if (request.getConfirmPassword() != null &&
                !request.getConfirmPassword().equals(request.getNewPassword())) {
            throw new IllegalArgumentException("Passwords do not match.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found with id: " + userId
                ));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setRefreshTokenHash(null);
        user.setRefreshTokenExpiry(null);

        userRepository.save(user);
    }

    private void persistRefreshToken(User user, String rawRefreshToken) {
        user.setRefreshTokenHash(TokenHashingUtil.sha256(rawRefreshToken));
        user.setRefreshTokenExpiry(LocalDateTime.now().plusDays(7));
        userRepository.save(user);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken, String message) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .message(message)
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .roles(user.getRoleNames().stream().toList())
                .build();
    }
}
