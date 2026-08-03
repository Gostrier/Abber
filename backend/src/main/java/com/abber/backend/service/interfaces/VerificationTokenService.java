package com.abber.backend.service.interfaces;

import com.abber.backend.entity.User;
import com.abber.backend.entity.VerificationToken;

public interface VerificationTokenService {

    /**
     * Creates a verification token for the specified user.
     *
     * @param user the user
     * @return the created verification token
     */
    VerificationToken createVerificationToken(User user);

    /**
     * Validates the supplied verification token.
     *
     * @param token verification token
     * @return valid verification token
     */
    VerificationToken validateToken(String token);

    /**
     * Deletes a verification token after successful verification.
     *
     * @param verificationToken token to delete
     */
    void deleteToken(VerificationToken verificationToken);

    void deleteExpiredTokens();
}