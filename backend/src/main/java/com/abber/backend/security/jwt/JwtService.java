package com.abber.backend.security.jwt;

import io.jsonwebtoken.Claims;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {

    String generateAccessToken(String username);

    String generateAccessToken(Map<String, Object> extraClaims, String username);

    String generateRefreshToken(String username);

    String extractUsername(String token);

    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);

    boolean isTokenValid(String token, UserDetails userDetails);

    boolean isTokenExpired(String token);
}