package com.abber.backend.service.impl;

import com.abber.backend.entity.User;
import com.abber.backend.entity.VerificationToken;
import com.abber.backend.exception.ResourceNotFoundException;
import com.abber.backend.repository.VerificationTokenRepository;
import com.abber.backend.service.interfaces.EmailService;
import com.abber.backend.service.interfaces.VerificationTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class VerificationTokenServiceImpl implements VerificationTokenService {

    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public VerificationToken createVerificationToken(User user) {

        verificationTokenRepository.findByUser(user)
                .ifPresent(verificationTokenRepository::delete);

        VerificationToken verificationToken = VerificationToken.builder()
                .token(UUID.randomUUID())
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();

        verificationTokenRepository.save(verificationToken);

        String verificationLink =
                frontendUrl + "/verify-email?token=" + verificationToken.getToken();

        log.info("Verification link for {}: {}", user.getEmail(), verificationLink);

        emailService.sendVerificationEmail(
                user.getEmail(),
                user.getFirstName(),
                verificationLink
        );

        return verificationToken;
    }

    @Override
    @Transactional(readOnly = true)
    public VerificationToken validateToken(String token) {

        UUID tokenUuid;
        try {
            tokenUuid = UUID.fromString(token);
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Invalid verification token format.");
        }

        VerificationToken verificationToken =
                verificationTokenRepository.findByToken(tokenUuid)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Invalid verification token."
                                ));

        if (verificationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Verification token has expired."
            );
        }

        return verificationToken;
    }

    @Override
    public void deleteToken(VerificationToken verificationToken) {

        verificationTokenRepository.delete(verificationToken);
    }

    @Override
    public void deleteExpiredTokens() {

        verificationTokenRepository.deleteAllByExpiresAtBefore(
                LocalDateTime.now()
        );
    }
}
