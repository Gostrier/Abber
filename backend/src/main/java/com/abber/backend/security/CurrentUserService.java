package com.abber.backend.security;

import com.abber.backend.entity.User;
import com.abber.backend.exception.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserService {

    public User getUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null
                || !(authentication.getPrincipal() instanceof User user)) {

            throw new UnauthorizedException(
                    "User is not authenticated."
            );
        }

        return user;
    }

    public String getEmail() {
        return getUser().getEmail();
    }

    public Long getUserId() {
        return getUser().getId();
    }

}
