package com.abber.backend.repository;

import com.abber.backend.entity.User;
import com.abber.backend.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    Optional<VerificationToken> findByToken(UUID token);

    Optional<VerificationToken> findByUser(User user);

    boolean existsByToken(UUID token);

    void deleteByUser(User user);

    void deleteByToken(UUID token);

    void deleteAllByExpiresAtBefore(LocalDateTime expiresAt);

}