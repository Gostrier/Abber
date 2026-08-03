package com.abber.backend.security.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS = 10;
    private static final long WINDOW_MILLIS = 60_000L;

    private final ConcurrentMap<String, Window> windows = new ConcurrentHashMap<>();

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        return !(path.startsWith("/api/auth/login")
                || path.startsWith("/api/auth/register")
                || path.startsWith("/api/auth/forgot-password"));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String key = request.getRemoteAddr();

        long now = System.currentTimeMillis();

        Window window = windows.compute(key, (k, existing) -> {
            if (existing == null || now - existing.startedAt > WINDOW_MILLIS) {
                return new Window(now, new AtomicInteger(0));
            }
            return existing;
        });

        if (window.count.incrementAndGet() > MAX_REQUESTS) {
            response.setStatus(429);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(
                    "{\"status\":429,\"error\":\"Too Many Requests\",\"message\":\"Too many attempts. Please try again later.\"}"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }

    private record Window(long startedAt, AtomicInteger count) {
    }
}
