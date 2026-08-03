package com.abber.backend.exception;

import lombok.Builder;
import java.time.LocalDateTime;

@Builder
public record ApiError<T>(
        boolean success,
        String message,
        int status,
        String path,
        String error,
        LocalDateTime timestamp,
        T data
) {}