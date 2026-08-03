package com.abber.backend.util;

import lombok.Builder;

@Builder
public record ApiResponse<T>(

        boolean success,

        String message,

        T data

) {
}
