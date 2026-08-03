package com.abber.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.abber.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    Optional<User> findByUuid(UUID uuid);

    boolean existsByEmailIgnoreCase(String email);

    Optional<User> findByRefreshTokenHash(String refreshTokenHash);

    Optional<User> findByPasswordResetToken(String passwordResetToken);

    Optional<User> findByEmail(String email);

}