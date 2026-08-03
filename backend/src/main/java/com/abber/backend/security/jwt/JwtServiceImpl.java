package com.abber.backend.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtServiceImpl implements JwtService {

    private final JwtProperties jwtProperties;

    @Override
    public String generateAccessToken(String username) {
        return generateAccessToken(new HashMap<>(), username);
    }

    @Override
    public String generateAccessToken(Map<String, Object> extraClaims,
                                      String username) {

        return buildToken(
                extraClaims,
                username,
                jwtProperties.getAccessTokenExpiration()
        );
    }

    @Override
    public String generateRefreshToken(String username) {

        return buildToken(
                new HashMap<>(),
                username,
                jwtProperties.getRefreshTokenExpiration()
        );
    }

    private String buildToken(Map<String, Object> claims,
                              String username,
                              long expiration) {

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    @Override
    public String extractUsername(String token) {

        return extractClaim(
                token,
                Claims::getSubject
        );
    }

    @Override
    public <T> T extractClaim(String token,
                              Function<Claims, T> claimsResolver) {

        Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);
    }

    @Override
    public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return username.equals(userDetails.getUsername())
            && !isTokenExpired(token);
 }

    @Override
    public boolean isTokenExpired(String token) {

        return extractClaim(
                token,
                Claims::getExpiration
        ).before(new Date());
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(
                jwtProperties.getSecretKey());

        return Keys.hmacShaKeyFor(keyBytes);
    }

}